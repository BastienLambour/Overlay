--[[ =====================================================================
  ACTUALISER LES SOURCES NAVIGATEUR ET PLACER LES WEBCAMS — script pour OBS (Outils › Scripts).

  Ce qu'il ajoute dans OBS :
    - un bouton « Actualiser toutes les sources Navigateur » (dans la fenêtre des scripts) ;
    - un raccourci clavier du même nom (Paramètres › Raccourcis clavier) ;
    - l'actualisation AUTOMATIQUE des sources de l'overlay quand config.js ou mes-reglages.js change
      (donc juste après « Enregistrer » dans reglages.html), si la case est cochée ;
    - un bouton « Mettre à jour l'overlay » (Windows) : télécharge la dernière version sur le serveur des
      overlays (outils/mettre-a-jour.ps1, sans bloquer OBS), garde tes réglages, puis actualise tout ;
    - deux boutons « Refaire les vidéos de transition » et « Refaire les images du kit Twitch » (Windows) :
      avec tes couleurs et tes textes (outils/refaire.ps1, sans bloquer OBS ; installe Node.js et ffmpeg
      s'ils manquent) ; les transitions Stinger de l'overlay sont rechargées toutes seules ;
    - un bouton « Placer les webcams » : dans chaque scène qui affiche une page de l'overlay
      (scenes/jeu.html, contenu.html…), la webcam est mise pile dans sa zone (js/zones.js +
      Options des scènes de reglages.html) ; ajoutée là où elle manque ; cachée si la scène est
      réglée « sans webcam ». Et la même chose TOUTE SEULE quand les réglages changent (case à cocher).
      La webcam = la source dont le nom contient « cam » (ex. « Webcam »), ou, à défaut, le seul
      périphérique de capture vidéo de la scène (sauf dans Jeu et Speedrun : une carte d'acquisition
      de console y est aussi un périphérique de capture, on ne la déplace pas).

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
local auto_cams = true      -- … et replacer les webcams
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

-- =====================================================================
-- Lire les réglages de l'overlay : config.js, mes-reglages.js, js/zones.js
-- Ce sont des objets JavaScript (window.CONFIG = { … }) : ce petit lecteur les transforme
-- en tables Lua (commentaires, clés sans guillemets, virgules finales acceptés).
-- =====================================================================
local function utf8_car(n)   -- é → é
  if n < 0x80 then return string.char(n) end
  if n < 0x800 then return string.char(0xC0 + math.floor(n / 64), 0x80 + n % 64) end
  return string.char(0xE0 + math.floor(n / 4096), 0x80 + math.floor(n / 64) % 64, 0x80 + n % 64)
end

local function lire_objet_js(texte, marque)
  if texte == nil then return nil end
  local debut = texte:find(marque)
  if debut == nil then return nil end
  local pos = texte:find("{", debut, true)
  if pos == nil then return nil end
  local function car(i) return texte:sub(i, i) end
  local function blancs()
    while pos <= #texte do
      local c, deux = car(pos), texte:sub(pos, pos + 1)
      if c:match("%s") then pos = pos + 1
      elseif deux == "//" then local f = texte:find("\n", pos, true); pos = f and f + 1 or #texte + 1
      elseif deux == "/*" then local f = texte:find("*/", pos + 2, true); pos = f and f + 2 or #texte + 1
      else return end
    end
  end
  local function chaine()
    local guillemet = car(pos); pos = pos + 1
    local morceaux = {}
    while pos <= #texte do
      local c = car(pos)
      if c == "\\" then
        local n = car(pos + 1)
        if n == "u" then morceaux[#morceaux + 1] = utf8_car(tonumber(texte:sub(pos + 2, pos + 5), 16) or 63); pos = pos + 6
        else morceaux[#morceaux + 1] = ({ n = "\n", t = "\t", r = "\r" })[n] or n; pos = pos + 2 end
      elseif c == guillemet then pos = pos + 1; return table.concat(morceaux)
      else morceaux[#morceaux + 1] = c; pos = pos + 1 end
    end
    error("texte entre guillemets non fermé")
  end
  local valeur
  local function suite(fin)   -- après un élément : « , » ou la fin
    blancs()
    local c = car(pos)
    if c == "," then pos = pos + 1 elseif c ~= fin then error("« , » ou « " .. fin .. " » attendu (caractère " .. pos .. ")") end
  end
  valeur = function()
    blancs()
    local c = car(pos)
    if c == "{" then
      pos = pos + 1
      local t = {}
      while true do
        blancs()
        if car(pos) == "}" then pos = pos + 1; return t end
        local cle
        if car(pos) == '"' or car(pos) == "'" or car(pos) == "`" then cle = chaine()
        else
          cle = texte:match("^[%w_%$]+", pos)
          if cle == nil then error("nom de réglage attendu (caractère " .. pos .. ")") end
          pos = pos + #cle
        end
        blancs()
        if car(pos) ~= ":" then error("« : » attendu (caractère " .. pos .. ")") end
        pos = pos + 1
        t[cle] = valeur()
        suite("}")
      end
    elseif c == "[" then
      pos = pos + 1
      local t = { liste = true }   -- (marque : c'est une liste, pas un objet)
      local n = 0
      while true do
        blancs()
        if car(pos) == "]" then pos = pos + 1; return t end
        n = n + 1
        t[n] = valeur()
        suite("]")
      end
    elseif c == '"' or c == "'" or c == "`" then return chaine()
    end
    local nombre = texte:match("^-?%.?%d[%d%.eE%+%-]*", pos)
    if nombre then pos = pos + #nombre; return tonumber(nombre) end
    local mot = texte:match("^[%a_%$][%w_%$]*", pos)
    if mot then
      pos = pos + #mot
      if mot == "true" then return true elseif mot == "false" then return false end
      return nil   -- null, undefined
    end
    error("valeur illisible (caractère " .. pos .. ")")
  end
  local ok, resultat = pcall(valeur)
  if ok then return resultat end
  obs.script_log(obs.LOG_WARNING, marque:gsub("%%", "") .. " illisible : " .. tostring(resultat))
  return nil
end

-- mes-reglages.js par-dessus config.js (objets fusionnés clé par clé, comme js/couleurs.js)
local function fusionner(cible, ajout)
  for k, v in pairs(ajout) do
    if type(v) == "table" and not v.liste and type(cible[k]) == "table" and not cible[k].liste then fusionner(cible[k], v)
    else cible[k] = v end
  end
  return cible
end

local function charger_reglages()
  local config = lire_objet_js(lire(dossier .. "/config.js"), "window%.CONFIG%s*=")
  local zones = lire_objet_js(lire(dossier .. "/js/zones.js"), "window%.ZONES%s*=")
  if config == nil or zones == nil or zones.cam == nil then return nil, nil end
  local perso = lire_objet_js(lire(dossier .. "/mes-reglages.js"), "window%.MES_REGLAGES%s*=")
  if perso ~= nil and (perso.id == nil or perso.id == config.id) then fusionner(config, perso) end
  return config, zones
end

-- La zone de la webcam d'une scène (même calcul que Options.cam dans js/options.js) ; nil = pas de webcam
-- valeur : l'option « cam » écrite dans l'adresse de la source, sinon celle des réglages
local function zone_cam(config, zones, scene, valeur)
  local z = zones.cam[scene]
  if z == nil then return nil end
  local v = valeur
  if v == nil then
    local o = config.options and config.options[scene]
    if type(o) == "table" then v = o.cam end
  end
  if v == false or v == 0 or v == "0" or v == "aucune" then return nil end
  if z.prereglages == nil then return { x = z.x, y = z.y, l = z.l, h = z.h } end
  local d = z.prereglages[z.defaut] or {}
  if type(v) == "string" and v:match("^%s*%-?%d") then
    local x, y, l, h = v:match("^%s*(%-?[%d%.]+)%s*,%s*(%-?[%d%.]+)%s*,?%s*([%d%.]*)%s*,?%s*([%d%.]*)")
    v = { x = tonumber(x), y = tonumber(y), l = tonumber(l), h = tonumber(h) }
  end
  if type(v) == "table" then
    local function n(k) local x = tonumber(v[k]); if x == nil then return d[k] end; return x end
    local l, h = n("l"), n("h")
    if l == nil or l <= 0 then l = d.l end
    if h == nil or h <= 0 then h = d.h end
    return { x = n("x"), y = n("y"), l = l, h = h }
  end
  local p = z.prereglages[v] or d
  return { x = p.x, y = p.y, l = p.l, h = p.h }
end

-- =====================================================================
-- Placer les webcams
-- =====================================================================
local CAPTURES = { dshow_input = true, av_capture_input = true, av_capture_input_v2 = true, v4l2_input = true,
  ["macos-avcapture"] = true, ["macos-avcapture-fast"] = true }
local caches_par_nous = {}   -- les webcams que ce script a cachées (pour ne réafficher que celles-là)

-- « nom » : son nom contient « cam » · « appareil » : un périphérique de capture vidéo · nil : autre chose
local function genre_webcam(source)
  local id = obs.obs_source_get_unversioned_id(source)
  if id == "browser_source" or id == "scene" or id == "group" then return nil end
  if (obs.obs_source_get_name(source) or ""):lower():find("cam", 1, true) then return "nom" end
  if CAPTURES[id] then return "appareil" end
  return nil
end

-- La page de l'overlay affichée par une source Navigateur : « jeu », « contenu »… (et l'option ?cam= de son adresse)
local function page_de(source)
  if obs.obs_source_get_unversioned_id(source) ~= "browser_source" then return nil end
  local r = obs.obs_source_get_settings(source)
  local chemin = obs.obs_data_get_bool(r, "is_local_file") and obs.obs_data_get_string(r, "local_file") or obs.obs_data_get_string(r, "url")
  obs.obs_data_release(r)
  chemin = comparable(chemin)
  local d = comparable(dossier)
  if d == "" or chemin:find(d .. "/scenes/", 1, true) == nil then return nil end
  local page = chemin:match("/scenes/([^/%?#]+)%.html")
  local cam = chemin:match("[%?&]cam=([^&#]*)")
  if cam then cam = cam:gsub("%%2c", ","):gsub("%%2C", ",") end
  return page, cam
end

-- Où est la page de l'overlay dans la scène, et à quelle échelle (1 en 1080p, 1,333 en 1440p…)
local function repere(item)
  local source = obs.obs_sceneitem_get_source(item)
  local largeur = obs.obs_source_get_width(source)
  if largeur == nil or largeur == 0 then largeur = 1920 end
  local pos = obs.vec2()
  obs.obs_sceneitem_get_pos(item, pos)
  local s
  if obs.obs_sceneitem_get_bounds_type(item) ~= obs.OBS_BOUNDS_NONE then
    local b = obs.vec2(); obs.obs_sceneitem_get_bounds(item, b); s = b.x / 1920
  else
    local e = obs.vec2(); obs.obs_sceneitem_get_scale(item, e); s = e.x * largeur / 1920
  end
  return { x = pos.x, y = pos.y, s = s }
end

-- Met la webcam pile dans la zone (comme « Ctrl+E » : mettre à l'échelle à l'extérieur, rogner)
local function poser(item, zone, base, groupe)
  local x, y, l, h = base.x + zone.x * base.s, base.y + zone.y * base.s, zone.l * base.s, zone.h * base.s
  if groupe ~= nil then   -- dans un groupe, les positions sont relatives au groupe
    local gp, ge = obs.vec2(), obs.vec2()
    obs.obs_sceneitem_get_pos(groupe, gp); obs.obs_sceneitem_get_scale(groupe, ge)
    local gx, gy = (ge.x ~= 0 and ge.x or 1), (ge.y ~= 0 and ge.y or 1)
    x, y, l, h = (x - gp.x) / gx, (y - gp.y) / gy, l / gx, h / gy
  end
  local pos, taille = obs.vec2(), obs.vec2()
  pos.x, pos.y, taille.x, taille.y = x, y, l, h
  obs.obs_sceneitem_set_rot(item, 0)
  obs.obs_sceneitem_set_alignment(item, 5)                         -- repère en haut à gauche
  obs.obs_sceneitem_set_bounds_type(item, obs.OBS_BOUNDS_SCALE_OUTER)
  obs.obs_sceneitem_set_bounds_alignment(item, 0)                  -- image centrée dans la zone
  obs.obs_sceneitem_set_bounds(item, taille)
  obs.obs_sceneitem_set_pos(item, pos)
  if obs.obs_sceneitem_set_bounds_crop ~= nil then obs.obs_sceneitem_set_bounds_crop(item, true) end   -- OBS 30.1 et plus : rogne ce qui dépasse
end

-- Les webcams d'une scène : { { item, groupe }, … } (aussi dans les groupes)
local function webcams_de(items, page)
  local par_nom, appareils = {}, {}
  local function voir(item, groupe)
    local g = genre_webcam(obs.obs_sceneitem_get_source(item))
    if g == "nom" then par_nom[#par_nom + 1] = { item = item, groupe = groupe }
    elseif g == "appareil" then appareils[#appareils + 1] = { item = item, groupe = groupe } end
  end
  local listes = {}
  for _, item in ipairs(items) do
    if obs.obs_sceneitem_is_group(item) then
      local enfants = obs.obs_sceneitem_group_enum_items(item)
      listes[#listes + 1] = enfants
      for _, enfant in ipairs(enfants or {}) do voir(enfant, item) end
    else voir(item, nil) end
  end
  local cams = par_nom
  if #cams == 0 and #appareils == 1 and page ~= "jeu" and page ~= "speedrun" then cams = appareils end
  return cams, listes
end

-- La webcam à ajouter dans les scènes où elle manque : la première source dont le nom contient « cam »
local function nom_de_la_webcam()
  local trouve, secours = nil, nil
  local sources = obs.obs_enum_sources()
  for _, source in ipairs(sources or {}) do
    local g = genre_webcam(source)
    if g == "nom" and trouve == nil then trouve = obs.obs_source_get_name(source) end
    if g == "appareil" and secours == nil then secours = obs.obs_source_get_name(source) end
  end
  obs.source_list_release(sources)
  return trouve or secours
end

-- Place la webcam dans toutes les scènes de l'overlay ; ajouter = l'ajouter là où elle manque
local function placer(ajouter)
  if dossier == "" then return 0 end
  local config, zones = charger_reglages()
  if config == nil then
    obs.script_log(obs.LOG_WARNING, "Placer les webcams : config.js ou js/zones.js introuvable dans " .. dossier)
    return 0
  end
  local nom_webcam = ajouter and nom_de_la_webcam() or nil
  local places, ajoutees, cachees = 0, 0, 0
  local scenes = obs.obs_frontend_get_scenes()
  for _, source_scene in ipairs(scenes or {}) do
    local nom_scene = obs.obs_source_get_name(source_scene)
    local scene = obs.obs_scene_from_source(source_scene)
    local items = obs.obs_scene_enum_items(scene)
    local overlay, page, cam_adresse, rang = nil, nil, nil, 0
    for i, item in ipairs(items or {}) do
      local p, c = page_de(obs.obs_sceneitem_get_source(item))
      if p ~= nil and zones.cam[p] ~= nil then overlay, page, cam_adresse, rang = item, p, c, i - 1 end
    end
    if overlay ~= nil then
      local zone = zone_cam(config, zones, page, cam_adresse)
      local cams, listes = webcams_de(items, page)
      if #cams == 0 and zone ~= nil and nom_webcam ~= nil then
        local source = obs.obs_get_source_by_name(nom_webcam)
        if source ~= nil then
          local item = obs.obs_scene_add(scene, source)
          obs.source_release(source)
          if item ~= nil then
            obs.obs_sceneitem_set_order_position(item, rang)       -- juste SOUS la page de l'overlay
            cams = { { item = item } }
            ajoutees = ajoutees + 1
          end
        end
      end
      local base = repere(overlay)
      for _, c in ipairs(cams) do
        local cle = nom_scene .. "|" .. obs.obs_source_get_name(obs.obs_sceneitem_get_source(c.item))
        if zone ~= nil then
          poser(c.item, zone, base, c.groupe)
          if caches_par_nous[cle] then obs.obs_sceneitem_set_visible(c.item, true); caches_par_nous[cle] = nil end
          places = places + 1
        elseif obs.obs_sceneitem_visible(c.item) then
          obs.obs_sceneitem_set_visible(c.item, false)              -- scène réglée « sans webcam »
          caches_par_nous[cle] = true
          cachees = cachees + 1
        end
      end
      for _, l in ipairs(listes) do obs.sceneitem_list_release(l) end
    end
    obs.sceneitem_list_release(items)
  end
  obs.source_list_release(scenes)
  obs.script_log(obs.LOG_INFO, string.format("Webcams : %d placée(s), %d ajoutée(s), %d cachée(s)", places, ajoutees, cachees))
  return places
end

-- =====================================================================
-- Mettre à jour l'overlay (Windows) : lance outils/mettre-a-jour.ps1 SANS bloquer OBS,
-- puis lit son résultat ; une fois installée : sources actualisées et webcams replacées.
-- Tes réglages (mes-reglages.js) ne sont jamais remplacés ; l'ancienne version va dans sauvegardes\.
-- =====================================================================
local maj = { fichier = nil, debut = 0, message = "" }

local function version_installee()
  local t = lire(dossier .. "/version.json")
  if t == nil then return nil end
  local v = t:match('"version"%s*:%s*"([^"]+)"')
  if v == nil then return nil end
  local a, m, j, h, mn = v:match("^(%d+)%-(%d+)%-(%d+)_(%d%d)(%d%d)")   -- 2026-10-02_1322-07d5bd0
  if a then return string.format("du %s/%s/%s à %s:%s", j, m, a, h, mn) end
  return v
end

local function suivre_maj()
  local texte = maj.fichier and lire(maj.fichier) or nil
  if texte == nil or not texte:find("message=", 1, true) then
    if os.time() - maj.debut > 900 then
      obs.timer_remove(suivre_maj)
      maj.fichier = nil
      maj.message = "La mise à jour ne répond pas : double-clique sur mettre-a-jour.cmd (dans le dossier de l'overlay)."
      obs.script_log(obs.LOG_WARNING, maj.message)
    end
    return
  end
  obs.timer_remove(suivre_maj)
  os.remove(maj.fichier)
  maj.fichier = nil
  local etat = texte:match("etat=([^\r\n]*)") or ""
  maj.message = texte:match("message=([^\r\n]*)") or ""
  obs.script_log(etat == "erreur" and obs.LOG_WARNING or obs.LOG_INFO, "Mise à jour : " .. maj.message)
  if etat == "installee" then
    actualiser(true)
    placer(false)
  end
end

local function mettre_a_jour()
  if package.config:sub(1, 1) ~= "\\" then
    maj.message = "Le bouton marche sous Windows : ailleurs, télécharge la nouvelle version sur la page des overlays."
    obs.script_log(obs.LOG_WARNING, maj.message)
    return
  end
  if maj.fichier ~= nil then return end   -- déjà en cours
  local ps1 = dossier .. "/outils/mettre-a-jour.ps1"
  if lire(ps1) == nil then
    maj.message = "outils/mettre-a-jour.ps1 introuvable dans " .. dossier
    obs.script_log(obs.LOG_WARNING, maj.message)
    return
  end
  maj.fichier = (os.getenv("TEMP") or dossier) .. "\\maj-overlay-" .. os.time() .. ".txt"
  maj.debut = os.time()
  maj.message = "Mise à jour en cours… (le résultat s'affiche ici et dans le journal des scripts)"
  local chemin = ps1:gsub("/", "\\")
  obs.script_log(obs.LOG_INFO, "Mise à jour : recherche d'une nouvelle version…")
  os.execute('start "" /min powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "' .. chemin
    .. '" -Mode installer -SansPause -Sortie "' .. maj.fichier .. '"')
  obs.timer_add(suivre_maj, 1000)
end

-- =====================================================================
-- Refaire les vidéos de transition / les images du kit Twitch (Windows) : lance outils/refaire.ps1
-- SANS bloquer OBS, avec tes couleurs et tes textes ; il installe Node.js et ffmpeg s'ils manquent
-- (au 2e clic, après avoir prévenu). Pendant les vidéos, les transitions Stinger de l'overlay sont
-- décrochées de leur fichier (Windows refuse de remplacer un fichier ouvert), puis raccrochées :
-- OBS recharge ainsi la nouvelle vidéo.
-- =====================================================================
local taches = {
  transitions = { nom = "Vidéos de transition", fichier = nil, debut = 0, message = "", manque = false, decroches = {} },
  kit = { nom = "Images du kit Twitch", fichier = nil, debut = 0, message = "", manque = false, decroches = {} },
}

-- Les transitions Stinger dont la vidéo est dans <overlay>/transitions/videos/
local function stingers(action)
  local d = comparable(dossier .. "/transitions/videos/")
  local liste = obs.obs_frontend_get_transitions()
  if liste == nil then return end
  for _, t in ipairs(liste) do
    if (obs.obs_source_get_unversioned_id(t) or obs.obs_source_get_id(t)) == "obs_stinger_transition" then
      local reglages = obs.obs_source_get_settings(t)
      action(t, obs.obs_source_get_name(t), reglages, comparable(obs.obs_data_get_string(reglages, "path")):find(d, 1, true) ~= nil)
      obs.obs_data_release(reglages)
    end
  end
  obs.source_list_release(liste)
end

local function decrocher_stingers()
  local decroches = {}
  stingers(function(t, nom, reglages, de_l_overlay)
    if not de_l_overlay then return end
    decroches[nom] = obs.obs_data_get_string(reglages, "path")
    obs.obs_data_set_string(reglages, "path", "")
    obs.obs_source_update(t, reglages)
  end)
  return decroches
end

local function raccrocher_stingers(decroches)
  local n = 0
  stingers(function(t, nom, reglages)
    if decroches[nom] == nil then return end
    obs.obs_data_set_string(reglages, "path", decroches[nom])
    obs.obs_source_update(t, reglages)
    n = n + 1
  end)
  if n > 0 then obs.script_log(obs.LOG_INFO, n .. " transition(s) Stinger rechargée(s)") end
end

local function suivre_tache(quoi)
  local t = taches[quoi]
  local texte = t.fichier and lire(t.fichier) or nil
  if texte == nil or not texte:find("message=", 1, true) then
    if os.time() - t.debut <= 2400 then return end   -- 40 minutes au plus (installation comprise)
    texte = "etat=erreur\nmessage=Pas de réponse au bout de 40 minutes : regarde le journal %TEMP%\\overlay-refaire-" .. quoi .. ".log\n"
  else
    os.remove(t.fichier)
  end
  obs.timer_remove(t.suivre)
  t.fichier = nil
  local etat = texte:match("etat=([^\r\n]*)") or ""
  t.message = texte:match("message=([^\r\n]*)") or ""
  t.manque = (etat == "manque")
  if quoi == "transitions" then raccrocher_stingers(t.decroches); t.decroches = {} end
  obs.script_log(etat == "erreur" and obs.LOG_WARNING or obs.LOG_INFO, t.message)
end
taches.transitions.suivre = function() suivre_tache("transitions") end
taches.kit.suivre = function() suivre_tache("kit") end

local function refaire(quoi)
  local t = taches[quoi]
  if package.config:sub(1, 1) ~= "\\" then
    t.message = "Le bouton marche sous Windows : ailleurs, lance node outils/" .. (quoi == "kit" and "exporter-chaine" or "generer-transitions") .. ".mjs"
    obs.script_log(obs.LOG_WARNING, t.message)
    return
  end
  if t.fichier ~= nil then return end   -- déjà en cours
  local ps1 = dossier .. "/outils/refaire.ps1"
  if lire(ps1) == nil then
    t.message = "outils/refaire.ps1 introuvable dans " .. dossier .. " (mets l'overlay à jour)"
    obs.script_log(obs.LOG_WARNING, t.message)
    return
  end
  local installer = t.manque
  t.manque = false
  t.fichier = (os.getenv("TEMP") or dossier) .. "\\refaire-" .. quoi .. "-" .. os.time() .. ".txt"
  t.debut = os.time()
  if quoi == "transitions" then t.decroches = decrocher_stingers() end
  t.message = t.nom .. " : en cours" .. (installer and " (installation de Node.js / ffmpeg d'abord, 2 à 5 minutes)" or "")
    .. (quoi == "transitions" and "… 1 à 2 minutes par vidéo ; en attendant, les transitions de l'overlay sont coupées." or "… 1 à 2 minutes.")
  obs.script_log(obs.LOG_INFO, t.message)
  os.execute('start "" /min powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "' .. ps1:gsub("/", "\\")
    .. '" -Quoi ' .. quoi .. (installer and " -Installer" or "") .. ' -Sortie "' .. t.fichier .. '"')
  obs.timer_add(t.suivre, 1000)
end

-- Toutes les 2 secondes : config.js ou mes-reglages.js (les réglages du streamer) ont-ils changé ?
local function surveiller()
  if (not auto and not auto_cams) or dossier == "" then return end
  local texte = lire(dossier .. "/config.js")
  if texte == nil then return end
  texte = texte .. "|" .. (lire(dossier .. "/mes-reglages.js") or "")
  if dernier ~= nil and texte ~= dernier then
    if auto then actualiser(true) end
    if auto_cams then placer(false) end
  end
  dernier = texte
end

-- ---------- Ce que OBS appelle ----------
function script_description()
  return [[<h3>Actualiser les sources et placer les webcams</h3>
<p>Un bouton et un raccourci clavier pour actualiser <b>toutes</b> les sources Navigateur d'un coup,
et l'actualisation automatique des sources de l'overlay quand <code>config.js</code> ou <code>mes-reglages.js</code> change
(après « Enregistrer » dans <code>reglages.html</code>).</p>
<p><b>Placer les webcams</b> : dans chaque scène qui affiche une page de l'overlay, la webcam est mise pile dans sa zone
(et ajoutée là où elle manque). Ta source webcam doit avoir « cam » dans son nom (ex. <b>Webcam</b>).</p>
<p><b>Mettre à jour l'overlay</b> : la dernière version, depuis le serveur des overlays. Tes réglages sont gardés.</p>
<p><b>Refaire les vidéos / les images</b> : après un changement de couleurs ou de textes, les transitions et le kit Twitch
sont refaits avec tes réglages (quelques minutes, OBS reste utilisable).</p>]]
end

function script_properties()
  local p = obs.obs_properties_create()
  obs.obs_properties_add_button(p, "tout", "Actualiser toutes les sources Navigateur", function()
    actualiser(false)
    return false
  end)
  obs.obs_properties_add_bool(p, "auto", "Actualiser tout seul les sources de l'overlay quand les réglages changent")
  obs.obs_properties_add_button(p, "cams", "Placer les webcams sur toutes les scènes (et les ajouter là où elles manquent)", function()
    placer(true)
    return false
  end)
  obs.obs_properties_add_bool(p, "auto_cams", "Replacer tout seul les webcams quand les réglages changent")
  obs.obs_properties_add_button(p, "maj", "Mettre à jour l'overlay (tes réglages sont gardés)", function()
    mettre_a_jour()
    return true   -- réaffiche l'état ci-dessous
  end)
  if obs.OBS_TEXT_INFO ~= nil then
    local v = version_installee()
    local texte = (v and ("Version installée : " .. v) or "Version installée : inconnue (pas de version.json)")
    if maj.message ~= "" then texte = texte .. "\n" .. maj.message end
    obs.obs_properties_add_text(p, "etat_maj", texte, obs.OBS_TEXT_INFO)
  end
  obs.obs_properties_add_button(p, "refaire_transitions", "Refaire les vidéos de transition (avec tes couleurs)", function()
    refaire("transitions")
    return true
  end)
  obs.obs_properties_add_button(p, "refaire_kit", "Refaire les images du kit Twitch (bannière, hors-ligne, panneaux, emotes, badges)", function()
    refaire("kit")
    return true
  end)
  if obs.OBS_TEXT_INFO ~= nil then
    local lignes = {}
    for _, quoi in ipairs({ "transitions", "kit" }) do
      local t = taches[quoi]
      if t.message ~= "" then table.insert(lignes, t.message) end
    end
    if #lignes > 0 then obs.obs_properties_add_text(p, "etat_refaire", table.concat(lignes, "\n"), obs.OBS_TEXT_INFO) end
  end
  obs.obs_properties_add_path(p, "dossier", "Dossier de l'overlay", obs.OBS_PATH_DIRECTORY, "", nil)
  return p
end

function script_defaults(reglages)
  obs.obs_data_set_default_bool(reglages, "auto", true)
  obs.obs_data_set_default_bool(reglages, "auto_cams", true)
  obs.obs_data_set_default_string(reglages, "dossier", dossier_du_script())
end

function script_update(reglages)
  auto = obs.obs_data_get_bool(reglages, "auto")
  auto_cams = obs.obs_data_get_bool(reglages, "auto_cams")
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
  for _, t in pairs(taches) do
    obs.timer_remove(t.suivre)
    if next(t.decroches) ~= nil then raccrocher_stingers(t.decroches); t.decroches = {} end
  end
end
