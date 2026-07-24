<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$root = realpath(__DIR__ . '/../content');
$categories = [
  'ai-platforms' => 'AI Platforms',
  'visual-work' => 'Visual Work',
  'motion' => 'Motion',
  'research' => 'Research',
  'experiments' => 'Active Experiments',
  'machines' => 'Intelligent Machines'
];

$extensions = [
  'jpg' => 'image', 'jpeg' => 'image', 'png' => 'image',
  'webp' => 'image', 'gif' => 'image', 'avif' => 'image',
  'mp4' => 'video', 'webm' => 'video', 'mov' => 'video',
  'mp3' => 'audio', 'wav' => 'audio', 'ogg' => 'audio', 'm4a' => 'audio',
  'pdf' => 'document'
];

function humanize($name) {
  $name = preg_replace('/[-_]+/', ' ', $name);
  $name = preg_replace('/\s+/', ' ', trim($name));
  return ucwords($name);
}

$items = [];

foreach ($categories as $slug => $label) {
  $dir = $root . DIRECTORY_SEPARATOR . $slug;
  if (!is_dir($dir)) continue;

  $files = scandir($dir);
  foreach ($files as $file) {
    if ($file === '.' || $file === '..' || $file === 'README.txt' || $file[0] === '.') continue;

    $path = $dir . DIRECTORY_SEPARATOR . $file;
    if (!is_file($path)) continue;

    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    if (!isset($extensions[$extension])) continue;

    $base = pathinfo($file, PATHINFO_FILENAME);
    $metadataPath = $dir . DIRECTORY_SEPARATOR . $base . '.json';
    $metadata = [];

    if (is_file($metadataPath)) {
      $decoded = json_decode(file_get_contents($metadataPath), true);
      if (is_array($decoded)) $metadata = $decoded;
    }

    $items[] = [
      'id' => $slug . '-' . preg_replace('/[^a-z0-9]+/i', '-', strtolower($base)),
      'category' => $slug,
      'categoryLabel' => $label,
      'title' => $metadata['title'] ?? humanize($base),
      'description' => $metadata['description'] ?? '',
      'type' => $metadata['type'] ?? $label,
      'status' => $metadata['status'] ?? '',
      'date' => $metadata['date'] ?? '',
      'link' => $metadata['link'] ?? '',
      'mediaType' => $extensions[$extension],
      'src' => 'content/' . rawurlencode($slug) . '/' . rawurlencode($file),
      'filename' => $file,
      'modified' => filemtime($path)
    ];
  }
}

usort($items, function($a, $b) {
  return $b['modified'] <=> $a['modified'];
});

echo json_encode([
  'generatedAt' => gmdate('c'),
  'items' => $items
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
