<?php
// Récupérer le profil d'un utilisateur
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['GET']);

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) json_err("Paramètre id requis", 400);

$stmt = $conn->prepare("SELECT id, name, email, role, statut, telephone, ville,
                               disponibilites, competences, cv,
                               entreprise, secteur, logo, created_at
                        FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) { $stmt->close(); json_err("Utilisateur introuvable", 404); }
$user = $res->fetch_assoc();
$stmt->close();
$conn->close();

// Tableaux à partir des champs CSV
$user['disponibilites'] = $user['disponibilites'] ? array_values(array_filter(array_map('trim', explode(',', $user['disponibilites'])))) : [];
$user['competences']    = $user['competences']    ? array_values(array_filter(array_map('trim', explode(',', $user['competences'])))) : [];

json_ok(["user" => $user]);
