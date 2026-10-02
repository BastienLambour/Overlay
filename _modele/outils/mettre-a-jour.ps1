<# =====================================================================
   METTRE À JOUR L'OVERLAY — télécharge la dernière version depuis le serveur et
   l'installe, en gardant TES réglages (mes-reglages.js) et tes fichiers à toi.

   Lancé par le bouton « Mettre à jour l'overlay » du script OBS (outils/actualiser-obs.lua),
   ou par un double-clic sur mettre-a-jour.cmd (dossier de l'overlay).
     -Mode verifier   regarde seulement s'il y a une nouvelle version
     -Mode installer  (défaut) vérifie, sauvegarde l'ancienne version, installe la nouvelle
     -Sortie <fichier>  écrit le résultat (pour le script OBS) ; -SansPause : pas de « appuie sur une touche »

   Avant d'installer, l'overlay actuel est copié dans sauvegardes\<date> (les 3 dernières sont
   gardées). Les fichiers qui ne sont pas dans la nouvelle version (tes sons, mes-reglages.js…)
   ne sont jamais supprimés. Adresse du serveur : version.json (mis par le serveur dans le zip),
   sinon config.js › miseAJour.adresse.

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/outils/).
   Enregistré en UTF-8 AVEC BOM : sinon Windows PowerShell 5.1 lit mal les accents.
   ===================================================================== #>
param(
  [ValidateSet('verifier', 'installer')] [string] $Mode = 'installer',
  [string] $Sortie = '',
  [switch] $SansPause
)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$racine = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding $false
$resultat = [ordered]@{ etat = ''; version = ''; date = ''; message = '' }

function Dire($texte) { if (-not $Sortie) { Write-Host $texte } }
function Finir($etat, $message) {
  $resultat.etat = $etat; $resultat.message = $message
  if ($Sortie) {
    $lignes = $resultat.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value -replace '[\r\n]+', ' ')" }
    [IO.File]::WriteAllText($Sortie, ($lignes -join "`n") + "`n", $utf8)
  } else {
    Write-Host ''
    Write-Host $message -ForegroundColor $(if ($etat -eq 'erreur') { 'Red' } elseif ($etat -eq 'nouvelle') { 'Yellow' } else { 'Green' })
    if (-not $SansPause) { Write-Host ''; Read-Host 'Appuie sur Entrée pour fermer' | Out-Null }
  }
  exit $(if ($etat -eq 'erreur') { 1 } else { 0 })
}
function LireTexte($chemin) { if (Test-Path -LiteralPath $chemin) { [IO.File]::ReadAllText($chemin, $utf8) } else { '' } }
function Telecharger($adresse) {
  $r = Invoke-WebRequest -UseBasicParsing -Uri $adresse -TimeoutSec 20 -Headers @{ 'Cache-Control' = 'no-cache' }
  $flux = New-Object IO.MemoryStream; $r.RawContentStream.CopyTo($flux)
  $utf8.GetString($flux.ToArray())
}

