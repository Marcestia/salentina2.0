<?php
header('Content-Type: application/json; charset=utf-8');

$dataDir = __DIR__ . '/data';
$dataFile = $dataDir . '/status.json';
$adminPassword = 'pizza 2025';

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0775, true);
}

function readStatus($file)
{
    if (!file_exists($file)) {
        return ['message' => '', 'color' => 'closed'];
    }

    $content = file_get_contents($file);
    $decoded = json_decode($content, true);

    if (!is_array($decoded)) {
        return ['message' => '', 'color' => 'closed'];
    }

    return [
        'message' => isset($decoded['message']) ? trim((string) $decoded['message']) : '',
        'color' => ($decoded['color'] ?? 'closed') === 'open' ? 'open' : 'closed'
    ];
}

function writeStatus($file, $payload)
{
    return file_put_contents($file, json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['ok' => true, 'status' => readStatus($dataFile)], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Méthode non autorisée'], JSON_UNESCAPED_UNICODE);
    exit;
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Corps JSON invalide'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($input['password'] ?? '') !== $adminPassword) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Mot de passe incorrect'], JSON_UNESCAPED_UNICODE);
    exit;
}

$action = $input['action'] ?? '';

if ($action === 'save') {
    $message = trim((string) ($input['message'] ?? ''));
    $color = ($input['color'] ?? 'closed') === 'open' ? 'open' : 'closed';

    if ($message === '') {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Le message est obligatoire'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $status = ['message' => $message, 'color' => $color];
    writeStatus($dataFile, $status);

    echo json_encode(['ok' => true, 'status' => $status], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($action === 'clear') {
    $status = ['message' => '', 'color' => 'closed'];
    writeStatus($dataFile, $status);

    echo json_encode(['ok' => true, 'status' => $status], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(400);
echo json_encode(['ok' => false, 'error' => 'Action inconnue'], JSON_UNESCAPED_UNICODE);
