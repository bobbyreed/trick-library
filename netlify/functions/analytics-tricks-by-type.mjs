import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Group tricks by type with aggregate statistics
    const result = await sql`
      SELECT
        type,
        COUNT(*) as trick_count,
        AVG(difficulty) as avg_difficulty,
        MIN(difficulty) as min_difficulty,
        MAX(difficulty) as max_difficulty,
        COUNT(CASE WHEN landed = true THEN 1 END) as landed_count,
        COUNT(CASE WHEN landed = false THEN 1 END) as not_landed_count,
        ROUND(100.0 * COUNT(CASE WHEN landed = true THEN 1 END) / COUNT(*), 2) as landed_percentage
      FROM tricks
      GROUP BY type
      HAVING COUNT(*) > 0
      ORDER BY trick_count DESC
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
    console.error('Database error in analytics-tricks-by-type:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
