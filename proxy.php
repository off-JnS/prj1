<?php
// proxy.php - simple forwarder to submit-form.com
// Minimal example for forwarding POST data server-side.
// Add validation, sanitization, and rate-limiting in production.

$target = 'https://submit-form.com/ToyVBU170';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method not allowed';
    exit;
}

// Build POST body
$postFields = http_build_query($_POST);

$ch = curl_init($target);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HEADER, true);

$headers = [
    'Content-Type: application/x-www-form-urlencoded',
];
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$respBody = $response !== false ? substr($response, $headerSize) : '';
curl_close($ch);

http_response_code($httpCode);
header('Content-Type: text/html; charset=utf-8');
echo $respBody;
