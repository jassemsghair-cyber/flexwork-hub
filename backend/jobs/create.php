<?php
// Créer une nouvelle offre (employeur)
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['POST']);

$data = read_json_body();
require_fields($data, ['employeur_id', 'title', 'secteur', 'lieu']);

$employeurId = (int)$data['employeur_id'];
$title       = trim((string)$data['title']);
$description = isset($data['description']) ? trim((string)$data['description']) : '';
$secteur     = trim((string)$data['secteur']);
$lieu        = trim((string)$data['lieu']);
$salaire     = isset($data['salaire']) ? (float)$data['salaire'] : 0;
$horaire     = isset($data['horaire']) ? trim((string)$data['horaire']) : '';
$type        = isset($data['type'])    ? trim((string)$data['type'])    : 'Temps partiel';
$competences = isset($data['competences']) ? (is_array($data['competences']) ? implode(',', $data['competences']) : (string)$data['competences']) : '';

// Récupérer entreprise + logo depuis le profil employeur
$stmt = $conn->prepare("SELECT entreprise, logo, role FROM users WHERE id = ?");
$stmt->bind_param("i", $employeurId);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) { $stmt->close(); json_err("Employeur introuvable", 404); }
$emp = $res->fetch_assoc();
$stmt->close();
if ($emp['role'] !== 'employeur') json_err("Seuls les employeurs peuvent publier", 403);

$entreprise = $emp['entreprise'] ?: 'Entreprise';
$logo       = $emp['logo'] ?: strtoupper(substr($entreprise, 0, 2));

// Les nouvelles offres sont en attente de modération
$statut = 'en_attente';

$stmt = $conn->prepare("INSERT INTO jobs (employeur_id, title, description, entreprise, logo, secteur, lieu, salaire, horaire, type, competences, statut)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("issssssdssss", $employeurId, $title, $description, $entreprise, $logo, $secteur, $lieu, $salaire, $horaire, $type, $competences, $statut);
if (!$stmt->execute()) {
    json_err("Erreur lors de la création de l'offre", 500);
}
$id = $conn->insert_id;
$stmt->close();
$conn->close();

json_ok(["job" => ["id" => $id, "statut" => $statut]], "Offre créée — en attente de validation");
