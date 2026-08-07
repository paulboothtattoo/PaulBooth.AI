param([string]$SiteRoot = ".")

$ErrorActionPreference = "Stop"
$index = Join-Path $SiteRoot "index.html"
if (-not (Test-Path $index)) { throw "index.html not found: $index" }

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = Join-Path $SiteRoot "index.before-mobile-title-fix.$stamp.html"
Copy-Item $index $backup -Force

$html = Get-Content $index -Raw

$start = "<!-- PB-AI MOBILE TITLE OVERFLOW FIX START -->"
$end   = "<!-- PB-AI MOBILE TITLE OVERFLOW FIX END -->"
$pattern = [regex]::Escape($start) + ".*?" + [regex]::Escape($end)
$html = [regex]::Replace(
    $html,
    $pattern,
    "",
    [System.Text.RegularExpressions.RegexOptions]::Singleline
)

$patch = @'
<!-- PB-AI MOBILE TITLE OVERFLOW FIX START -->
<style id="pb-ai-mobile-title-overflow-fix">
@media (max-width: 760px) {
  html,
  body {
    max-width: 100%;
    overflow-x: hidden !important;
  }

  main,
  main section,
  main .section-shell,
  main [class*="grid"],
  main [class*="card"] {
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  main h1,
  main h2,
  main h3,
  main h4,
  #machines #machine-grid .manifest-machine-card h3,
  #machines #machine-grid .machine-card h3,
  #machine-grid .manifest-machine-card h3,
  #machine-grid .machine-card h3,
  #motion-project-grid h3,
  #folder-media-grid h3 {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    white-space: normal !important;
    word-break: normal !important;
    overflow-wrap: anywhere !important;
    hyphens: none !important;
    overflow: visible !important;
    text-overflow: clip !important;
    box-sizing: border-box !important;
  }

  #machines #machine-grid .manifest-machine-card h3,
  #machines #machine-grid .machine-card h3,
  #machine-grid .manifest-machine-card h3,
  #machine-grid .machine-card h3 {
    font-size: clamp(13px, 4vw, 17px) !important;
    line-height: 1.2 !important;
    letter-spacing: .01em !important;
  }

  main h2 {
    font-size: clamp(22px, 7vw, 34px) !important;
    line-height: 1.08 !important;
    letter-spacing: .02em !important;
  }

  main h3 {
    line-height: 1.18 !important;
  }
}
</style>
<!-- PB-AI MOBILE TITLE OVERFLOW FIX END -->
'@

if ($html -notmatch "</head>") { throw "Could not find </head> in index.html" }
$html = $html.Replace("</head>", "$patch`r`n</head>")
Set-Content $index $html -Encoding UTF8

Write-Host ""
Write-Host "Mobile title overflow fix applied."
Write-Host "Backup: $backup"
Write-Host ""
Select-String -Path $index -Pattern "PB-AI MOBILE TITLE OVERFLOW FIX"
