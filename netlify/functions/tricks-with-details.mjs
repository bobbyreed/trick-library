import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // This endpoint assumes there might be FK relationships
    // If skater_id or location_id exist as FKs in tricks table, this will work
    // Otherwise, it returns tricks with NULL for related data

    const result = await sql`
      SELECT
        t.*,
        s.name as skater_name,
        s.stance as skater_stance,
        s.hometown as skater_hometown,
        l.type as location_type,
        l.active as location_active
      FROM tricks t
      LEFT JOIN skaters s ON t.skater_id = s.skater_id
      LEFT JOIN locations l ON t.location_id = l.location_id
      ORDER BY t.trick_id
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
    // If the JOIN fails (no FK columns exist), return just tricks
    console.error('JOIN error, falling back to simple query:', error.message);

    try {
      const sql = neon(process.env.DATABASE_URL);
      const fallback = await sql`SELECT * FROM tricks ORDER BY trick_id`;

      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    } catch (fallbackError) {
      return new Response(JSON.stringify({ error: fallbackError.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
