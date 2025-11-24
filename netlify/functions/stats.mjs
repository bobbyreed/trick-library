import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Fetch aggregate statistics from all tables in parallel
    const [trickStats, skaterStats, locationStats] = await Promise.all([
      // Trick statistics
      sql`SELECT
        COUNT(*) as total_tricks,
        COUNT(CASE WHEN landed = true THEN 1 END) as landed_tricks,
        COUNT(CASE WHEN landed = false THEN 1 END) as not_landed_tricks,
        AVG(difficulty) as avg_difficulty,
        MIN(difficulty) as min_difficulty,
        MAX(difficulty) as max_difficulty,
        COUNT(DISTINCT type) as unique_types
      FROM tricks`,

      // Skater statistics
      sql`SELECT
        COUNT(*) as total_skaters,
        COUNT(CASE WHEN pro_status = true THEN 1 END) as pro_skaters,
        COUNT(CASE WHEN pro_status = false THEN 1 END) as amateur_skaters,
        COUNT(DISTINCT hometown) as unique_hometowns,
        COUNT(DISTINCT stance) as unique_stances
      FROM skaters`,

      // Location statistics
      sql`SELECT
        COUNT(*) as total_locations,
        COUNT(CASE WHEN active = true THEN 1 END) as active_locations,
        COUNT(CASE WHEN active = false THEN 1 END) as inactive_locations,
        COUNT(DISTINCT type) as unique_location_types
      FROM locations`
    ]);

    const stats = {
      tricks: trickStats[0],
      skaters: skaterStats[0],
      locations: locationStats[0],
      generated_at: new Date().toISOString()
    };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Database error in stats:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
