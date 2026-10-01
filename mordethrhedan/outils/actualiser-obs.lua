--[[ =====================================================================
  ACTUALISER LES SOURCES NAVIGATEUR — script pour OBS (Outils › Scripts).

  Ce qu'il ajoute dans OBS :
    - un bouton « Actualiser toutes les sources Navigateur » (dans la fenêtre des scripts) ;
    - un raccourci clavier du même nom (Paramètres › Raccourcis clavier) ;
    - l'actualisation AUTOMATIQUE des sources de l'overlay quand config.js ou mes-reglages.js change
      (donc juste après « Enregistrer » dans reglages.html), si la case est cochée.

  Installation : OBS › Outils › Scripts › « + » › choisir ce fichier (outils/actualiser-obs.lua
  du dossier de l'overlay). Le dossier de l'overlay est trouvé tout seul.

  « Actualiser » vide aussi le cache de la page (comme « Actualiser le cache de la page actuelle »
  dans les propriétés de la source) : les images et styles modifiés sont bien rechargés.
  Attention : une page actualisée repart de zéro (un compte à rebours recommence).

  FICHIER COMMUN : identique dans tous les overlays (copie de _modele/outils/).
  ===================================================================== ]]
obs = obslua

local dossier = ""          -- dossier de l'overlay (celui qui contient config.js)
local auto = true           -- actualiser tout seul quand config.js ou mes-reglages.js change
local dernier = nil         -- contenu de config.js + mes-reglages.js au dernier coup d'œil
local touche = obs.OBS_INVALID_HOTKEY_ID

-- Chemins comparables : barres « / », minuscules, espaces tels qu'on les écrit dans une adresse
local function comparable(chemin)
  return (chemin or ""):gsub("\\", "/"):gsub("%%20", " "):lower()
end

-- Le dossier de l'overlay : celui au-dessus de outils/, où est rangé ce script
local function dossier_du_script()
  local d = (script_path() or ""):gsub("[/\\]+$", ""):gsub("[/\\]outils$", "")
  return d   -- (gsub renvoie aussi un nombre : on ne garde que le texte)
end

-- La source Navigateur affiche-t-elle une page de cet overlay ?
local function est_de_l_overlay(source)
  local d = comparable(dossier)
  if d == "" then return true end
  local reglages = obs.obs_source_get_settings(source)
  local fichier = comparable(obs.obs_data_get_string(reglages, "local_file"))
  local adresse = comparable(obs.obs_data_get_string(reglages, "url"))
  obs.obs_data_release(reglages)
  return fichier:find(d, 1, true) ~= nil or adresse:find(d, 1, true) ~= nil
end

-- Actualise les sources Navigateur (toutes, ou seulement celles de l'overlay) ; renvoie leur nombre
local function actualiser(seulement_overlay)
  local n = 0
  local sources = obs.obs_enum_sources()
  if sources ~= nil then
    for _, source in ipairs(sources) do
      if obs.obs_source_get_unversioned_id(source) == "browser_source" and (not seulement_overlay or est_de_l_overlay(source)) then
        local proprietes = obs.obs_source_properties(source)
        local bouton = obs.obs_properties_get(proprietes, "refreshnocache")
        if bouton ~= nil then
          obs.obs_property_button_clicked(bouton, source)
          n = n + 1
        end
        obs.obs_properties_destroy(proprietes)
      end
    end
  end
  obs.source_list_release(sources)
  obs.script_log(obs.LOG_INFO, n .. " source(s) Navigateur actualisée(s)")
  return n
end

local function lire(chemin)
  local f = io.open(chemin, "rb")
  if f == nil then return nil end
  local texte = f:read("*a")
  f:close()
  return texte
end

-- Toutes les 2 secondes : config.js ou mes-reglages.js (les réglages du streamer) ont-ils changé ?
local function surveiller()
  if not auto or dossier == "" then return end
  local texte = lire(dossier .. "/config.js")
  if texte == nil then return end
  texte = texte .. "|" .. (lire(dossier .. "/mes-reglages.js") or "")
  if dernier ~= nil and texte ~= dernier then actualiser(true) end
  dernier = texte
end

-- ---------- Ce que OBS appelle ----------
function script_description()
  return [[<h3>Actualiser les sources Navigateur</h3>
<p>Un bouton et un raccourci clavier pour actualiser <b>toutes</b> les sources Navigateur d'un coup,
et l'actualisation automatique des sources de l'overlay quand <code>config.js</code> ou <code>mes-reglages.js</code> change
(après « Enregistrer » dans <code>reglages.html</code>).</p>]]
end

function script_properties()
  local p = obs.obs_properties_create()
  obs.obs_properties_add_button(p, "tout", "Actualiser toutes les sources Navigateur", function()
    actualiser(false)
    return false
  end)
  obs.obs_properties_add_bool(p, "auto", "Actualiser tout seul les sources de l'overlay quand les réglages changent")
  obs.obs_properties_add_path(p, "dossier", "Dossier de l'overlay", obs.OBS_PATH_DIRECTORY, "", nil)
  return p
end

function script_defaults(reglages)
  obs.obs_data_set_default_bool(reglages, "auto", true)
  obs.obs_data_set_default_string(reglages, "dossier", dossier_du_script())
end

function script_update(reglages)
  auto = obs.obs_data_get_bool(reglages, "auto")
  dossier = obs.obs_data_get_string(reglages, "dossier"):gsub("[/\\]+$", "")
  dernier = nil
end

function script_load(reglages)
  touche = obs.obs_hotkey_register_frontend("actualiser_sources_navigateur", "Actualiser toutes les sources Navigateur", function(appuye)
    if appuye then actualiser(false) end
  end)
  local enregistre = obs.obs_data_get_array(reglages, "actualiser_sources_navigateur")
  obs.obs_hotkey_load(touche, enregistre)
  obs.obs_data_array_release(enregistre)
  obs.timer_add(surveiller, 2000)
end

function script_save(reglages)
  local enregistre = obs.obs_hotkey_save(touche)
  obs.obs_data_set_array(reglages, "actualiser_sources_navigateur", enregistre)
  obs.obs_data_array_release(enregistre)
end

function script_unload()
  obs.timer_remove(surveiller)
end
