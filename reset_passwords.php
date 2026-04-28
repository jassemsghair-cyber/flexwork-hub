<?php
require_once __DIR__ . '/backend/db.php';
$hash = password_hash('password', PASSWORD_BCRYPT);
$stmt = $conn->prepare("UPDATE users SET password = ?");
$stmt->bind_param("s", $hash);
if ($stmt->execute()) {
    echo "OK: All passwords updated to 'password'\n";
} else {
    echo "FAIL: " . $stmt->error . "\n";
}
$stmt->close();
$conn->close();
?>
