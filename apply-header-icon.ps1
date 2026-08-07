param([string]$SiteRoot = ".")

$ErrorActionPreference = "Stop"
$index = Join-Path $SiteRoot "index.html"
$assets = Join-Path $SiteRoot "assets"

if (-not (Test-Path $index)) { throw "index.html not found: $index" }
if (-not (Test-Path $assets)) { New-Item -ItemType Directory -Path $assets | Out-Null }

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = Join-Path $SiteRoot "index.before-header-logo.$stamp.html"
Copy-Item $index $backup -Force

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Copy-Item (Join-Path $scriptDir "paulbooth-ai-header-icon.png") (Join-Path $assets "paulbooth-ai-header-icon.png") -Force

$html = Get-Content $index -Raw

# Replace only the header mini-brand PB circle, not the footer PB mark.
$old = '<a class="mini-brand" href="#top" aria-label="PaulBooth.ai home">\s*<span class="mini-brand-mark">PB</span>\s*<span>PAULBOOTH\.AI</span>'
$new = '<a class="mini-brand" href="#top" aria-label="PaulBooth.ai home">' + "`r`n" +
       '      <img class="mini-brand-logo mini-brand-logo--ai" src="assets/paulbooth-ai-header-icon.png" alt="" aria-hidden="true" />' + "`r`n" +
       '      <span>PAULBOOTH.AI</span>'

$updated = [regex]::Replace($html, $old, $new, 1)
if ($updated -eq $html) {
    throw "Could not find the PaulBooth.ai header mini-brand markup to replace."
}
$html = $updated

$start = "<!-- PB-AI HEADER ICON START -->"
$end = "<!-- PB-AI HEADER ICON END -->"
$pattern = [regex]::Escape($start) + ".*?" + [regex]::Escape($end)
$html = [regex]::Replace($html, $pattern, "", [System.Text.RegularExpressions.RegexOptions]::Singleline)

$css = @'
<!-- PB-AI HEADER ICON START -->
<style id="pb-ai-header-icon">
  .site-header .mini-brand-logo--ai {
    display: block !important;
    width: 42px !important;
    height: 42px !important;
    flex: 0 0 42px !important;
    object-fit: contain !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  @media (max-width: 760px) {
    .site-header .mini-brand-logo--ai {
      width: 36px !important;
      height: 36px !important;
      flex-basis: 36px !important;
    }
  }
</style>
<!-- PB-AI HEADER ICON END -->
'@

if ($html -notmatch "</head>") { throw "Could not find </head>." }
$html = $html.Replace("</head>", "$css`r`n</head>")
Set-Content $index $html -Encoding UTF8

Write-Host ""
Write-Host "PaulBooth.ai header icon installed."
Write-Host "Backup: $backup"
Write-Host ""
Select-String -Path $index -Pattern "paulbooth-ai-header-icon.png|PB-AI HEADER ICON"
