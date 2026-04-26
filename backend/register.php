<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

cors_and_json(['POST']);

$data = read_json_body();
$name     = isset($data['name'])     ? trim((string)$data['name'])     : '';
$email    = isset($data['email'])    ? trim((string)$data['email'])    : '';
$password = isset($data['password']) ? (string)$data['password']        : '';
$role     = isset($data['role'])     ? trim((string)$data['role'])     : 'candidat';
$telephone= isset($data['telephone'])? trim((string)$data['telephone']): null;
$ville    = isset($data['ville'])    ? trim((string)$data['ville'])    : null;
$entreprise = isset($data['entreprise']) ? trim((string)$data['entreprise']) : null;
$secteur    = isset($data['secteur'])    ? trim((string)$data['secteur'])    : null;
$logo       = null;

if ($name === '' || $email === '' || $password === '') {
    json_err("Nom, email et mot de passe requis", 400);
}
if (!in_array($role, ['candidat','employeur'], true)) {
    json_err("Rôle invalide", 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_err("Email invalide", 400);
}
if (strlen($password) < 6) {
    json_err("Le mot de passe doit faire au moins 6 caractères", 400);
}

if ($role === 'employeur') {
    if ($entreprise === null || $entreprise === '') $entreprise = $name;
    $logo = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $entreprise) ?: $entreprise, 0, 2));
}

// Email unique
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    $stmt->close(); $conn->close();
    json_err("Cet email est déjà utilisé", 409);
}
$stmt->close();

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (name, email, password, role, telephone, ville, entreprise, secteur, logo)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssss", $name, $email, $hash, $role, $telephone, $ville, $entreprise, $secteur, $logo);

if (!$stmt->execute()) {
    json_err("Erreur lors de l'inscription", 500);
}
$id = $conn->insert_id;
$stmt->close();
$conn->close();

json_ok(["user" => [
    "id"         => $id,
    "name"       => $name,
    "email"      => $email,
    "role"       => $role,
    "statut"     => "actif",
    "telephone"  => $telephone,
    "ville"      => $ville,
    "entreprise" => $entreprise,
    "secteur"    => $secteur,
    "logo"       => $logo,
]], "Inscription réussie");
