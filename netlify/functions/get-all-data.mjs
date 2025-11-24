import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    // Connect to database using environment variable
    const sql = neon(process.env.DATABASE_URL);

    // Fetch all three tables in parallel for better performance
    const [skaters, tricks, locations] = await Promise.all([
      sql`SELECT * FROM skaters ORDER BY skater_id`,
      sql`SELECT * FROM tricks ORDER BY trick_id`,
      sql`SELECT * FROM locations ORDER BY location_id`
    ]);

    return new Response(JSON.stringify({
      firstTable: skaters,
      secondTable: tricks,
      thirdTable: locations
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
    console.error('Database error in get-all-data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
