import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Get table structures
    const [tricks, skaters, locations] = await Promise.all([
      sql`SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = 'tricks'
          ORDER BY ordinal_position`,
      sql`SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = 'skaters'
          ORDER BY ordinal_position`,
      sql`SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = 'locations'
          ORDER BY ordinal_position`
    ]);

    // Get foreign key relationships
    const foreignKeys = await sql`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name IN ('tricks', 'skaters', 'locations')
    `;

    return new Response(JSON.stringify({
      tables: {
        tricks,
        skaters,
        locations
      },
      foreign_keys: foreignKeys
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
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
