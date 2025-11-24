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
    const id = url.searchParams.get('skater_id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'skater_id parameter required' }),
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
    const { name, stance, hometown, pro_status } = body;

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (stance !== undefined) {
      updates.push(`stance = $${paramCount++}`);
      values.push(stance);
    }
    if (hometown !== undefined) {
      updates.push(`hometown = $${paramCount++}`);
      values.push(hometown);
    }
    if (pro_status !== undefined) {
      updates.push(`pro_status = $${paramCount++}`);
      values.push(pro_status);
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
      `UPDATE skaters SET ${updates.join(', ')} WHERE skater_id = $${paramCount} RETURNING *`,
      values
    );

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Skater not found' }),
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
