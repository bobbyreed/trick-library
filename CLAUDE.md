# Claude Reference - Trick Library

## Quick Context
Skateboarding trick database. 3 tables: `skaters`, `tricks`, `locations`.
DB hosted on Neon PostgreSQL. Functions on Netlify.

## DB Schema Quick Ref
```sql
skaters (skater_id, ...)
tricks (trick_id, name, description, difficulty, type, landed, videoUrl)
locations (location_id, type CHECK('Skateshop','Spot','Skatepark'), active)
```

## Current State
- ✅ Basic GET endpoints for all tables
- ✅ GET by ID for skaters only
- ✅ POST for locations only
- ✅ Basic frontend displays all tables
- ❌ No UPDATE/DELETE yet
- ❌ No filtering/search/sort
- ❌ No JOINs implemented
- ❌ No indexes or views
- ❌ Missing CORS on some endpoints

## Common Tasks

### Add New Function
1. Create file: `netlify/functions/{name}.mjs`
2. Import: `import { neon } from '@neondatabase/serverless';`
3. Export default async handler
4. Use `process.env.DATABASE_URL`
5. Return Response with JSON + CORS headers

### Function Template
```javascript
import { neon } from '@neondatabase/serverless';

export default async (req) => {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT * FROM table`;

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### Parameterized Queries (SQL Injection Prevention)
```javascript
// Good - parameterized
const result = await sql('SELECT * FROM tricks WHERE trick_id = $1', [id]);

// Bad - vulnerable
const result = await sql`SELECT * FROM tricks WHERE trick_id = ${id}`;
```

### CORS Headers (Required)
```javascript
headers: {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type'
}
```

## Lecture 6-9 Checklist Status

### Lecture 6 - Basic CRUD
- [x] Neon DB setup
- [x] Netlify setup & deploy
- [x] Basic GET endpoints
- [x] GET by ID (skaters only)
- [x] POST (locations only)
- [ ] PUT endpoints
- [ ] DELETE endpoints
- [ ] Complete CRUD for all tables

### Lecture 7 - SQL Filtering/Sorting
- [ ] WHERE filtering endpoints
- [ ] ORDER BY sorting
- [ ] LIKE search
- [ ] Aggregate functions (COUNT, AVG, etc.)
- [ ] GROUP BY analytics
- [ ] DISTINCT queries

### Lecture 8 - JOINs & Subqueries
- [ ] JOIN endpoints (tricks + skaters, tricks + locations)
- [ ] LEFT/RIGHT/FULL OUTER JOINs
- [ ] Subqueries (IN, EXISTS, ANY/ALL)
- [ ] Set operations (UNION, INTERSECT)

### Lecture 9 - Performance
- [ ] Create indexes (WHERE, JOIN, ORDER BY columns)
- [ ] Create views for complex queries
- [ ] EXPLAIN ANALYZE benchmarks
- [ ] Measure before/after performance
- [ ] Optional: triggers, stored procedures

## Common Queries for This Project

### Search tricks by name
```sql
SELECT * FROM tricks WHERE name ILIKE '%kickflip%'
```

### Filter by difficulty
```sql
SELECT * FROM tricks WHERE difficulty >= $1 ORDER BY difficulty
```

### Tricks by type with count
```sql
SELECT type, COUNT(*), AVG(difficulty)
FROM tricks
GROUP BY type
```

### JOIN tricks with skaters (if FK exists)
```sql
SELECT t.name, s.name as skater_name
FROM tricks t
LEFT JOIN skaters s ON t.skater_id = s.skater_id
```

### Stats dashboard
```sql
SELECT
  COUNT(*) as total_tricks,
  AVG(difficulty) as avg_difficulty,
  COUNT(CASE WHEN landed THEN 1 END) as landed_count
FROM tricks
```

## Git Status at Start
- Modified: public/index.html
- Untracked: netlify/functions/get-skaters-by-id.mjs
- Branch: main

## Bobby's Class Context
Working through DB lectures 6-9 from db.profbobby.com/pages/lectures/
Assignment: Complete full CRUD + advanced SQL features + optimization

## Next Steps Priority
1. Add CORS to all functions
2. Complete CRUD (PUT/DELETE all tables, POST/GET-by-id missing ones)
3. Add filtering/sorting/search
4. Implement JOINs
5. Create indexes & views
6. Update frontend with all features
7. Document performance improvements
