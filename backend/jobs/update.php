<?php
// Modifier une offre (employeur)
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['POST']);

$data = read_json_body();
require_fields($data, ['id']);
$id = (int)$data['id'];

$fields = [];
$params = [];
$types  = "";

foreach (['title','description','secteur','lieu','horaire','type'] as $f) {
    if (isset($data[$f])) { $fields[] = "$f = ?"; $params[] = trim((string)$data[$f]); $types .= "s"; }
}
if (isset($data['salaire'])) {
    $fields[] = "salaire = ?"; $params[] = (float)$data['salaire']; $types .= "d";
}
if (isset($data['competences'])) {
    $val = is_array($data['competences']) ? implode(',', $data['competences']) : (string)$data['competences'];
    $fields[] = "competences = ?"; $params[] = $val; $types .= "s";
}

if (empty($fields)) json_err("Aucun champ à mettre à jour", 400);

$params[] = $id; $types .= "i";
$sql = "UPDATE jobs SET " . implode(', ', $fields) . " WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
if (!$stmt->execute()) json_err("Erreur de mise à jour", 500);
$stmt->close();
$conn->close();

json_ok(["id" => $id], "Offre mise à jour");
