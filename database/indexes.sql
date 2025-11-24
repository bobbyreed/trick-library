-- Performance Optimization: Indexes for Trick Library Database
-- Run these in Neon SQL Editor to improve query performance

-- ============================================================
-- INDEXES FOR TRICKS TABLE
-- ============================================================

-- Index for filtering by difficulty (used in WHERE clauses)
CREATE INDEX IF NOT EXISTS idx_tricks_difficulty
ON tricks(difficulty);

-- Index for filtering by type (used in WHERE and GROUP BY)
CREATE INDEX IF NOT EXISTS idx_tricks_type
ON tricks(type);

-- Index for filtering by landed status
CREATE INDEX IF NOT EXISTS idx_tricks_landed
ON tricks(landed);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_tricks_type_difficulty
ON tricks(type, difficulty);

-- Index for text search on name (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_tricks_name
ON tricks(LOWER(name));

-- If FK relationships exist, index them
-- CREATE INDEX IF NOT EXISTS idx_tricks_skater_id ON tricks(skater_id);
-- CREATE INDEX IF NOT EXISTS idx_tricks_location_id ON tricks(location_id);


-- ============================================================
-- INDEXES FOR SKATERS TABLE
-- ============================================================

-- Index for text search on name
CREATE INDEX IF NOT EXISTS idx_skaters_name
ON skaters(LOWER(name));

-- Index for filtering by pro_status
CREATE INDEX IF NOT EXISTS idx_skaters_pro_status
ON skaters(pro_status);

-- Index for filtering/grouping by hometown
CREATE INDEX IF NOT EXISTS idx_skaters_hometown
ON skaters(hometown);

-- Index for stance filtering
CREATE INDEX IF NOT EXISTS idx_skaters_stance
ON skaters(stance);


-- ============================================================
-- INDEXES FOR LOCATIONS TABLE
-- ============================================================

-- Index for filtering by type
CREATE INDEX IF NOT EXISTS idx_locations_type
ON locations(type);

-- Index for filtering by active status
CREATE INDEX IF NOT EXISTS idx_locations_active
ON locations(active);

-- Composite index for common filter
CREATE INDEX IF NOT EXISTS idx_locations_type_active
ON locations(type, active);


-- ============================================================
-- VERIFY INDEXES
-- ============================================================
-- Run this to see all indexes:
-- SELECT tablename, indexname, indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY tablename, indexname;
