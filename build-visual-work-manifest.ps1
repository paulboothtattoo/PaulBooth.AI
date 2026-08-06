$ErrorActionPreference = "Stop"
$siteRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$visualFolder = Join-Path $siteRoot "content\visual-work"
$outputFile = Join-Path $visualFolder "visual-work-manifest.json"

if (-not (Test-Path $visualFolder)) {
  throw "Visual work folder not found: $visualFolder"
}

$extensions = @(".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif")
$files = Get-ChildItem -Path $visualFolder -File |
  Where-Object { $extensions -contains $_.Extension.ToLowerInvariant() } |
  Sort-Object Name |
  Select-Object -ExpandProperty Name

@{ files = @($files) } |
  ConvertTo-Json -Depth 3 |
  Set-Content -Path $outputFile -Encoding UTF8

Write-Host "Created $outputFile with $($files.Count) images."
