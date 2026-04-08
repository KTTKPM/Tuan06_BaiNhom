-- Seed script for Food Service (MariaDB)
-- Run this script on MariaDB before testing API.

CREATE DATABASE IF NOT EXISTS food_service
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE food_service;

CREATE TABLE IF NOT EXISTS foods (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(60) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  available BIT(1) NOT NULL,
  created_at DATETIME(6) NOT NULL,
  PRIMARY KEY (id)
);

DELETE FROM foods;

INSERT INTO foods (name, category, price, available, created_at) VALUES
('Pho Bo', 'Vietnamese', 55000.00, b'1', NOW()),
('Com Tam Suon', 'Vietnamese', 62000.00, b'1', NOW()),
('Banh Mi Thit', 'Vietnamese', 28000.00, b'1', NOW()),
('Bun Bo Hue', 'Vietnamese', 60000.00, b'0', NOW()),
('Pizza Margherita', 'Italian', 149000.00, b'1', NOW()),
('Spaghetti Carbonara', 'Italian', 139000.00, b'1', NOW()),
('Sushi Set', 'Japanese', 199000.00, b'1', NOW()),
('Ramen Tonkotsu', 'Japanese', 129000.00, b'0', NOW()),
('Burger Beef', 'Fast Food', 89000.00, b'1', NOW()),
('Caesar Salad', 'Healthy', 99000.00, b'1', NOW());
