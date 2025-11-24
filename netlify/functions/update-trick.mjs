import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    // Only accept PUT requests
    if (req.method !== 'PUT') {
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

    // Parse request body
    const body = await req.json();
    const { name, description, difficulty, type, landed, videoUrl } = body;

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (difficulty !== undefined) {
      updates.push(`difficulty = $${paramCount++}`);
      values.push(difficulty);
    }
    if (type !== undefined) {
      updates.push(`type = $${paramCount++}`);
      values.push(type);
    }
    if (landed !== undefined) {
      updates.push(`landed = $${paramCount++}`);
      values.push(landed);
    }
    if (videoUrl !== undefined) {
      updates.push(`videoUrl = $${paramCount++}`);
      values.push(videoUrl);
    }

    if (updates.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No fields to update' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    values.push(id);
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql(
      `UPDATE tricks SET ${updates.join(', ')} WHERE trick_id = $${paramCount} RETURNING *`,
      values
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

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT',
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
