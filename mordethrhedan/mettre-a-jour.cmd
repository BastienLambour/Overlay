@echo off
rem Met l'overlay a jour depuis le serveur, en gardant tes reglages (mes-reglages.js).
rem Double-clique sur ce fichier. Le detail : outils\mettre-a-jour.ps1 et TUTO, section 2.1.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0outils\mettre-a-jour.ps1" %*
