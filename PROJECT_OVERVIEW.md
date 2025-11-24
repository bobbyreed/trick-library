# Trick Library - Project Overview

## Project Description
Full-stack skateboarding trick library database application built with Netlify Functions and Neon PostgreSQL.

## Database Schema

### Tables
1. **skaters**
   - `skater_id` (PK)
   - Name and skater details
   - Used for tracking who performs tricks

2. **tricks**
   - `trick_id` (PK)
   - `name` - trick name
   - `description` - trick details
   - `difficulty` - difficulty level (1-5)
   - `type` - category (Flatground, etc.)
   - `landed` - boolean status
   - `videoUrl` - reference video

3. **locations**
   - `location_id` (PK)
   - `type` - Skateshop, Spot, or Skatepark (CHECK constraint)
   - `active` - boolean status

### Relationships
- Potential FK: tricks -> skaters (who landed it)
- Potential FK: tricks -> locations (where landed)

## Tech Stack
- **Database**: Neon PostgreSQL (serverless)
- **Backend**: Netlify Functions (serverless)
- **Frontend**: Vanilla HTML/CSS/JS
- **Deployment**: Netlify
- **Driver**: @neondatabase/serverless

## Current API Endpoints

### GET Endpoints
- `/.netlify/functions/get-tricks` - All tricks
- `/.netlify/functions/get-skaters` - All skaters
- `/.netlify/functions/get-locations` - All locations
- `/.netlify/functions/get-all-data` - All 3 tables in one call
- `/.netlify/functions/get-skaters-by-id?skater_id={id}` - Single skater

### POST Endpoints
- `/.netlify/functions/create-item` - Create location (POST)

### Missing Endpoints (To Be Implemented)
- PUT endpoints for updates
- DELETE endpoints
- GET by ID for tricks, locations
- POST for skaters, tricks
- Filtering/search/sort endpoints
- JOIN endpoints
- Analytics/stats endpoints

## File Structure
```
trick-library/
├── netlify/
│   └── functions/          # API functions
├── public/
│   ├── index.html         # Main page
│   └── pages/
│       ├── tableViews.html
│       ├── customViews.html
│       └── queryCreator.html
├── data/
│   └── tricks.json        # Sample data
├── netlify.toml           # Netlify config
├── package.json
└── .env                   # DB credentials (not in repo)
```

## Environment Variables
- `DATABASE_URL` - Neon PostgreSQL connection string

## Development
```bash
netlify dev              # Start local dev server on :8888
```

## Known Issues
- Missing CORS headers on some endpoints
- No UPDATE or DELETE operations
- No filtering/search functionality
- No performance optimization (indexes, views)
- Frontend needs enhancement
- Error handling could be improved
