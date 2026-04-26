-- Créer la base de données
CREATE DATABASE IF NOT EXISTS flexwork_hub;
USE flexwork_hub;

-- =============================
-- Table utilisateurs
-- =============================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('candidat', 'employeur', 'admin') DEFAULT 'candidat',
    statut ENUM('actif', 'bloque') DEFAULT 'actif',
    telephone VARCHAR(50) DEFAULT NULL,
    ville VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- Table offres d'emploi
-- =============================
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeur_id INT DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    entreprise VARCHAR(255),
    secteur VARCHAR(255),
    lieu VARCHAR(255),
    salaire DECIMAL(10,2),
    horaire VARCHAR(255),
    type VARCHAR(100) DEFAULT 'Temps partiel',
    competences TEXT,
    statut ENUM('active', 'en_attente', 'rejetee', 'inactive') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employeur_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================
-- Table candidatures
-- =============================
CREATE TABLE IF NOT EXISTS candidatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    candidat_id INT NOT NULL,
    message TEXT,
    cv VARCHAR(255) DEFAULT NULL,
    statut ENUM('en_attente', 'acceptee', 'refusee') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidat_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, candidat_id)
);

-- =============================
-- Données de test
-- =============================
INSERT INTO users (name, email, password, role) VALUES
('Yasmine Ben Ali', 'yasmine@test.tn', 'password', 'candidat'),
('Café Médina', 'contact@cafemedina.tn', 'password', 'employeur'),
('Admin FlexWork', 'admin@flexwork.tn', 'admin123', 'admin');

INSERT INTO jobs (employeur_id, title, entreprise, secteur, lieu, salaire, horaire, type, statut) VALUES
(2, 'Serveur / Serveuse', 'Café Médina', 'Restauration', 'Tunis Centre', 800.00, 'Soir (18h-23h)', 'Temps partiel', 'active'),
(2, 'Vendeur en boutique', 'Mode & Style', 'Commerce', 'La Marsa', 650.00, 'Weekend (Sam-Dim)', 'Temps partiel', 'en_attente');

INSERT INTO candidatures (job_id, candidat_id, message, statut) VALUES
(1, 1, 'Bonjour, je suis très intéressée par ce poste.', 'en_attente');
