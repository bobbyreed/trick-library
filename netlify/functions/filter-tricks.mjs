import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    const url = new URL(req.url);

    // Filter parameters
    const difficulty = url.searchParams.get('difficulty');
    const type = url.searchParams.get('type');
    const landed = url.searchParams.get('landed');
    const minDifficulty = url.searchParams.get('minDifficulty');
    const maxDifficulty = url.searchParams.get('maxDifficulty');

    // Sort parameters
    const sortBy = url.searchParams.get('sortBy') || 'trick_id';
    const order = url.searchParams.get('order') || 'ASC';

    // Whitelist valid sort columns (security)
    const validSortColumns = ['trick_id', 'name', 'difficulty', 'type', 'landed'];
    if (!validSortColumns.includes(sortBy)) {
      return new Response(
        JSON.stringify({ error: `Invalid sort column. Must be one of: ${validSortColumns.join(', ')}` }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Validate order
    const validOrders = ['ASC', 'DESC'];
    if (!validOrders.includes(order.toUpperCase())) {
      return new Response(
        JSON.stringify({ error: 'Invalid order. Must be ASC or DESC' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Build WHERE clause
    const conditions = [];
    const values = [];
    let paramCount = 1;

    if (difficulty) {
      conditions.push(`difficulty = $${paramCount++}`);
      values.push(parseInt(difficulty));
    }
    if (type) {
      conditions.push(`type = $${paramCount++}`);
      values.push(type);
    }
    if (landed !== null && landed !== undefined) {
      conditions.push(`landed = $${paramCount++}`);
      values.push(landed === 'true');
    }
    if (minDifficulty) {
      conditions.push(`difficulty >= $${paramCount++}`);
      values.push(parseInt(minDifficulty));
    }
    if (maxDifficulty) {
      conditions.push(`difficulty <= $${paramCount++}`);
      values.push(parseInt(maxDifficulty));
    }

    const sql = neon(process.env.DATABASE_URL);

    // Build query
    let query = 'SELECT * FROM tricks';
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ` ORDER BY ${sortBy} ${order.toUpperCase()}`;

    const result = await sql(query, values);

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
    console.error('Database error in filter-tricks:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
