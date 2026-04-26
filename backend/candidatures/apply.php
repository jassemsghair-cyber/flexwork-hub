<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['POST']);

$data = read_json_body();
require_fields($data, ['job_id', 'candidat_id']);

$jobId     = (int)$data['job_id'];
$candidatId = (int)$data['candidat_id'];
$message   = isset($data['message']) ? trim((string)$data['message']) : null;
$cv        = isset($data['cv']) ? trim((string)$data['cv']) : null;

// Verify job exists & is active
$stmt = $conn->prepare("SELECT id, statut FROM jobs WHERE id = ?");
$stmt->bind_param("i", $jobId);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) {
    $stmt->close();
    json_err("Offre introuvable", 404);
}
$job = $res->fetch_assoc();
$stmt->close();
if ($job['statut'] !== 'active') {
    json_err("Cette offre n'est pas ouverte aux candidatures", 403);
}

// Verify candidate exists
$stmt = $conn->prepare("SELECT id, role, statut FROM users WHERE id = ?");
$stmt->bind_param("i", $candidatId);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) {
    $stmt->close();
    json_err("Candidat introuvable", 404);
}
$user = $res->fetch_assoc();
$stmt->close();
if ($user['role'] !== 'candidat') {
    json_err("Seuls les candidats peuvent postuler", 403);
}
if ($user['statut'] === 'bloque') {
    json_err("Compte bloqué", 403);
}

// Insert (UNIQUE prevents duplicate)
$stmt = $conn->prepare("INSERT INTO candidatures (job_id, candidat_id, message, cv) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiss", $jobId, $candidatId, $message, $cv);

if (!$stmt->execute()) {
    if ($conn->errno === 1062) {
        json_err("Vous avez déjà postulé à cette offre", 409);
    }
    json_err("Erreur lors de la candidature", 500);
}

$id = $conn->insert_id;
$stmt->close();
$conn->close();

json_ok(["candidature" => [
    "id" => $id,
    "job_id" => $jobId,
    "candidat_id" => $candidatId,
    "statut" => "en_attente"
]], "Candidature enregistrée");
