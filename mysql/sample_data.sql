USE bloodbank;

INSERT INTO users (name, email, password, role) VALUES
('Alice', 'alice@example.com', 'pass123', 'donor'),
('Bob Hospital', 'bob@hospital.com', 'pass456', 'hospital'),
('Admin', 'admin@bloodbank.com', 'adminpass', 'admin');

-- Make Alice a donor profile (user_id = 1)
INSERT INTO donors (user_id, blood_group, location, last_donation_date) VALUES
(1, 'A+', 'Palghat', '2025-08-01');

-- Inventory
INSERT INTO inventory (blood_group, units_available) VALUES
('A+', 10), ('B+', 5), ('O-', 2);
