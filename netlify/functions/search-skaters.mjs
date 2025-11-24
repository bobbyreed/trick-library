import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('q');

    if (!searchQuery) {
      return new Response(
        JSON.stringify({ error: 'Search query parameter "q" is required' }),
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

    // Use ILIKE for case-insensitive search
    const searchPattern = `%${searchQuery}%`;
    const result = await sql(
      `SELECT * FROM skaters
       WHERE name ILIKE $1
       OR hometown ILIKE $1
       OR stance ILIKE $1
       ORDER BY name ASC`,
      [searchPattern]
    );

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
    console.error('Database error in search-skaters:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
