<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['POST']);

$data = read_json_body();
require_fields($data, ['id']);
$id = (int)$data['id'];

$stmt = $conn->prepare("DELETE FROM jobs WHERE id = ?");
$stmt->bind_param("i", $id);
if (!$stmt->execute()) json_err("Erreur de suppression", 500);
if ($stmt->affected_rows === 0) {
    $stmt->close();
    json_err("Offre introuvable", 404);
}
$stmt->close();
$conn->close();

json_ok(["id" => $id], "Offre supprimée");
