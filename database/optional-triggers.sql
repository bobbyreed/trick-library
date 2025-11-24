-- Optional Database Triggers for Trick Library
-- These are OPTIONAL enhancements (Lecture 9 extra credit)
-- Run in Neon SQL Editor if you want auto-timestamps

-- ============================================================
-- Add timestamp columns to tables (if they don't exist)
-- ============================================================

-- For tricks table
ALTER TABLE tricks
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- For skaters table
ALTER TABLE skaters
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- For locations table
ALTER TABLE locations
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


-- ============================================================
-- TRIGGER: Auto-update updated_at on tricks
-- ============================================================
CREATE OR REPLACE FUNCTION update_tricks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tricks_updated_at_trigger ON tricks;
CREATE TRIGGER tricks_updated_at_trigger
BEFORE UPDATE ON tricks
FOR EACH ROW
EXECUTE FUNCTION update_tricks_updated_at();


-- ============================================================
-- TRIGGER: Auto-update updated_at on skaters
-- ============================================================
CREATE OR REPLACE FUNCTION update_skaters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS skaters_updated_at_trigger ON skaters;
CREATE TRIGGER skaters_updated_at_trigger
BEFORE UPDATE ON skaters
FOR EACH ROW
EXECUTE FUNCTION update_skaters_updated_at();


-- ============================================================
-- TRIGGER: Auto-update updated_at on locations
-- ============================================================
CREATE OR REPLACE FUNCTION update_locations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS locations_updated_at_trigger ON locations;
CREATE TRIGGER locations_updated_at_trigger
BEFORE UPDATE ON locations
FOR EACH ROW
EXECUTE FUNCTION update_locations_updated_at();


-- ============================================================
-- VERIFY TRIGGERS
-- ============================================================
-- Run this to see all triggers:
-- SELECT trigger_name, event_manipulation, event_object_table
-- FROM information_schema.triggers
-- WHERE trigger_schema = 'public';

-- Test the triggers by updating a record:
-- UPDATE tricks SET name = 'Updated Trick Name' WHERE trick_id = 1;
-- SELECT trick_id, name, created_at, updated_at FROM tricks WHERE trick_id = 1;
