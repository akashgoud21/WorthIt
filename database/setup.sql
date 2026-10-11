-- ============================================================
--  WorthIt Database Setup Script
--  Run this ONCE before starting the Spring Boot backend.
--  Command: mysql -u root -p < setup.sql
-- ============================================================

-- Create the database (UTF-8 with emoji support)
CREATE DATABASE IF NOT EXISTS worthit_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Switch to the new database
USE worthit_db;

-- ============================================================
--  NOTE: You do NOT need to create tables manually.
--  Spring Boot (Hibernate) will auto-create all 7 tables when
--  you run the backend for the first time because we set:
--      spring.jpa.hibernate.ddl-auto=update
-- ============================================================

-- Just verify the database is ready
SELECT 'worthit_db created successfully!' AS status;
