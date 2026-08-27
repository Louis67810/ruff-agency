$ErrorActionPreference = "Stop"
$files = @(
  "components/sections/BenefitsOptimized/BenefitsOptimized.tsx",
  "components/sections/AvisOptimized/AvisOptimized.tsx",
  "components/sections/ComparatifOptimized/ComparatifOptimized.tsx",
  "components/sections/PrixOptimized/PrixOptimized.tsx",
  "components/sections/StackSection3/StackSection3.jsx",
  "components/sections/ArticlesRessource/ArticlesRessource.jsx",
  "components/sections/RessourceArticle/RessourceArticle.jsx",
  "components/sections/SectionAvis/SectionAvis.jsx"
)
$source = ($files | ForEach-Object { [System.IO.File]::ReadAllText($_) }) -join "`n"
$matches = [regex]::Matches($source, '"((?:\\.|[^"\\])*)"')
$seen = [System.Collections.Generic.HashSet[string]]::new()
$candidates = [System.Collections.Generic.List[string]]::new()
foreach ($match in $matches) {
  $value = $match.Groups[1].Value -replace '\\(["\\])', '$1'
  if ($value.Length -lt 8 -or $seen.Contains($value)) { continue }
  if ($value -match '^(https?:|/|framer-|rgb\(|rgba\(|#)' -or $value -match '^[a-z0-9_-]+$') { continue }
  if ($value -notmatch '[\u00C0-\u017F]|\b(une|des|les|le|la|pour|avec|dans|votre|vous|site|page|notre|sur|comment|réserver|découvrez)\b') { continue }
  $seen.Add($value) | Out-Null
  $candidates.Add($value)
}
$translations = [ordered]@{}
function Translate-Chunk([string]$query) {
  $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=$([uri]::EscapeDataString($query))"
  for ($attempt = 0; $attempt -lt 2; $attempt++) {
    try {
      $json = (Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 15).Content | ConvertFrom-Json
      $candidate = (@($json[0] | ForEach-Object { $_[0] }) -join "")
      if ($candidate -and $candidate -ne $query) { return $candidate }
    } catch { Start-Sleep -Milliseconds 400 }
  }
  return $query
}
function Translate-Value([string]$value) {
  if ($value.Length -le 480) { return Translate-Chunk $value }
  $chunks = [System.Collections.Generic.List[string]]::new(); $remaining = $value
  while ($remaining.Length -gt 480) { $cut = $remaining.LastIndexOf(" ", 470); if ($cut -lt 80) { $cut = 470 }; $chunks.Add($remaining.Substring(0, $cut)); $remaining = $remaining.Substring($cut + 1) }
  if ($remaining) { $chunks.Add($remaining) }
  return (($chunks | ForEach-Object { Translate-Chunk $_ }) -join " ")
}
for ($index = 0; $index -lt $candidates.Count; $index++) {
  $value = $candidates[$index]; $translated = Translate-Value $value
  if ($translated -ne $value) { $translations[$value] = $translated }
  if (($index + 1) % 25 -eq 0) { Write-Host "Translated $($index + 1)/$($candidates.Count)" }
  Start-Sleep -Milliseconds 80
}
$jsonOutput = $translations | ConvertTo-Json -Depth 4
Set-Content -Encoding utf8 -Path "lib/data/shared-translation-map.ts" -Value "export const SHARED_TRANSLATIONS: Record<string, string> = $jsonOutput;`n"
Write-Host "Saved $($translations.Count) translations from $($candidates.Count) candidates"
