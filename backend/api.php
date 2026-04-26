<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = [
    "success" => true,
    "message" => "Backend PHP fonctionne",
    "jobs" => [
        ["id" => 1, "title" => "Développeur React"],
        ["id" => 2, "title" => "Designer UI/UX"]
    ]
];

echo json_encode($data);
