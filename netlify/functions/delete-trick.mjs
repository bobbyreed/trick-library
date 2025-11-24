import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    // Only accept DELETE requests
    if (req.method !== 'DELETE') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Parse query parameters
    const url = new URL(req.url);
    const id = url.searchParams.get('trick_id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'trick_id parameter required' }),
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

    // Delete with parameterized query
    const result = await sql(
      'DELETE FROM tricks WHERE trick_id = $1 RETURNING *',
      [id]
    );

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Trick not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Trick deleted successfully', deleted: result[0] }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'DELETE',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
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
