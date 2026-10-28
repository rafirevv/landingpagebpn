<?php
/**
 * ==============================================================================
 * STATS API - PORTAL KANTAH ATR/BPN BONE BOLANGO
 * ==============================================================================
 * Menyimpan dan mengembalikan statistik kunjungan landing page & klik tautan.
 * Data disimpan secara lokal di data/stats.json dengan perlindungan file locking.
 * ==============================================================================
 */

// Header Respons JSON & CORS
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$dataDir = __DIR__ . '/../data';
$statsFile = $dataDir . '/stats.json';

// Pastikan folder data ada
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}

// Inisialisasi struktur default
$defaultData = [
    'visits' => 372,
    'clicks' => 0,
    'lastUpdated' => date('c'),
    'linkClicks' => []
];

// Baca data yang ada atau buat baru
$stats = $defaultData;
if (file_exists($statsFile)) {
    $content = @file_get_contents($statsFile);
    if ($content) {
        $decoded = @json_decode($content, true);
        if (is_array($decoded)) {
            $stats = array_merge($defaultData, $decoded);
        }
    }
}

// Baca parameter aksi (dari GET atau POST body / query)
$action = isset($_GET['action']) ? $_GET['action'] : '';
if (!$action && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = @json_decode(file_get_contents('php://input'), true);
    if (isset($input['action'])) {
        $action = $input['action'];
    }
}

$linkId = isset($_GET['linkId']) ? trim($_GET['linkId']) : '';
if (!$linkId && isset($input['linkId'])) {
    $linkId = trim($input['linkId']);
}

$needsSave = false;

if ($action === 'visit') {
    $stats['visits'] = (int)($stats['visits'] ?? 0) + 1;
    $stats['lastUpdated'] = date('c');
    $needsSave = true;
} elseif ($action === 'click') {
    $stats['clicks'] = (int)($stats['clicks'] ?? 0) + 1;
    if ($linkId) {
        if (!isset($stats['linkClicks'])) {
            $stats['linkClicks'] = [];
        }
        $stats['linkClicks'][$linkId] = (int)($stats['linkClicks'][$linkId] ?? 0) + 1;
    }
    $stats['lastUpdated'] = date('c');
    $needsSave = true;
} elseif ($action === 'reset') {
    // Opsional untuk keperluan maintenance
    $stats['visits'] = 1;
    $stats['clicks'] = 0;
    $stats['linkClicks'] = [];
    $stats['lastUpdated'] = date('c');
    $needsSave = true;
}

if ($needsSave || !file_exists($statsFile)) {
    $fp = @fopen($statsFile, 'c+');
    if ($fp) {
        if (flock($fp, LOCK_EX)) {
            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            fflush($fp);
            flock($fp, LOCK_UN);
        }
        fclose($fp);
    }
}

$visits = (int)($stats['visits'] ?? 1);
$clicks = (int)($stats['clicks'] ?? 0);
$totalVisits = $visits + $clicks;

echo json_encode([
    'success' => true,
    'totalVisits' => $totalVisits,
    'visits' => $visits,
    'clicks' => $clicks,
    'lastUpdated' => $stats['lastUpdated'] ?? date('c')
]);
