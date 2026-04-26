<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['POST']);

$data = read_json_body();
require_fields($data, ['id', 'statut']);

$id     = (int)$data['id'];
$statut = trim((string)$data['statut']);

if (!in_array($statut, ['en_attente', 'acceptee', 'refusee'], true)) {
    json_err("Statut invalide", 400);
}

$stmt = $conn->prepare("UPDATE candidatures SET statut = ? WHERE id = ?");
$stmt->bind_param("si", $statut, $id);
if (!$stmt->execute()) {
    json_err("Erreur lors de la mise à jour", 500);
}
if ($stmt->affected_rows === 0) {
    $stmt->close();
    json_err("Candidature introuvable", 404);
}
$stmt->close();
$conn->close();

json_ok(["id" => $id, "statut" => $statut], "Statut mis à jour");
