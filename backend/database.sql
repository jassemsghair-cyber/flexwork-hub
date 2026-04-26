-- =============================================
-- FlexWork - Schéma de base de données
-- =============================================
-- IDÉMPOTENT: Vous pouvez ré-importer ce fichier
-- sans erreur. Toutes les tables existantes seront
-- supprimées dans le bon ordre (FK) puis recréées.
-- =============================================

CREATE DATABASE IF NOT EXISTS flexwork_hub
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE flexwork_hub;

-- Désactiver temporairement les FK pour permettre les DROP dans n'importe quel ordre
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS candidatures;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- =============================
-- Table utilisateurs
-- =============================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('candidat', 'employeur', 'admin') NOT NULL DEFAULT 'candidat',
    statut ENUM('actif', 'bloque') NOT NULL DEFAULT 'actif',
    telephone VARCHAR(50) DEFAULT NULL,
    ville VARCHAR(100) DEFAULT NULL,
    -- Champs candidat
    disponibilites VARCHAR(255) DEFAULT NULL,  -- ex: "Matin,Soir,Weekend"
    competences TEXT DEFAULT NULL,             -- ex: "React,JS,Git"
    cv VARCHAR(255) DEFAULT NULL,
    -- Champs employeur
    entreprise VARCHAR(255) DEFAULT NULL,
    secteur VARCHAR(100) DEFAULT NULL,
    logo VARCHAR(10) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================