try {
  # --- Garde-fou : jamais dans le dépôt de développement (il serait écrasé par la version publiée) ---
  $d = Get-Item -LiteralPath $racine
  while ($d) { if (Test-Path -LiteralPath (Join-Path $d.FullName '.git')) { Finir 'erreur' "Ce dossier fait partie d'un dépôt Git (développement) : la mise à jour automatique y est désactivée. Utilise git pull." }; $d = $d.Parent }

  # --- Ce qu'on a : version installée, identifiant de l'overlay, adresse du serveur ---
  $local = $null
  $texteVersion = LireTexte (Join-Path $racine 'version.json')
  if ($texteVersion) { try { $local = $texteVersion | ConvertFrom-Json } catch { $local = $null } }
  $config = LireTexte (Join-Path $racine 'config.js')
  $perso = LireTexte (Join-Path $racine 'mes-reglages.js')
  if (-not $config) { Finir 'erreur' "config.js introuvable dans $racine." }
  $id = if ($local -and $local.id) { $local.id } elseif ($config -match '(?m)^\s*id\s*:\s*"([^"]+)"') { $Matches[1] } else { '' }
  $motif = '(?s)miseAJour\s*:\s*\{[^}]*?adresse\s*:\s*"([^"]+)"'
  $adresse = if ($perso -match $motif) { $Matches[1] } elseif ($local -and $local.adresse) { $local.adresse } elseif ($config -match $motif) { $Matches[1] } else { '' }
  if (-not $id) { Finir 'erreur' "Identifiant de l'overlay (id) introuvable dans config.js." }
  if (-not $adresse) { Finir 'erreur' "Adresse du serveur inconnue (config.js › miseAJour.adresse)." }
  $adresse = $adresse.TrimEnd('/')
  $versionLocale = if ($local) { $local.version } else { '' }

  # --- Ce qu'il y a sur le serveur ---
  Dire "Overlay « $id » : recherche d'une mise à jour sur $adresse…"
  try { $distant = (Telecharger "$adresse/$id/version.json") | ConvertFrom-Json }
  catch { Finir 'erreur' "Serveur injoignable ($adresse) : $($_.Exception.Message)" }
  $resultat.version = $distant.version
  $resultat.date = ([DateTime]$distant.date).ToLocalTime().ToString('dd/MM/yyyy HH:mm')
  if ($versionLocale -and $versionLocale -eq $distant.version) { Finir 'a-jour' "L'overlay est à jour (version du $($resultat.date))." }
  if ($Mode -eq 'verifier') { Finir 'nouvelle' "Nouvelle version disponible : celle du $($resultat.date)." }

  # --- Télécharger et vérifier la nouvelle version ---
  $temp = Join-Path $env:TEMP "maj-overlay-$id"
  if (Test-Path -LiteralPath $temp) { Remove-Item -LiteralPath $temp -Recurse -Force }
  New-Item -ItemType Directory -Path $temp | Out-Null
  Dire "Téléchargement de la version du $($resultat.date)…"
  $zip = Join-Path $temp 'maj.zip'
  $lien = if ($distant.telechargement) { $distant.telechargement } else { "$adresse/$id/$id.zip" }
  Invoke-WebRequest -UseBasicParsing -Uri $lien -OutFile $zip -TimeoutSec 300
  Expand-Archive -LiteralPath $zip -DestinationPath (Join-Path $temp 'x') -Force
  $nouveau = Join-Path $temp "x\$id"
  $configNouveau = LireTexte (Join-Path $nouveau 'config.js')
  if (-not ($configNouveau -match '(?m)^\s*id\s*:\s*"([^"]+)"') -or $Matches[1] -ne $id) { Finir 'erreur' "Le fichier téléchargé n'est pas l'overlay « $id ». Rien n'a été modifié." }

  # --- Sauvegarder l'overlay actuel (les 3 dernières sauvegardes sont gardées) ---
  $sauvegardes = Join-Path $racine 'sauvegardes'
  $cible = Join-Path $sauvegardes (Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')
  Dire "Sauvegarde de la version actuelle dans sauvegardes\$(Split-Path -Leaf $cible)…"
  robocopy $racine $cible /E /XD $sauvegardes /R:1 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Null
  if ($LASTEXITCODE -ge 8) { Finir 'erreur' "La sauvegarde a échoué (robocopy $LASTEXITCODE) : rien n'a été modifié." }
  Get-ChildItem -LiteralPath $sauvegardes -Directory | Sort-Object Name -Descending | Select-Object -Skip 3 | Remove-Item -Recurse -Force

  # --- Installer : les fichiers de la nouvelle version remplacent les anciens ; mes-reglages.js n'est jamais touché ---
  Dire 'Installation…'
  robocopy $nouveau $racine /E /XF mes-reglages.js /R:2 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Null
  $code = $LASTEXITCODE
  Remove-Item -LiteralPath $temp -Recurse -Force -ErrorAction SilentlyContinue
  if ($code -ge 8) { Finir 'erreur' "Certains fichiers n'ont pas pu être remplacés : ils sont sans doute ouverts par OBS (souvent les vidéos de transition). Ferme OBS puis double-clique sur mettre-a-jour.cmd. Ton ancienne version est dans sauvegardes\$(Split-Path -Leaf $cible)." }
  Finir 'installee' "Mise à jour installée (version du $($resultat.date)). Tes réglages sont gardés. Dans OBS : actualise les sources (le script le fait tout seul)."
} catch {
  Finir 'erreur' "Mise à jour impossible : $($_.Exception.Message)"
}
