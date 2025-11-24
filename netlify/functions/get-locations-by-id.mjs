import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const id = url.searchParams.get('location_id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'location_id parameter required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    // Parameterized query (prevents SQL injection)
    const result = await sql(
      'SELECT * FROM locations WHERE location_id = $1',
      [id]
    );

    return new Response(JSON.stringify(result[0] || {}), {
      status: result.length > 0 ? 200 : 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
