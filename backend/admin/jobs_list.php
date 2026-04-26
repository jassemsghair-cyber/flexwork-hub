<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['GET']);

$statut = isset($_GET['statut']) ? trim((string)$_GET['statut']) : '';

$sql = "SELECT id, title, entreprise, secteur, lieu, salaire, horaire, statut, created_at FROM jobs WHERE 1=1";
$params = []; $types = "";
if (in_array($statut, ['active','en_attente','rejetee','inactive'], true)) {
    $sql .= " AND statut = ?";
    $params[] = $statut; $types .= "s";
}
$sql .= " ORDER BY created_at DESC";

$stmt = $conn->prepare($sql);
if ($params) $stmt->bind_param($types, ...$params);
$stmt->execute();
$res = $stmt->get_result();

$rows = [];
while ($row = $res->fetch_assoc()) $rows[] = $row;

$stmt->close();
$conn->close();

json_ok(["jobs" => $rows, "total" => count($rows)]);
