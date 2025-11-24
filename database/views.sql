-- Database Views for Trick Library
-- Run these in Neon SQL Editor to create reusable query views

-- ============================================================
-- VIEW: Tricks Summary
-- Simplifies repeated queries for trick statistics
-- ============================================================
CREATE OR REPLACE VIEW tricks_summary AS
SELECT
  trick_id,
  name,
  description,
  difficulty,
  type,
  landed,
  CASE
    WHEN difficulty <= 2 THEN 'Beginner'
    WHEN difficulty = 3 THEN 'Intermediate'
    WHEN difficulty >= 4 THEN 'Advanced'
  END as skill_level
FROM tricks;


-- ============================================================
-- VIEW: Trick Statistics by Type
-- Pre-calculated analytics, reusable across endpoints
-- ============================================================
CREATE OR REPLACE VIEW trick_stats_by_type AS
SELECT
  type,
  COUNT(*) as trick_count,
  AVG(difficulty) as avg_difficulty,
  MIN(difficulty) as min_difficulty,
  MAX(difficulty) as max_difficulty,
  COUNT(CASE WHEN landed = true THEN 1 END) as landed_count,
  COUNT(CASE WHEN landed = false THEN 1 END) as not_landed_count,
  ROUND(100.0 * COUNT(CASE WHEN landed = true THEN 1 END) / COUNT(*), 2) as landed_percentage
FROM tricks
GROUP BY type;


-- ============================================================
-- VIEW: Active Skaters Summary
-- Quick access to active/pro skaters
-- ============================================================
CREATE OR REPLACE VIEW skaters_summary AS
SELECT
  skater_id,
  name,
  stance,
  hometown,
  pro_status,
  CASE
    WHEN pro_status = true THEN 'Professional'
    ELSE 'Amateur'
  END as status_label
FROM skaters;


-- ============================================================
-- VIEW: Location Statistics by Type
-- Pre-calculated location analytics
-- ============================================================
CREATE OR REPLACE VIEW location_stats_by_type AS
SELECT
  type,
  COUNT(*) as location_count,
  COUNT(CASE WHEN active = true THEN 1 END) as active_count,
  COUNT(CASE WHEN active = false THEN 1 END) as inactive_count,
  ROUND(100.0 * COUNT(CASE WHEN active = true THEN 1 END) / COUNT(*), 2) as active_percentage
FROM locations
GROUP BY type;


-- ============================================================
-- VIEW: Dashboard Overview
-- Single view for dashboard statistics
-- ============================================================
CREATE OR REPLACE VIEW dashboard_overview AS
SELECT
  (SELECT COUNT(*) FROM tricks) as total_tricks,
  (SELECT COUNT(*) FROM skaters) as total_skaters,
  (SELECT COUNT(*) FROM locations) as total_locations,
  (SELECT AVG(difficulty) FROM tricks) as avg_trick_difficulty,
  (SELECT COUNT(*) FROM tricks WHERE landed = true) as tricks_landed,
  (SELECT COUNT(*) FROM skaters WHERE pro_status = true) as pro_skaters,
  (SELECT COUNT(*) FROM locations WHERE active = true) as active_locations;


-- ============================================================
-- USAGE EXAMPLES
-- ============================================================
-- Query views like regular tables:
--
-- SELECT * FROM tricks_summary WHERE skill_level = 'Advanced';
-- SELECT * FROM trick_stats_by_type ORDER BY trick_count DESC;
-- SELECT * FROM dashboard_overview;
-- SELECT * FROM location_stats_by_type;


-- ============================================================
-- VERIFY VIEWS
-- ============================================================
-- Run this to see all views:
-- SELECT table_name
-- FROM information_schema.views
-- WHERE table_schema = 'public';
