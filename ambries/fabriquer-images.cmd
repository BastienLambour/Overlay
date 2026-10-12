@echo off
rem Fabrique les images de l'overlay SANS OBS : le planning d'une semaine, les images du kit Twitch, les videos de transition.
rem Double-clique sur ce fichier. Le detail : outils\fabriquer.ps1 et TUTO, section 7.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0outils\fabriquer.ps1" %*