-- Table offres d'emploi
-- =============================
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeur_id INT DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    entreprise VARCHAR(255),
    logo VARCHAR(10) DEFAULT NULL,
    secteur VARCHAR(100),
    lieu VARCHAR(255),
    salaire DECIMAL(10,2) DEFAULT 0,
    horaire VARCHAR(100),
    type VARCHAR(100) DEFAULT 'Temps partiel',
    competences TEXT DEFAULT NULL,  -- séparées par virgules
    statut ENUM('active', 'en_attente', 'rejetee', 'inactive') NOT NULL DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_statut (statut),
    INDEX idx_employeur (employeur_id),
    FOREIGN KEY (employeur_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================
-- Table candidatures
-- =============================
CREATE TABLE candidatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    candidat_id INT NOT NULL,
    message TEXT,
    cv VARCHAR(255) DEFAULT NULL,
    statut ENUM('en_attente', 'acceptee', 'refusee') NOT NULL DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_application (job_id, candidat_id),
    INDEX idx_statut (statut),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidat_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================
-- DONNÉES DE TEST
-- =============================
-- Tous les comptes ci-dessous ont le mot de passe : "password"
-- (hash bcrypt généré par PHP password_hash)
-- L'admin a le mot de passe : "admin123"
-- =============================

-- Utilisateurs : admins, candidats, employeurs
INSERT INTO users (name, email, password, role, telephone, ville, disponibilites, competences, entreprise, secteur, logo) VALUES
-- Admin
('Admin FlexWork', 'admin@flexwork.tn', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', '+216 71 000 000', 'Tunis', NULL, NULL, NULL, NULL, NULL),

-- Candidats
('Yasmine Ben Ali', 'yasmine@email.tn',  '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'candidat', '+216 55 123 456', 'Tunis',     'Soir,Weekend',     'Service client,Communication,Anglais',          NULL, NULL, NULL),
('Ahmed Trabelsi',  'ahmed@email.tn',    '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'candidat', '+216 98 765 432', 'Sousse',    'Matin,Flexible',   'React,JavaScript,Node.js,Git',                  NULL, NULL, NULL),
('Fatma Gharbi',    'fatma@email.tn',    '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'candidat', '+216 22 334 556', 'Sfax',      'Matin,Soir',       'Vente,Gestion de caisse,Organisation',          NULL, NULL, NULL),
('Mohamed Jebali',  'mohamed@email.tn',  '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'candidat', '+216 50 112 233', 'La Marsa',  'Weekend',          'Photographie,Lightroom,Créativité',             NULL, NULL, NULL),
('Nour Khelifi',    'nour@email.tn',     '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'candidat', '+216 29 445 667', 'Tunis',     'Soir,Flexible',    'Réseaux sociaux,Canva,Rédaction',               NULL, NULL, NULL),

-- Employeurs (entreprise + secteur + logo)
('Café Médina',          'contact@cafemedina.tn',  '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employeur', '+216 71 234 567', 'Tunis',                NULL, NULL, 'Café Médina',          'Restauration',  'CM'),
('DigitalFlow',          'rh@digitalflow.tn',      '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employeur', '+216 71 890 123', 'Technopole El Ghazala',NULL, NULL, 'DigitalFlow',          'Informatique',  'DF'),
('Events Plus',          'info@eventsplus.tn',     '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employeur', '+216 71 456 789', 'Gammarth',             NULL, NULL, 'Events Plus',          'Événementiel',  'EP'),
('MediaLab TN',          'jobs@medialabn.tn',      '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employeur', '+216 71 567 890', 'Tunis',                NULL, NULL, 'MediaLab TN',          'Médias',        'ML'),
('Mode & Style',         'contact@modestyle.tn',   '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employeur', '+216 71 333 444', 'La Marsa',             NULL, NULL, 'Mode & Style',         'Commerce',      'MS'),
('Livraison Express TN', 'contact@livraisontn.tn', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employeur', '+216 71 555 666', 'Lac 1, Tunis',         NULL, NULL, 'Livraison Express TN', 'Livraison',     'LE'),
('TutorTN Academy',      'hello@tutortn.tn',       '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employeur', '+216 71 777 888', 'En ligne',             NULL, NULL, 'TutorTN Academy',      'Tutorat',       'TA'),
('Cabinet Conseil RH',   'rh@cabinetrh.tn',        '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employeur', '+216 71 999 000', 'Centre Urbain Nord',   NULL, NULL, 'Cabinet Conseil RH',   'Administratif', 'CR'),
('Clinique Les Jasmins', 'rh@clinique-jasmins.tn', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employeur', '+216 73 111 222', 'Sousse',               NULL, NULL, 'Clinique Les Jasmins', 'Santé',         'CJ'),
('Supermarché Azur',     'rh@azur.tn',             '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employeur', '+216 74 222 333', 'Sfax',                 NULL, NULL, 'Supermarché Azur',     'Commerce',      'SA'),
('CaptureTN',            'studio@capturetn.tn',    '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employeur', '+216 71 444 555', 'Tunis',                NULL, NULL, 'CaptureTN',            'Médias',        'CT'),
('Brew House Café',      'hello@brewhouse.tn',     '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employeur', '+216 71 666 777', 'Sidi Bou Saïd',        NULL, NULL, 'Brew House Café',      'Restauration',  'BH');

-- Offres d'emploi (employeur_id correspond aux IDs des employeurs ci-dessus, qui commencent à 7)
INSERT INTO jobs (employeur_id, title, description, entreprise, logo, secteur, lieu, salaire, horaire, type, competences, statut) VALUES
(7,  'Serveur / Serveuse',     'Nous recherchons un(e) serveur/serveuse dynamique pour rejoindre notre équipe au cœur de la Médina. Accueil clients, prise de commandes, service en salle.', 'Café Médina',          'CM', 'Restauration',  'Tunis Centre',           800.00,  'Soir (18h-23h)',   'Temps partiel', 'Service client,Rapidité,Travail en équipe',          'active'),
(11, 'Vendeur en boutique',    'Boutique de prêt-à-porter haut de gamme à La Marsa recherche un(e) vendeur/vendeuse pour les weekends. Conseil clientèle, gestion des stocks.',           'Mode & Style',         'MS', 'Commerce',      'La Marsa',               650.00,  'Weekend (Sam-Dim)','Temps partiel', 'Vente,Communication,Sens du style',                  'active'),
(12, 'Livreur à vélo',         'Rejoignez notre flotte de livreurs à vélo dans la zone du Lac. Horaires flexibles, vous choisissez vos créneaux.',                                          'Livraison Express TN', 'LE', 'Livraison',     'Lac 1, Tunis',           900.00,  'Flexible',         'Temps partiel', 'Ponctualité,Orientation,Endurance physique',         'active'),
(13, 'Professeur d''anglais',  'Donnez des cours d''anglais en ligne à des étudiants tunisiens. Niveaux débutant à intermédiaire. Matériel pédagogique fourni.',                          'TutorTN Academy',      'TA', 'Tutorat',       'En ligne',              1200.00,  'Soir (17h-20h)',   'Temps partiel', 'Anglais courant,Pédagogie,Patience',                 'active'),
(8,  'Développeur Web Junior', 'Startup tech recherche un développeur web junior pour travailler sur des projets React/Node.js. Environnement agile, mentorat par des seniors.',          'DigitalFlow',          'DF', 'Informatique',  'Technopole El Ghazala', 1500.00,  'Matin (9h-13h)',   'Temps partiel', 'React,JavaScript,Git',                               'active'),
(9,  'Hôte/Hôtesse d''accueil','Agence événementielle recherche des hôtes et hôtesses pour des événements corporate et privés dans la région de Gammarth.',                               'Events Plus',          'EP', 'Événementiel',  'Gammarth',               700.00,  'Weekend (Sam-Dim)','Temps partiel', 'Présentation,Communication,Français courant',        'active'),
(14, 'Assistant(e) administratif','Cabinet de conseil en RH recherche un(e) assistant(e) pour la gestion administrative : classement, saisie de données, accueil téléphonique.',          'Cabinet Conseil RH',   'CR', 'Administratif', 'Centre Urbain Nord',     950.00,  'Matin (8h-12h)',   'Temps partiel', 'Organisation,Word/Excel,Communication',              'active'),
(15, 'Aide-soignant(e)',       'La Clinique Les Jasmins à Sousse recrute un(e) aide-soignant(e) pour les shifts du matin. Vous assisterez l''équipe médicale.',                            'Clinique Les Jasmins', 'CJ', 'Santé',         'Sousse',                1100.00,  'Matin (6h-12h)',   'Temps partiel', 'Soins de base,Empathie,Résistance au stress',        'active'),
(10, 'Community Manager',      'Agence digitale recherche un community manager freelance pour gérer les réseaux sociaux de 3 marques tunisiennes.',                                        'MediaLab TN',          'ML', 'Médias',        'En ligne',              1000.00,  'Flexible',         'Temps partiel', 'Réseaux sociaux,Création de contenu,Canva',          'active'),
(16, 'Caissier/Caissière',     'Supermarché Azur à Sfax recrute un(e) caissier/caissière pour les shifts du soir. Manipulation d''espèces, scan de produits.',                            'Supermarché Azur',     'SA', 'Commerce',      'Sfax',                   600.00,  'Soir (16h-21h)',   'Temps partiel', 'Calcul rapide,Patience,Service client',              'active'),
(17, 'Photographe événementiel','Studio photo recherche un photographe pour couvrir des mariages et événements les weekends. Matériel professionnel requis.',                              'CaptureTN',            'CT', 'Médias',        'Tunis',                 1300.00,  'Weekend (Sam-Dim)','Temps partiel', 'Photographie,Lightroom,Créativité',                  'en_attente'),
(18, 'Barista',                'Café artisanal à Sidi Bou Saïd cherche un(e) barista passionné(e) par le café de spécialité. Formation assurée.',                                          'Brew House Café',      'BH', 'Restauration',  'Sidi Bou Saïd',          750.00,  'Matin (7h-12h)',   'Temps partiel', 'Café,Service client,Propreté',                       'active');

-- Candidatures (les IDs candidats sont 2..6, les IDs jobs 1..12)
INSERT INTO candidatures (job_id, candidat_id, message, statut) VALUES
(1,  2, 'Bonjour, je suis très intéressée par ce poste de serveuse.', 'acceptee'),
(6,  2, 'Je suis disponible les weekends et motivée.',                  'en_attente'),
(5,  3, 'Développeur React passionné, j''aimerais rejoindre votre équipe.', 'acceptee'),
(9,  3, 'Bonjour, je postule pour le poste de Community Manager.',     'en_attente'),
(10, 4, 'Bonjour, je suis intéressée par ce poste à Sfax.',            'refusee'),
(2,  4, 'Je suis disponible pour les weekends.',                       'en_attente'),
(11, 5, 'Photographe avec 3 ans d''expérience.',                       'en_attente'),
(6,  5, 'Présentation soignée, française courante.',                   'acceptee'),
(9,  6, 'Expérimentée dans la gestion de réseaux sociaux.',            'refusee'),
(12, 2, 'Passionnée par le café, j''aimerais découvrir votre équipe.', 'en_attente');
