<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

cors_and_json(['POST']);

$data = read_json_body();
$email    = isset($data['email'])    ? trim((string)$data['email'])    : '';
$password = isset($data['password']) ? (string)$data['password']        : '';

if ($email === '' || $password === '') {
    json_err("Email et mot de passe requis", 400);
}

$stmt = $conn->prepare("SELECT id, name, email, password, role, statut, telephone, ville,
                               disponibilites, competences, cv,
                               entreprise, secteur, logo, created_at
                        FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    $stmt->close(); $conn->close();
    json_err("Email ou mot de passe incorrect", 401);
}

$user = $res->fetch_assoc();
$stmt->close();
$conn->close();

// Vérifier mot de passe (compatible bcrypt + plain text en fallback)
$ok = false;
if (password_verify($password, $user['password'])) {
    $ok = true;
} elseif ($user['password'] === $password) {
    // Compatibilité legacy avec d'anciens comptes en clair
    $ok = true;
}

if (!$ok) json_err("Email ou mot de passe incorrect", 401);
if ($user['statut'] === 'bloque') json_err("Votre compte est bloqué. Contactez l'administrateur.", 403);

unset($user['password']);
$user['disponibilites'] = $user['disponibilites'] ? array_values(array_filter(array_map('trim', explode(',', $user['disponibilites'])))) : [];
$user['competences']    = $user['competences']    ? array_values(array_filter(array_map('trim', explode(',', $user['competences'])))) : [];

json_ok(["user" => $user], "Connexion réussie");
