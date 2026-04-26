<?php
// Détail d'une offre
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['GET']);

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) json_err("Paramètre id requis", 400);

$stmt = $conn->prepare("SELECT id, employeur_id, title, description, entreprise, logo, secteur, lieu,
                               salaire, horaire, type, competences, statut, created_at
                        FROM jobs WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    $stmt->close();
    json_err("Offre introuvable", 404);
}

$job = $res->fetch_assoc();
$job['competences'] = $job['competences'] ? array_values(array_filter(array_map('trim', explode(',', $job['competences'])))) : [];
$stmt->close();
$conn->close();

json_ok(["job" => $job]);
