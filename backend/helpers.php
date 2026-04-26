<?php
// ============================================================
// FlexWork - Helpers (CORS + JSON I/O)
// ⚠️  IMPORTANT: send CORS headers immediately, BEFORE any other
// code that might emit output (warnings, BOM, db errors...).
// Otherwise the browser blocks the response with a CORS error.
// ============================================================

// Send permissive CORS headers as early as possible.
// Echoed for EVERY request hitting any file that includes helpers.php.
if (!headers_sent()) {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Max-Age: 86400");
    header("Content-Type: application/json; charset=UTF-8");
}

// Answer preflight immediately — no method check, no DB, no nothing.
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit(0);
}

// Don't render PHP warnings into the JSON body (they break parsing & CORS).
// Errors are still logged server-side.
ini_set('display_errors', '0');
error_reporting(E_ALL);

function cors_and_json(array $methods = ['GET']): void {
    // CORS already sent above — here we just enforce method.
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
