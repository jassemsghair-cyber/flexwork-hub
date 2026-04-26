<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

cors_and_json(['GET']);

$role   = isset($_GET['role']) ? trim((string)$_GET['role']) : '';
$search = isset($_GET['search']) ? trim((string)$_GET['search']) : '';

$sql = "SELECT id, name, email, role, statut, telephone, ville, created_at FROM users WHERE 1=1";
$params = [];
$types  = "";

if (in_array($role, ['candidat','employeur','admin'], true)) {
    $sql .= " AND role = ?";
    $params[] = $role; $types .= "s";
}
if ($search !== '') {
    $sql .= " AND (name LIKE ? OR email LIKE ?)";
    $like = "%$search%";
    $params[] = $like; $params[] = $like; $types .= "ss";
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

json_ok(["users" => $rows, "total" => count($rows)]);
