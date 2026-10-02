// =====================================================================
//  OVERLAY – COMPTEURS : le code de l'action Streamer.bot qui donne à l'overlay les VRAIS nombres de la
//  chaîne (followers et abonnés) pour la barre d'objectif. À copier-coller UNE fois dans Streamer.bot :
//  TUTO, section 6 (« L'objectif ») : Actions › clic droit › Add › nom : Overlay – Compteurs ›
//  Sub-Actions › clic droit › Core › C# › Execute C# Code › coller ce fichier › Compile › Save and Compile.
//  Puis un déclencheur toutes les 5 minutes (Settings › Timed Actions). L'overlay la lance aussi tout seul
//  quand une page se branche à Streamer.bot (par son nom : garde exactement « Overlay – Compteurs »).
//
//  Il demande à Twitch (avec le compte déjà connecté dans Streamer.bot) :
//    - le nombre total de followers (Get Channel Followers → « total ») ;
//    - le nombre d'abonnés (Get Broadcaster Subscriptions → « total ») — 0 si la chaîne n'est pas affiliée ;
//  puis l'envoie à toutes les pages de l'overlay : { "overlay": "compteurs", "followers": …, "abonnes": … }.
//  Rien n'est modifié sur Twitch : il ne fait que lire.
//
//  FICHIER COMMUN : identique dans tous les overlays (copie de _modele/outils/).
// =====================================================================
using System;
using System.Net;
using System.Text;
using Newtonsoft.Json.Linq;

public class CPHInline
{
    public bool Execute()
    {
        try
        {
            string chaine = CPH.TwitchGetBroadcaster().UserId;
            int? followers = Total("https://api.twitch.tv/helix/channels/followers?first=1&broadcaster_id=" + chaine);
            int? abonnes = Total("https://api.twitch.tv/helix/subscriptions?first=1&broadcaster_id=" + chaine);

            var message = new JObject { ["overlay"] = "compteurs" };
            if (followers.HasValue) message["followers"] = followers.Value;
            if (abonnes.HasValue) message["abonnes"] = abonnes.Value;
            string texte = message.ToString(Newtonsoft.Json.Formatting.None);
            CPH.WebsocketBroadcastJson(texte);
            CPH.LogInfo("[Overlay] Compteurs envoyés : " + texte);
            return true;
        }
        catch (Exception e)
        {
            CPH.LogWarn("[Overlay] Compteurs impossibles : " + e.Message);
            return false;
        }
    }

    // Le « total » d'une liste Twitch (null si Twitch refuse, ex. pas d'abonnés possibles sur cette chaîne)
    private int? Total(string adresse)
    {
        try
        {
            using (var client = new WebClient())
            {
                client.Encoding = Encoding.UTF8;
                client.Headers.Add("Client-Id", CPH.TwitchClientId);
                client.Headers.Add("Authorization", "Bearer " + CPH.TwitchOAuthToken);
                return (int)JObject.Parse(client.DownloadString(adresse))["total"];
            }
        }
        catch (Exception e)
        {
            CPH.LogWarn("[Overlay] Twitch refuse " + adresse + " : " + e.Message);
            return null;
        }
    }
}
