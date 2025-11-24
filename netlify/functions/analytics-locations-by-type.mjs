import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Group locations by type
    const result = await sql`
      SELECT
        type,
        COUNT(*) as location_count,
        COUNT(CASE WHEN active = true THEN 1 END) as active_count,
        COUNT(CASE WHEN active = false THEN 1 END) as inactive_count,
        ROUND(100.0 * COUNT(CASE WHEN active = true THEN 1 END) / COUNT(*), 2) as active_percentage
      FROM locations
      GROUP BY type
      HAVING COUNT(*) > 0
      ORDER BY location_count DESC
    `;

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Database error in analytics-locations-by-type:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
