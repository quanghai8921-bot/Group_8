-- =====================================================
-- Fix SQLGrammarException: Invalid column name 'license_plate'
-- =====================================================
-- Execute this SQL script against your ShopeeFood database
-- Date: March 1, 2026
-- =====================================================

-- Step 1: Check if the License_Plate column exists
-- (Optional - for informational purposes)
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Driver' AND COLUMN_NAME = 'License_Plate'

-- Step 2: Add License_Plate column if it doesn't exist
IF NOT EXISTS (
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Driver' AND COLUMN_NAME = 'License_Plate'
)
BEGIN
    ALTER TABLE Driver 
    ADD License_Plate NVARCHAR(15) NOT NULL 
    DEFAULT 'UNKNOWN'
    
    PRINT 'License_Plate column added successfully to Driver table'
END
ELSE
BEGIN
    PRINT 'License_Plate column already exists'
END

-- Step 3: Verify all required columns are present
-- Expected columns: Driver_ID, User_ID, Full_Name, Birth_Date, Phone_Number, License_Plate, Vehicle_Type, Is_Verified
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Driver'
ORDER BY ORDINAL_POSITION

-- Step 4: Optional - Set default value for existing NULL records (if any)
-- Uncomment if needed:
-- UPDATE Driver SET License_Plate = 'PENDING' WHERE License_Plate IS NULL OR License_Plate = 'UNKNOWN'
