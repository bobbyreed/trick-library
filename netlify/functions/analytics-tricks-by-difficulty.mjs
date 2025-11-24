import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Group tricks by difficulty level
    const result = await sql`
      SELECT
        difficulty,
        COUNT(*) as trick_count,
        COUNT(CASE WHEN landed = true THEN 1 END) as landed_count,
        ROUND(100.0 * COUNT(CASE WHEN landed = true THEN 1 END) / COUNT(*), 2) as landed_percentage,
        CASE
          WHEN difficulty <= 2 THEN 'Beginner'
          WHEN difficulty = 3 THEN 'Intermediate'
          WHEN difficulty >= 4 THEN 'Advanced'
        END as skill_level
      FROM tricks
      GROUP BY difficulty
      HAVING COUNT(*) > 0
      ORDER BY difficulty ASC
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
    console.error('Database error in analytics-tricks-by-difficulty:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
