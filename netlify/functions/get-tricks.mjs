import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    // Connect to database using environment variable
    const sql = neon(process.env.DATABASE_URL);

    // Replace with YOUR table name
    const result = await sql`SELECT * FROM tricks`;

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

exports.handler = async (event, context) => {
  try {
    // Fetch all three tables in parallel
    const [table1, table2, table3] = await Promise.all([
      pool.query('SELECT * FROM your_first_table ORDER BY id'),
      pool.query('SELECT * FROM your_second_table ORDER BY id'),
      pool.query('SELECT * FROM your_third_table ORDER BY id')
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        firstTable: table1.rows,
        secondTable: table2.rows,
        thirdTable: table3.rows
      })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};