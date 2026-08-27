$ErrorActionPreference = "Stop"
$files = @("lib/data/articles.ts", "lib/data/projects.ts", "lib/data/free-tools.ts", "lib/data/locations.ts")
$source = ($files | ForEach-Object { Get-Content -Raw -Encoding utf8 $_ }) -join "`n"
$matches = [regex]::Matches($source, '"((?:\\.|[^"\\])*)"')
$seen = [System.Collections.Generic.HashSet[string]]::new()
$candidates = [System.Collections.Generic.List[string]]::new()
foreach ($match in $matches) {
  $value = $match.Groups[1].Value -replace '\\(["\\])', '$1'
  if ($value.Length -lt 8 -or $value.Length -le 480 -or $seen.Contains($value)) { continue }
  if ($value -match '^(https?:|/|framer-|rgb\(|rgba\(|#)' -or $value -match '^[a-z0-9_-]+$') { continue }
  if ($value -notmatch '[\u00C0-\u017F]|\b(une|des|les|le|la|pour|avec|dans|votre|vous|site|page|notre|sur|comment)\b') { continue }
  $seen.Add($value) | Out-Null
  $candidates.Add($value)
}

$translations = [ordered]@{}
if (Test-Path "lib/data/translation-map.ts") {
  $existingText = Get-Content -Raw -Encoding utf8 "lib/data/translation-map.ts"
  $existingStart = $existingText.IndexOf("{")
  $existingEnd = $existingText.IndexOf("};", $existingStart)
  $existingJson = $existingText.Substring($existingStart, $existingEnd - $existingStart + 1)
  $existing = $existingJson | ConvertFrom-Json
  foreach ($property in $existing.PSObject.Properties) { $translations[$property.Name] = $property.Value }
}
function Translate-Chunk([string]$query) {
  $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=$([uri]::EscapeDataString($query))"
  for ($attempt = 0; $attempt -lt 3; $attempt++) {
    try {
      $json = (Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 20).Content | ConvertFrom-Json
      $parts = @($json[0] | ForEach-Object { $_[0] })
      $candidate = ($parts -join "")
      if ($candidate -and $candidate -ne $query) { return $candidate }
    } catch { Start-Sleep -Milliseconds 500 }
  }
  return $query
}

function Translate-Value([string]$value) {
  if ($value.Length -le 480) { return Translate-Chunk $value }
  $chunks = [System.Collections.Generic.List[string]]::new()
  $remaining = $value
  while ($remaining.Length -gt 480) {
    $cut = $remaining.LastIndexOf(" ", 470)
    if ($cut -lt 80) { $cut = 470 }
    $chunks.Add($remaining.Substring(0, $cut))
    $remaining = $remaining.Substring($cut + 1)
  }
  if ($remaining) { $chunks.Add($remaining) }
  return (($chunks | ForEach-Object { Translate-Chunk $_ }) -join " ")
}

for ($index = 0; $index -lt $candidates.Count; $index++) {
  $value = $candidates[$index]
  $translated = Translate-Value $value
  if ($translated -ne $value) { $translations[$value] = $translated }
  if (($index + 1) % 20 -eq 0) { Write-Host "Translated $($index + 1)/$($candidates.Count)" }
  Start-Sleep -Milliseconds 80
}

$jsonOutput = $translations | ConvertTo-Json -Depth 4
$helper = @'

export function translateData<T>(value: T): T {
  if (typeof value === "string") return (TRANSLATIONS[value] ?? value) as T;
  if (Array.isArray(value)) return value.map((item) => translateData(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateData(item)])) as T;
  }
  return value;
}
'@
Set-Content -Encoding utf8 -Path "lib/data/translation-map.ts" -Value "export const TRANSLATIONS: Record<string, string> = $jsonOutput;$helper"
Write-Host "Saved $($translations.Count) translations from $($candidates.Count) candidates"
