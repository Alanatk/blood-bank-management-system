-- schema.sql
CREATE DATABASE IF NOT EXISTS bloodbank;
USE bloodbank;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','donor','hospital') NOT NULL DEFAULT 'donor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donors Profile Table
CREATE TABLE IF NOT EXISTS donors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  blood_group VARCHAR(5) NOT NULL,
  location VARCHAR(100),
  last_donation_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Donations Log Table
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

-- Inventory Table (Stores available units for all 8 blood groups)
CREATE TABLE IF NOT EXISTS inventory (
  blood_group VARCHAR(5) PRIMARY KEY,
  units_available INT NOT NULL DEFAULT 0 CHECK (units_available >= 0),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Requests Table
CREATE TABLE IF NOT EXISTS requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hospital_id INT NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  reason VARCHAR(255),
  required_date DATE,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed initial 8 blood groups in inventory if not existing
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
