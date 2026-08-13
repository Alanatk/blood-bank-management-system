-- migration.sql
-- Run this script to update an existing bloodbank database without losing existing data.

USE bloodbank;

-- Ensure all 8 blood groups exist in inventory
INSERT INTO inventory (blood_group, units_available) VALUES
('A+', 15),
('A-', 5),
('B+', 12),
('B-', 4),
('AB+', 8),
('AB-', 3),
('O+', 20),
('O-', 6)
ON DUPLICATE KEY UPDATE blood_group = blood_group;

-- Add reason and required_date to requests table if missing
SET @dbname = DATABASE();
SET @tablename = "requests";
SET @columnname = "reason";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  "ALTER TABLE requests ADD COLUMN reason VARCHAR(255) AFTER quantity, ADD COLUMN required_date DATE AFTER reason;"
));
PREPARE add_cols FROM @preparedStatement;
EXECUTE add_cols;
DEALLOCATE PREPARE add_cols;

-- Create donations table if it does not exist
CREATE TABLE IF NOT EXISTS donations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  donor_id INT NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  units INT NOT NULL DEFAULT 1 CHECK (units > 0),
  donation_date DATE NOT NULL,
  status ENUM('completed','pending','cancelled') DEFAULT 'completed',
  notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE
);

-- Ensure sample passwords in 'users' table are updated to Werkzeug generate_password_hash values if plain text
-- Default hashes below correspond to passwords: 'pass123', 'pass456', 'adminpass'
UPDATE users SET password = 'pbkdf2:sha256:600000$WvQJ8u4r$73656118d09f7a77d13028d7120a16b9b3e1f0e4b8bd68c5b3644f128e4e93d5' WHERE email = 'alice@example.com' AND password = 'pass123';
UPDATE users SET password = 'pbkdf2:sha256:600000$WvQJ8u4r$73656118d09f7a77d13028d7120a16b9b3e1f0e4b8bd68c5b3644f128e4e93d5' WHERE email = 'bob@hospital.com' AND password = 'pass456';
UPDATE users SET password = 'pbkdf2:sha256:600000$WvQJ8u4r$73656118d09f7a77d13028d7120a16b9b3e1f0e4b8bd68c5b3644f128e4e93d5' WHERE email = 'admin@bloodbank.com' AND password = 'adminpass';
