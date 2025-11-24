import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not configured');
    }

    const sql = neon(process.env.DATABASE_URL);

    // Try to use the dashboard_overview view if it exists
    // Otherwise fall back to direct queries
    let dashboard;

    try {
      // Use the view (requires views.sql to be run in Neon first)
      dashboard = await sql`SELECT * FROM dashboard_overview`;
      dashboard = dashboard[0];
    } catch (viewError) {
      // Fallback: calculate directly if view doesn't exist
      console.log('View not found, calculating directly:', viewError.message);

      try {
        const [trickStats, skaterStats, locationStats] = await Promise.all([
          sql`SELECT
            COUNT(*) as total_tricks,
            COALESCE(AVG(difficulty), 0) as avg_trick_difficulty,
            COUNT(CASE WHEN landed = true THEN 1 END) as tricks_landed
          FROM tricks`,
          sql`SELECT
            COUNT(*) as total_skaters,
            COUNT(CASE WHEN pro_status = true THEN 1 END) as pro_skaters
          FROM skaters`,
          sql`SELECT
            COUNT(*) as total_locations,
            COUNT(CASE WHEN active = true THEN 1 END) as active_locations
          FROM locations`
        ]);

        dashboard = {
          ...trickStats[0],
          ...skaterStats[0],
          ...locationStats[0]
        };
      } catch (queryError) {
        console.error('Error querying tables:', queryError);
        throw new Error(`Database query failed: ${queryError.message}`);
      }
    }

    // Get additional breakdown data (with error handling)
    let typeBreakdown = [];
    let difficultyBreakdown = [];
    let locationBreakdown = [];

    try {
      [typeBreakdown, difficultyBreakdown, locationBreakdown] = await Promise.all([
        sql`SELECT type, COUNT(*) as count FROM tricks GROUP BY type ORDER BY count DESC`,
        sql`SELECT difficulty, COUNT(*) as count FROM tricks GROUP BY difficulty ORDER BY difficulty`,
        sql`SELECT type, COUNT(*) as count FROM locations GROUP BY type ORDER BY count DESC`
      ]);
    } catch (breakdownError) {
      console.error('Error getting breakdowns (non-fatal):', breakdownError.message);
      // Continue with empty breakdowns rather than failing completely
    }

    return new Response(JSON.stringify({
      overview: dashboard,
      breakdowns: {
        trick_types: typeBreakdown,
        trick_difficulties: difficultyBreakdown,
        location_types: locationBreakdown
      },
      generated_at: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Database error in dashboard:', error);
    return new Response(JSON.stringify({
      error: error.message,
      details: 'Check Netlify function logs for more information'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
