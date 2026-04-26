<?php
// Shared helpers: CORS, JSON parsing, response wrappers
function cors_and_json(array $methods = ['GET']): void {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: " . implode(', ', $methods) . ", OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json; charset=UTF-8");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit(0);
    }
    if (!in_array($_SERVER['REQUEST_METHOD'], $methods, true)) {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Méthode non autorisée"]);
        exit;
    }
}

function read_json_body(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return $_POST ?? [];
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        // fallback to form-data
        return $_POST ?? [];
    }
    return $data;
}

function json_ok($payload = [], string $message = 'OK'): void {
    echo json_encode(array_merge(["success" => true, "message" => $message], (array)$payload));
    exit;
}

function json_err(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(["success" => false, "message" => $message]);
    exit;
}

function require_fields(array $data, array $fields): void {
    foreach ($fields as $f) {
        if (!isset($data[$f]) || $data[$f] === '' || $data[$f] === null) {
            json_err("Champ requis manquant : $f", 400);
        }
    }
}
