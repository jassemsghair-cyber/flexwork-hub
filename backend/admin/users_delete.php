<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['POST']);

$data = read_json_body();
require_fields($data, ['id']);
$id = (int)$data['id'];

// Prevent self-deleting an admin if last admin (basic guard)
$res = $conn->query("SELECT COUNT(*) AS c FROM users WHERE role = 'admin'");
$adminCount = (int)($res->fetch_assoc()['c'] ?? 0);

$stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$r = $stmt->get_result();
if ($r->num_rows === 0) { $stmt->close(); json_err("Utilisateur introuvable", 404); }
$role = $r->fetch_assoc()['role'];
$stmt->close();

if ($role === 'admin' && $adminCount <= 1) {
    json_err("Impossible de supprimer le dernier administrateur", 403);
}

$stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
if (!$stmt->execute()) json_err("Erreur de suppression", 500);
$stmt->close();
$conn->close();

json_ok(["id" => $id], "Utilisateur supprimé");
