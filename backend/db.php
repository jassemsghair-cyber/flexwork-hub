<?php
// Always load helpers FIRST so CORS headers are sent before anything
// that could fail (DB connection, warnings, etc.)
require_once __DIR__ . '/helpers.php';

$host     = 'localhost';
$user     = 'root';
$password = '';
$dbname   = 'flexwork_hub';

// Suppress the default mysqli warning so we can return a clean JSON error
mysqli_report(MYSQLI_REPORT_OFF);

$conn = @new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    json_err("Connexion à la base de données impossible : " . $conn->connect_error, 500);
}

$conn->set_charset('utf8mb4');
