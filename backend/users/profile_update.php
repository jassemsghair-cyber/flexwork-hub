<?php
// Mise à jour du profil utilisateur (candidat ou employeur)
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['POST']);

$data = read_json_body();
require_fields($data, ['id']);
$id = (int)$data['id'];

$allowed = ['name','email','telephone','ville','disponibilites','competences','cv','entreprise','secteur','logo'];
$fields = []; $params = []; $types = "";

foreach ($allowed as $f) {
    if (!array_key_exists($f, $data)) continue;
    $val = $data[$f];
    if (in_array($f, ['disponibilites','competences'], true) && is_array($val)) {
        $val = implode(',', $val);
    }
    $fields[] = "$f = ?";
    $params[] = $val === null ? null : (string)$val;
    $types .= "s";
}

if (isset($data['password']) && $data['password'] !== '') {
    $fields[] = "password = ?";
    $params[] = password_hash((string)$data['password'], PASSWORD_DEFAULT);
    $types .= "s";
}

if (empty($fields)) json_err("Aucun champ à mettre à jour", 400);

$params[] = $id; $types .= "i";
$sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
if (!$stmt->execute()) {
    if ($conn->errno === 1062) json_err("Cet email est déjà utilisé", 409);
    json_err("Erreur de mise à jour", 500);
}
$stmt->close();

// Renvoyer l'utilisateur mis à jour
$stmt = $conn->prepare("SELECT id, name, email, role, statut, telephone, ville,
                               disponibilites, competences, cv,
                               entreprise, secteur, logo, created_at
                        FROM users WHERE id = ?");
$stmt->bind_param("i", $id); $stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();
$conn->close();

$user['disponibilites'] = $user['disponibilites'] ? array_values(array_filter(array_map('trim', explode(',', $user['disponibilites'])))) : [];
$user['competences']    = $user['competences']    ? array_values(array_filter(array_map('trim', explode(',', $user['competences'])))) : [];

json_ok(["user" => $user], "Profil mis à jour");
