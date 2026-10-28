<?php
/**
 * ==============================================================================
 * STATS API - PORTAL KANTAH ATR/BPN BONE BOLANGO
 * ==============================================================================
 * Menyimpan dan mengembalikan statistik kunjungan landing page & klik tautan
 * secara terintegrasi menyeluruh antar perangkat secara realtime.
 * Data disimpan secara terpusat di data/stats.json dengan atomic file locking.
 * ==============================================================================
 */

// Header Respons JSON & CORS Lengkap
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$dataDir = __DIR__ . '/../data';
$statsFile = $dataDir . '/stats.json';

// Pastikan direktori data tersedia
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}

// Konfigurasi Baseline Terpusat (Default 372)
$DEFAULT_BASELINE_VISITS = 372;

$defaultData = [
    'visits' => $DEFAULT_BASELINE_VISITS,
    'clicks' => 0,
    'lastUpdated' => date('c'),
    'linkClicks' => []
];

// Baca parameter aksi (dari GET atau POST json/body)
$action = isset($_GET['action']) ? trim($_GET['action']) : '';
$linkId = isset($_GET['linkId']) ? trim($_GET['linkId']) : '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    if ($rawInput) {
        $input = @json_decode($rawInput, true);
        if (is_array($input)) {
            if (!$action && isset($input['action'])) {
                $action = trim($input['action']);
            }
            if (!$linkId && isset($input['linkId'])) {
                $linkId = trim($input['linkId']);
            }
        }
    }
}

// Fungsi pembantu membaca data statistik dengan aman
function loadStats($filePath, $defaults, $minVisits) {
    if (!file_exists($filePath)) {
        return $defaults;
    }
    $content = @file_get_contents($filePath);
    if (!$content) {
        return $defaults;
    }
    $decoded = @json_decode($content, true);
    if (!is_array($decoded)) {
        return $defaults;
    }
    $stats = array_merge($defaults, $decoded);
    if (!isset($stats['visits']) || (int)$stats['visits'] < $minVisits) {
        $stats['visits'] = $minVisits;
    }
    if (!isset($stats['clicks'])) {
        $stats['clicks'] = 0;
    }
    return $stats;
}

$stats = $defaultData;

// Jika ada mutasi (visit, click, reset), gunakan atomic lock file
if ($action === 'visit' || $action === 'click' || $action === 'reset') {
    $fp = @fopen($statsFile, 'c+');
    if ($fp) {
        if (flock($fp, LOCK_EX)) {
            $fileSize = filesize($statsFile);
            $content = '';
            if ($fileSize > 0) {
                $content = fread($fp, $fileSize);
            }
            $decoded = $content ? @json_decode($content, true) : null;
            if (is_array($decoded)) {
                $stats = array_merge($defaultData, $decoded);
            } else {
                $stats = $defaultData;
            }

            // Pastikan tidak di bawah baseline
            if (!isset($stats['visits']) || (int)$stats['visits'] < $DEFAULT_BASELINE_VISITS) {
                $stats['visits'] = $DEFAULT_BASELINE_VISITS;
            }

            if ($action === 'visit') {
                $stats['visits'] = (int)$stats['visits'] + 1;
                $stats['lastUpdated'] = date('c');
            } elseif ($action === 'click') {
                $stats['clicks'] = (int)($stats['clicks'] ?? 0) + 1;
                if ($linkId) {
                    if (!isset($stats['linkClicks']) || !is_array($stats['linkClicks'])) {
                        $stats['linkClicks'] = [];
                    }
                    $stats['linkClicks'][$linkId] = (int)($stats['linkClicks'][$linkId] ?? 0) + 1;
                }
                $stats['lastUpdated'] = date('c');
            } elseif ($action === 'reset') {
                $stats['visits'] = $DEFAULT_BASELINE_VISITS;
                $stats['clicks'] = 0;
                $stats['linkClicks'] = [];
                $stats['lastUpdated'] = date('c');
            }

            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            fflush($fp);
            flock($fp, LOCK_UN);
        }
        fclose($fp);
    }
} else {
    // Mode Baca Realtime (Polling / GET)
    $stats = loadStats($statsFile, $defaultData, $DEFAULT_BASELINE_VISITS);
}

$visits = (int)($stats['visits'] ?? $DEFAULT_BASELINE_VISITS);
$clicks = (int)($stats['clicks'] ?? 0);
$totalVisits = $visits + $clicks;

echo json_encode([
    'success' => true,
    'totalVisits' => $totalVisits,
    'visits' => $visits,
    'clicks' => $clicks,
    'lastUpdated' => $stats['lastUpdated'] ?? date('c'),
    'serverTime' => time()
]);
