<# =====================================================================
   REFAIRE LES VIDÉOS DE TRANSITION OU LES IMAGES DU KIT TWITCH — avec tes couleurs et tes textes.

   Lancé par les boutons du script OBS (outils/actualiser-obs.lua) : « Refaire les vidéos de transition »
   et « Refaire les images du kit Twitch ». Il tourne en arrière-plan, sans bloquer OBS.
     -Quoi transitions   node outils/generer-transitions.mjs → transitions/videos/*.webm
     -Quoi kit           node outils/exporter-chaine.mjs     → chaine/export/*.png (le dossier s'ouvre à la fin)
     -Installer          installe d'abord ce qui manque (Node.js, et ffmpeg pour les transitions) avec winget
     -Sortie <fichier>   écrit le résultat (etat=fini|manque|erreur, message=…) pour le script OBS

   Il a besoin de Node.js (et de ffmpeg pour les vidéos). S'ils manquent, il le dit (etat=manque) sans
   rien installer ; le script OBS propose alors de recliquer : il relance avec -Installer.
   Journal complet du dernier passage : %TEMP%\overlay-refaire-<quoi>.log

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/outils/).
   Enregistré en UTF-8 AVEC BOM : sinon Windows PowerShell 5.1 lit mal les accents.
   ===================================================================== #>
param(
  [ValidateSet('transitions', 'kit')] [string] $Quoi = 'transitions',
  [string] $Sortie = '',
  [switch] $Installer
)
$ErrorActionPreference = 'Stop'
$racine = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding $false
$journal = Join-Path $env:TEMP "overlay-refaire-$Quoi.log"

function Finir($etat, $message) {
  if ($Sortie) { [IO.File]::WriteAllText($Sortie, "etat=$etat`nmessage=$($message -replace '[\r\n]+', ' ')`n", $utf8) }
  else { Write-Host $message }
  exit $(if ($etat -eq 'erreur') { 1 } else { 0 })
}
# Après une installation, le PATH de CE processus n'est pas à jour : on le relit (machine + utilisateur)
function RelirePath {
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
}
function Trouver($nom, $autres) {
  $c = Get-Command $nom -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($c) { return $c.Source }
  foreach ($a in $autres) { if ($a -and (Test-Path -LiteralPath $a)) { return $a } }
  return $null
}
function ChercherNode { Trouver 'node' @("$env:ProgramFiles\nodejs\node.exe", "${env:ProgramFiles(x86)}\nodejs\node.exe") }
function ChercherFfmpeg {
  $liens = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Links\ffmpeg.exe'
  $paquets = Get-ChildItem -Path (Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages') -Filter ffmpeg.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
  Trouver 'ffmpeg' @($env:FFMPEG, $liens, $(if ($paquets) { $paquets.FullName }), 'G:\Applications\ffmpeg\bin\ffmpeg.exe')
}
function Installer($id, $nom) {
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Finir 'erreur' "$nom manque, et winget (l'installeur de Windows) n'est pas là : installe $nom à la main (tuto, section 9 « Les scripts »), puis reclique."
  }
  & cmd /c "winget install -e --id $id --silent --accept-package-agreements --accept-source-agreements >> `"$journal`" 2>&1"
  RelirePath
}

try {
  Set-Content -LiteralPath $journal -Value "=== $(Get-Date) — refaire $Quoi ===" -Encoding UTF8
  # --- Les outils : Node.js (et ffmpeg pour les vidéos) ---
  $node = ChercherNode
  $ffmpeg = if ($Quoi -eq 'transitions') { ChercherFfmpeg } else { 'inutile' }
  $manque = @()
  if (-not $node) { $manque += 'Node.js' }
  if (-not $ffmpeg) { $manque += 'ffmpeg' }
  if ($manque.Count) {
    if (-not $Installer) {
      Finir 'manque' "Il manque $($manque -join ' et ') sur ce PC. Reclique sur le bouton : ils seront installés tout seuls (2 à 5 minutes), puis ça continue."
    }
    if (-not $node) { Installer 'OpenJS.NodeJS.LTS' 'Node.js'; $node = ChercherNode }
    if (-not $ffmpeg) { Installer 'Gyan.FFmpeg' 'ffmpeg'; $ffmpeg = ChercherFfmpeg }
    if (-not $node) { Finir 'erreur' "Node.js n'a pas pu être installé (détails : $journal). Installe-le à la main (tuto, section 9), puis reclique." }
    if (-not $ffmpeg) { Finir 'erreur' "ffmpeg n'a pas pu être installé (détails : $journal). Installe-le à la main (tuto, section 9), puis reclique." }
  }
  if ($Quoi -eq 'transitions') { $env:FFMPEG = $ffmpeg }

  # --- Le script de l'overlay ---
  $script = if ($Quoi -eq 'transitions') { 'outils\generer-transitions.mjs' } else { 'outils\exporter-chaine.mjs' }
  if (-not (Test-Path -LiteralPath (Join-Path $racine $script))) { Finir 'erreur' "$script introuvable dans $racine." }
  Push-Location $racine
  try {
    # par cmd : la sortie de node va telle quelle (UTF-8) dans le journal ; sa progression sur la sortie d'erreur n'est pas une erreur
    & cmd /c "`"$node`" $script >> `"$journal`" 2>&1"
    $code = $LASTEXITCODE
  } finally { Pop-Location }
  if ($code -ne 0) {
    $fin = (Get-Content -LiteralPath $journal -Tail 3 -Encoding UTF8 -ErrorAction SilentlyContinue) -join ' '
    Finir 'erreur' "Le script s'est arrêté ($fin). Journal complet : $journal"
  }

  if ($Quoi -eq 'transitions') {
    $n = @(Get-ChildItem -LiteralPath (Join-Path $racine 'transitions\videos') -Filter *.webm -ErrorAction SilentlyContinue).Count
    Finir 'fini' "Vidéos de transition refaites ($n) : OBS les recharge tout seul."
  } else {
    $dossierKit = Join-Path $racine 'chaine\export'
    $n = @(Get-ChildItem -LiteralPath $dossierKit -Filter *.png -ErrorAction SilentlyContinue).Count
    Start-Process explorer.exe $dossierKit
    Finir 'fini' "Images du kit refaites ($n), dans chaine\export (le dossier vient de s'ouvrir) : à envoyer sur Twitch (tuto, section 7)."
  }
} catch {
  Finir 'erreur' "Erreur : $($_.Exception.Message) (journal : $journal)"
}
