import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Parse request body
    const body = await req.json();
    const { name, stance, hometown, pro_status } = body;

    // Validate required fields
    if (!name) {
      return new Response(
        JSON.stringify({ error: 'Name is required' }),
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

    // Insert with parameterized query
    const result = await sql(
      'INSERT INTO skaters (name, stance, hometown, pro_status) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, stance || null, hometown || null, pro_status !== undefined ? pro_status : false]
    );

    return new Response(JSON.stringify(result[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
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
