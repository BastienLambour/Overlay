<# =====================================================================
   FABRIQUER LES IMAGES — sans OBS : le planning de la semaine, les images du kit Twitch,
   les vidéos de transition. Lancé par un double-clic sur fabriquer-images.cmd (dossier de l'overlay).

   - Si reglages.html a laissé une demande (outils/demande.txt : bouton « Fabriquer l'image du
     planning » quand OBS n'est pas ouvert), il la traite tout de suite et répond à la page
     (outils/demande-resultat.txt) : la page affiche l'image.
   - Sinon, un petit menu : 1 planning d'une semaine, 2 images du kit, 3 vidéos de transition.
   Le travail est fait par outils/refaire.ps1 (le même que les boutons du script OBS) ; s'il manque
   Node.js (ou ffmpeg pour les vidéos), il propose de l'installer.

   FICHIER COMMUN : identique dans tous les overlays (copie de _modele/outils/).
   Enregistré en UTF-8 AVEC BOM : sinon Windows PowerShell 5.1 lit mal les accents.
   ===================================================================== #>
$ErrorActionPreference = 'Stop'
$racine = Split-Path -Parent $PSScriptRoot
$outils = Join-Path $racine 'outils'
$refaire = Join-Path $outils 'refaire.ps1'
$demande = Join-Path $outils 'demande.txt'
$reponse = Join-Path $outils 'demande-resultat.txt'
$utf8 = New-Object System.Text.UTF8Encoding $false

# La semaine d'une date, au format « 2027-W08 » (semaine ISO : du lundi au dimanche, la 1re contient le 4 janvier)
function SemaineDe([DateTime] $d) {
  $jeudi = $d.Date.AddDays(3 - (([int]$d.DayOfWeek + 6) % 7))
  '{0}-W{1:00}' -f $jeudi.Year, ([math]::Floor(($jeudi.DayOfYear - 1) / 7) + 1)
}

# Lance refaire.ps1 ; s'il manque un outil, propose de l'installer puis relance. Renvoie @{ etat; message }
function Refaire([string] $quoi, [string] $semaine = '') {
  $installer = $false
  while ($true) {
    $sortie = Join-Path $env:TEMP "fabriquer-$quoi-$PID.txt"
    $arguments = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $refaire, '-Quoi', $quoi, '-Sortie', $sortie)
    if ($semaine) { $arguments += @('-Semaine', $semaine) }
    if ($installer) { $arguments += '-Installer' }
    Write-Host '  En cours… (quelques secondes pour le planning, 1 à 2 minutes pour le kit, plus pour les vidéos)'
    & powershell @arguments | Out-Null
    $texte = if (Test-Path -LiteralPath $sortie) { [IO.File]::ReadAllText($sortie, $utf8) } else { "etat=erreur`nmessage=Pas de réponse de refaire.ps1.`n" }
    Remove-Item -LiteralPath $sortie -ErrorAction SilentlyContinue
    $r = @{ etat = ''; message = ''; texte = $texte }
    if ($texte -match '(?m)^etat=(.*)$') { $r.etat = $Matches[1].Trim() }
    if ($texte -match '(?m)^message=(.*)$') { $r.message = $Matches[1].Trim() }
    if ($r.etat -ne 'manque' -or $installer) { return $r }
    Write-Host ''
    Write-Host "  $($r.message)" -ForegroundColor Yellow
    if ((Read-Host '  Les installer maintenant ? (O/N)') -notmatch '^[oOyY]') { return $r }
    $installer = $true
  }
}

function Montrer($r) {
  Write-Host ''
  Write-Host "  $($r.message)" -ForegroundColor $(if ($r.etat -eq 'fini') { 'Green' } else { 'Red' })
}

try {
  Write-Host ''
  Write-Host "  Fabriquer les images de l'overlay ($(Split-Path -Leaf $racine))" -ForegroundColor Cyan
  if (-not (Test-Path -LiteralPath $refaire)) { throw "outils\refaire.ps1 introuvable : mets l'overlay à jour." }

  # --- Une demande de reglages.html en attente ? On la traite et on répond à la page ---
  if (Test-Path -LiteralPath $demande) {
    $texte = [IO.File]::ReadAllText($demande, $utf8)
    Remove-Item -LiteralPath $demande
    if ($texte -match 'quoi=planning' -and $texte -match 'semaine=(\d{4}-W\d{1,2})') {
      $semaine = $Matches[1]
      Write-Host "  Demande de reglages.html : le planning de la semaine $([int]$semaine.Split('W')[1])."
      $r = Refaire 'planning' $semaine
      [IO.File]::WriteAllText($reponse, "etat=$($r.etat)`nmessage=$($r.message)`n", $utf8)
      Montrer $r
      if ($r.etat -eq 'fini') { Write-Host '  La page des réglages l''affiche aussi.' }
      Write-Host ''; Read-Host '  Appuie sur Entrée pour fermer' | Out-Null
      exit 0
    }
  }

  # --- Sinon : le menu ---
  Write-Host ''
  Write-Host '   1  Le planning d''une semaine (panneau de bio, d''après reglages.html › Kit › Planning)'
  Write-Host '   2  Les images du kit Twitch (bannière, hors-ligne, panneaux, emotes, badges, page de dons)'
  Write-Host '   3  Les vidéos de transition (avec tes couleurs)'
  Write-Host ''
  $choix = Read-Host '  Ton choix (1, 2 ou 3)'
  switch ($choix.Trim()) {
    '1' {
      $cette = SemaineDe (Get-Date)
      Write-Host "  Cette semaine : $cette. La semaine prochaine : $(SemaineDe (Get-Date).AddDays(7))."
      $saisie = (Read-Host '  Quelle semaine ? (Entrée = cette semaine, ou un numéro : 8, ou 2027-W08)').Trim()
      $semaine = if (-not $saisie) { $cette }
        elseif ($saisie -match '^\d{1,2}$') { '{0}-W{1:00}' -f $cette.Substring(0, 4), [int]$saisie }
        elseif ($saisie -match '^\d{4}-?[wWsS]?\d{1,2}$') { $saisie -replace '^(\d{4})-?[wWsS]?(\d{1,2})$', '$1-W$2' }
        else { throw "Semaine illisible : $saisie" }
      $r = Refaire 'planning' $semaine
      Montrer $r
      if ($r.etat -eq 'fini') { Start-Process (Join-Path $racine (($r.message -split ' : ')[-1])) }
    }
    '2' { $r = Refaire 'kit'; Montrer $r }
    '3' { $r = Refaire 'transitions'; Montrer $r; if ($r.etat -eq 'fini') { Write-Host '  Dans OBS, les transitions rechargent leur vidéo au prochain démarrage (ou : propriétés de la transition › OK).' } }
    default { Write-Host '  Rien fait.' }
  }
} catch {
  Write-Host ''
  Write-Host "  Erreur : $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ''
Read-Host '  Appuie sur Entrée pour fermer' | Out-Null
