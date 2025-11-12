import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Parse request body
    const body = await req.json();
    const { type, active } = body;

    // Validate input
    if (!type) {
      return new Response(
        JSON.stringify({ error: 'Type is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate type against CHECK constraint
    const validTypes = ['Skateshop', 'Spot', 'Skatepark'];
    if (!validTypes.includes(type)) {
      return new Response(
        JSON.stringify({ error: `Type must be one of: ${validTypes.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    // Insert with parameterized query
    const result = await sql(
      'INSERT INTO locations (type, active) VALUES ($1, $2) RETURNING *',
      [type, active !== undefined ? active : true]
    );

    return new Response(JSON.stringify(result[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};