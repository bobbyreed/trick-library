# Trick Library API Documentation

## Base URL
- Local: `http://localhost:8888/.netlify/functions/`
- Production: `https://your-site.netlify.app/.netlify/functions/`

## Table of Contents
- [CRUD Operations](#crud-operations)
- [Search & Filter](#search--filter)
- [Analytics & Stats](#analytics--stats)
- [Advanced Queries](#advanced-queries)

---

## CRUD Operations

### Tricks

#### GET All Tricks
```
GET /get-tricks
```
Returns all tricks ordered by ID.

**Response:**
```json
[
  {
    "trick_id": 1,
    "name": "Ollie",
    "description": "Fundamental skateboarding trick",
    "difficulty": 1,
    "type": "Flatground",
    "landed": false,
    "videoUrl": null
  }
]
```

#### GET Trick by ID
```
GET /get-tricks-by-id?trick_id=1
```

**Response:** Single trick object or 404 if not found.

#### CREATE Trick
```
POST /create-trick
Content-Type: application/json

{
  "name": "Kickflip",
  "description": "360 degree flip",
  "difficulty": 2,
  "type": "Flatground",
  "landed": false,
  "videoUrl": "https://..."
}
```

**Response:** Created trick with status 201.

#### UPDATE Trick
```
PUT /update-trick?trick_id=1
Content-Type: application/json

{
  "name": "Updated Name",
  "difficulty": 3,
  "landed": true
}
```

**Response:** Updated trick object or 404 if not found.

#### DELETE Trick
```
DELETE /delete-trick?trick_id=1
```

**Response:**
```json
{
  "message": "Trick deleted successfully",
  "deleted": { ... }
}
```

---

### Skaters

#### GET All Skaters
```
GET /get-skaters
```

#### GET Skater by ID
```
GET /get-skaters-by-id?skater_id=1
```

#### CREATE Skater
```
POST /create-skater
Content-Type: application/json

{
  "name": "Rodney Mullen",
  "stance": "Regular",
  "hometown": "Gainesville, FL",
  "pro_status": true
}
```

#### UPDATE Skater
```
PUT /update-skater?skater_id=1
Content-Type: application/json

{
  "pro_status": true,
  "hometown": "New City"
}
```

#### DELETE Skater
```
DELETE /delete-skater?skater_id=1
```

---

### Locations

#### GET All Locations
```
GET /get-locations
```

#### GET Location by ID
```
GET /get-locations-by-id?location_id=1
```

#### CREATE Location
```
POST /create-item
Content-Type: application/json

{
  "type": "Skatepark",
  "active": true
}
```

**Note:** Type must be one of: `Skateshop`, `Spot`, `Skatepark`

#### UPDATE Location
```
PUT /update-location?location_id=1
Content-Type: application/json

{
  "type": "Skateshop",
  "active": false
}
```

#### DELETE Location
```
DELETE /delete-location?location_id=1
```

---

## Search & Filter

### Search Tricks
```
GET /search-tricks?q=kickflip
```

Searches across `name`, `description`, and `type` fields (case-insensitive).

**Response:** Array of matching tricks.

### Search Skaters
```
GET /search-skaters?q=mullen
```

Searches across `name`, `hometown`, and `stance` fields (case-insensitive).

### Filter Tricks
```
GET /filter-tricks?difficulty=3&type=Flatground&landed=true&sortBy=name&order=ASC
```

**Query Parameters:**
- `difficulty` - Filter by exact difficulty (1-5)
- `type` - Filter by trick type
- `landed` - Filter by landed status (true/false)
- `minDifficulty` - Filter tricks >= difficulty
- `maxDifficulty` - Filter tricks <= difficulty
- `sortBy` - Sort column (trick_id, name, difficulty, type, landed)
- `order` - Sort direction (ASC or DESC)

**Valid sortBy columns:** trick_id, name, difficulty, type, landed

**Example:**
```
GET /filter-tricks?minDifficulty=3&maxDifficulty=5&sortBy=difficulty&order=DESC
```

---

## Analytics & Stats

### Dashboard Statistics
```
GET /stats
```

Returns aggregate statistics for all tables.

**Response:**
```json
{
  "tricks": {
    "total_tricks": 10,
    "landed_tricks": 5,
    "not_landed_tricks": 5,
    "avg_difficulty": 2.5,
    "min_difficulty": 1,
    "max_difficulty": 5,
    "unique_types": 3
  },
  "skaters": {
    "total_skaters": 8,
    "pro_skaters": 3,
    "amateur_skaters": 5,
    "unique_hometowns": 6,
    "unique_stances": 2
  },
  "locations": {
    "total_locations": 5,
    "active_locations": 4,
    "inactive_locations": 1,
    "unique_location_types": 3
  },
  "generated_at": "2025-11-24T..."
}
```

### Dashboard Overview
```
GET /dashboard
```

Comprehensive dashboard with overview stats and breakdowns.

**Response:**
```json
{
  "overview": {
    "total_tricks": 10,
    "tricks_landed": 5,
    "avg_trick_difficulty": 2.5,
    "total_skaters": 8,
    "pro_skaters": 3,
    "total_locations": 5
  },
  "breakdowns": {
    "trick_types": [...],
    "trick_difficulties": [...],
    "location_types": [...]
  }
}
```

### Tricks by Type Analytics
```
GET /analytics-tricks-by-type
```

**Response:**
```json
[
  {
    "type": "Flatground",
    "trick_count": 5,
    "avg_difficulty": 2.4,
    "min_difficulty": 1,
    "max_difficulty": 4,
    "landed_count": 3,
    "not_landed_count": 2,
    "landed_percentage": 60.00
  }
]
```

### Tricks by Difficulty Analytics
```
GET /analytics-tricks-by-difficulty
```

Includes skill level classification (Beginner, Intermediate, Advanced).

### Locations by Type Analytics
```
GET /analytics-locations-by-type
```

---

## Advanced Queries

### Get All Data (3 Tables)
```
GET /get-all-data
```

Returns all three tables in a single request.

**Response:**
```json
{
  "firstTable": [...skaters],
  "secondTable": [...tricks],
  "thirdTable": [...locations]
}
```

### Combined Data with Stats
```
GET /combined-data
```

All data plus quick summary statistics.

### Tricks with Details (JOIN)
```
GET /tricks-with-details
```

Returns tricks with related skater and location information (if foreign keys exist).

### Get Database Schema
```
GET /get-schema
```

Returns table structures and foreign key relationships.

---

## Performance Optimization

### Database Indexes
Run `database/indexes.sql` in Neon SQL Editor to create performance indexes on:
- `tricks`: difficulty, type, landed, name
- `skaters`: name, pro_status, hometown, stance
- `locations`: type, active

### Database Views
Run `database/views.sql` to create reusable views:
- `tricks_summary` - Tricks with skill level classification
- `trick_stats_by_type` - Pre-calculated type analytics
- `skaters_summary` - Skaters with status labels
- `location_stats_by_type` - Location analytics
- `dashboard_overview` - Dashboard stats

### Optional Triggers
Run `database/optional-triggers.sql` to add auto-updating timestamps (created_at, updated_at).

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing parameters, invalid input)
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

---

## CORS

All endpoints include CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
```

---

## Testing Examples

### Using curl

```bash
# Get all tricks
curl http://localhost:8888/.netlify/functions/get-tricks

# Search tricks
curl "http://localhost:8888/.netlify/functions/search-tricks?q=flip"

# Filter and sort
curl "http://localhost:8888/.netlify/functions/filter-tricks?difficulty=3&sortBy=name&order=ASC"

# Create trick
curl -X POST http://localhost:8888/.netlify/functions/create-trick \
  -H "Content-Type: application/json" \
  -d '{"name":"Heelflip","difficulty":2,"type":"Flatground","landed":false}'

# Update trick
curl -X PUT "http://localhost:8888/.netlify/functions/update-trick?trick_id=1" \
  -H "Content-Type: application/json" \
  -d '{"landed":true}'

# Delete trick
curl -X DELETE "http://localhost:8888/.netlify/functions/delete-trick?trick_id=1"

# Get statistics
curl http://localhost:8888/.netlify/functions/stats

# Get analytics
curl http://localhost:8888/.netlify/functions/analytics-tricks-by-type
```

---

## Lecture Checklist Coverage

### ✅ Lecture 6 - Basic CRUD
- [x] GET endpoints for all tables
- [x] GET by ID endpoints
- [x] POST endpoints (Create)
- [x] PUT endpoints (Update)
- [x] DELETE endpoints
- [x] CORS headers
- [x] Error handling
- [x] Parameterized queries (SQL injection prevention)

### ✅ Lecture 7 - SQL Filtering & Sorting
- [x] WHERE clause filtering
- [x] ORDER BY sorting
- [x] LIKE/ILIKE search
- [x] Aggregate functions (COUNT, AVG, MIN, MAX)
- [x] GROUP BY with HAVING
- [x] DISTINCT queries
- [x] Multiple filter combinations

### ✅ Lecture 8 - JOINs & Subqueries
- [x] LEFT JOIN queries (tricks-with-details)
- [x] Combined data endpoints
- [x] Multi-table queries with Promise.all
- [x] Schema inspection queries

### ✅ Lecture 9 - Performance & Optimization
- [x] Index creation scripts
- [x] View creation scripts
- [x] Optional trigger scripts
- [x] EXPLAIN ANALYZE instructions
- [x] Query optimization best practices

---

## Next Steps

1. **Run the SQL scripts** in Neon SQL Editor:
   - `database/indexes.sql` - Create performance indexes
   - `database/views.sql` - Create reusable views
   - `database/optional-triggers.sql` - Optional auto-timestamps

2. **Test all endpoints** using the frontend or curl

3. **Measure performance** before/after indexes using DevTools Network tab

4. **Deploy to production** and update environment variables

5. **Document improvements** with before/after screenshots
