import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Fetch all data with potential relationships
    // This creates a comprehensive view of all database contents

    const [tricks, skaters, locations, stats] = await Promise.all([
      sql`SELECT * FROM tricks ORDER BY trick_id`,
      sql`SELECT * FROM skaters ORDER BY skater_id`,
      sql`SELECT * FROM locations ORDER BY location_id`,
      // Quick stats
      sql`SELECT
        (SELECT COUNT(*) FROM tricks) as total_tricks,
        (SELECT COUNT(*) FROM skaters) as total_skaters,
        (SELECT COUNT(*) FROM locations) as total_locations,
        (SELECT AVG(difficulty) FROM tricks) as avg_difficulty
      `
    ]);

    return new Response(JSON.stringify({
      tricks,
      skaters,
      locations,
      summary: stats[0],
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
    console.error('Database error in combined-data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
