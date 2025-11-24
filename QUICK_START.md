# Quick Start Guide

## ⚡ Get Running in 5 Minutes

### Step 1: Run Database Scripts (Required)
1. Open [Neon Dashboard](https://neon.tech) and go to SQL Editor
2. Copy and paste `database/indexes.sql` → Click "Run"
3. Copy and paste `database/views.sql` → Click "Run"
4. (Optional) Copy and paste `database/optional-triggers.sql` → Click "Run"

### Step 2: Start Local Server
```bash
netlify dev
```

### Step 3: Open Browser
Navigate to: `http://localhost:8888`

**That's it!** 🎉 Your app is running with:
- ✅ Full CRUD operations
- ✅ Search functionality
- ✅ Filtering and sorting
- ✅ Dashboard analytics
- ✅ All 28 API endpoints active

---

## 🧪 Test the Features

### Dashboard
Visit `http://localhost:8888` to see:
- Live statistics cards
- Real-time search (type "kickflip")
- Advanced filters (select difficulty, apply filters)
- All tricks display

### API Endpoints
Test in browser or terminal:

```bash
# View all tricks
curl http://localhost:8888/.netlify/functions/get-tricks

# Search for tricks
curl "http://localhost:8888/.netlify/functions/search-tricks?q=flip"

# Filter by difficulty and sort
curl "http://localhost:8888/.netlify/functions/filter-tricks?difficulty=3&sortBy=name&order=ASC"

# Get dashboard stats
curl http://localhost:8888/.netlify/functions/dashboard

# Get analytics
curl http://localhost:8888/.netlify/functions/analytics-tricks-by-type
```

### Table View
Visit `http://localhost:8888/pages/tableViews.html` to see all 3 tables displayed.

---

## 🚀 Deploy to Production

### Option 1: Netlify Dashboard (Recommended)
1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Complete database application"
   git push origin main
   ```

2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Deploy!

6. Add Environment Variable:
   - Site Settings → Environment Variables
   - Add: `DATABASE_URL` = (your Neon connection string)

### Option 2: Netlify CLI
```bash
netlify deploy --prod
```

---

## 📚 Available Endpoints

### CRUD Operations
- **GET** `/get-tricks`, `/get-skaters`, `/get-locations`
- **GET by ID** `/get-tricks-by-id?trick_id=1`
- **POST** `/create-trick`, `/create-skater`, `/create-item`
- **PUT** `/update-trick?trick_id=1`, `/update-skater?skater_id=1`
- **DELETE** `/delete-trick?trick_id=1`, `/delete-skater?skater_id=1`

### Search & Filter
- **Search** `/search-tricks?q=kickflip`, `/search-skaters?q=mullen`
- **Filter** `/filter-tricks?difficulty=3&type=Flatground&sortBy=name&order=ASC`

### Analytics
- **Dashboard** `/dashboard` - Complete overview with breakdowns
- **Stats** `/stats` - Aggregate statistics
- **Type Analytics** `/analytics-tricks-by-type`
- **Difficulty** `/analytics-tricks-by-difficulty`
- **Locations** `/analytics-locations-by-type`

### Advanced
- **All Data** `/get-all-data` - All 3 tables in one call
- **Combined** `/combined-data` - All data + summary
- **JOIN** `/tricks-with-details` - Tricks with related data
- **Schema** `/get-schema` - Database structure

---

## 📖 Documentation Files

- **README.md** - Full project documentation
- **API_DOCUMENTATION.md** - Complete API reference with curl examples
- **PROJECT_OVERVIEW.md** - Technical overview
- **CLAUDE.md** - Quick reference
- **IMPLEMENTATION_SUMMARY.md** - What was built

---

## ✅ Checklist Verification

All Lecture 6-9 requirements implemented:
- [x] Complete CRUD for all 3 tables
- [x] WHERE filtering with multiple conditions
- [x] ORDER BY sorting with whitelisting
- [x] LIKE/ILIKE search
- [x] Aggregate functions (COUNT, AVG, MIN, MAX)
- [x] GROUP BY with HAVING
- [x] JOIN queries
- [x] Database indexes
- [x] Database views
- [x] Performance optimization
- [x] CORS headers
- [x] Error handling
- [x] Parameterized queries
- [x] Frontend integration

---

## 🆘 Troubleshooting

**Port already in use?**
```bash
# Kill the process on port 8888
lsof -ti:8888 | xargs kill -9
netlify dev
```

**Database connection error?**
- Check `.env` file exists
- Verify `DATABASE_URL` is correct
- Test connection in Neon dashboard

**Function not found?**
- Restart dev server: `Ctrl+C` then `netlify dev`
- Check function file exists in `netlify/functions/`

**CORS error?**
- All functions have CORS headers added
- Restart dev server

---

## 🎯 Next Steps (Optional)

### Add More Data
Use POST endpoints to add more tricks:
```bash
curl -X POST http://localhost:8888/.netlify/functions/create-trick \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tre Flip",
    "description": "360 flip",
    "difficulty": 4,
    "type": "Flatground",
    "landed": false
  }'
```

### Test Performance
1. Open DevTools → Network tab
2. Reload dashboard
3. Check response times (should be <300ms after indexes)
4. Run EXPLAIN ANALYZE in Neon SQL Editor:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM tricks WHERE difficulty = 3;
   ```

### Customize Frontend
- Edit `public/index.html` - Change colors, add features
- Edit `public/pages/tableViews.html` - Customize tables
- Add your own CSS styling

---

## 📊 Quick Stats

- **28 API Endpoints** - All working and tested
- **12+ Indexes** - Ready to create in Neon
- **5 Views** - Pre-calculated queries
- **3 Tables** - Skaters, Tricks, Locations
- **100% Complete** - All lecture requirements met

---

**Need help?** Check the documentation files listed above!

**Ready to submit?** The project is complete and production-ready! 🚀
