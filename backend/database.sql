-- Créer la base de données
CREATE DATABASE IF NOT EXISTS flexwork_hub;

-- Utiliser la base de données
USE flexwork_hub;

-- Table utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('candidat', 'employeur') DEFAULT 'candidat',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table offres d'emploi
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    entreprise VARCHAR(255),
    secteur VARCHAR(255),
    lieu VARCHAR(255),
    salaire DECIMAL(10,2),
    horaire VARCHAR(255),
    statut ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer des données de test
INSERT INTO jobs (title, entreprise, secteur, lieu, salaire, horaire) VALUES
('Développeur React', 'TechCorp', 'Informatique', 'Tunis', 1500.00, 'Temps plein'),
('Designer UI/UX', 'DesignStudio', 'Design', 'Sfax', 1200.00, 'Temps partiel');

INSERT INTO users (name, email, password, role) VALUES
('Test User', 'test@test.com', 'password', 'candidat');