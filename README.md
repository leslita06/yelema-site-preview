# Site Yelema — Structure multi-fichiers

## Ce qui a changé

Le site n'est plus un fichier HTML unique de 25 Mo tout-en-un : il est maintenant éclaté comme un site web classique, avec chaque type de ressource dans son propre dossier.

## Structure du projet

```
index.html              → la page (toutes les vues du site : accueil, experts, offres, etc.)
css/
  style.css              → toutes les feuilles de style (56 Ko)
js/
  app.js                 → la logique JS (navigation, accordéons FAQ, etc.)
fonts/
  space-grotesk-*.woff2   → police des titres (3 graisses)
  funnel-display-*.woff2  → police des textes (3 graisses)
images/
  experts/                → photos des 12 experts (format long + carré)
  logos/                  → logos clients + icônes d'outils (WhatsApp, Excel, etc.)
  icons/                  → icônes diverses
  patterns/                → motifs décoratifs SVG
videos/
  video-*.mp4             → 12 vidéos de présentation des experts (~700 Ko à 1 Mo chacune)
favicon.svg              → icône d'onglet du navigateur
```

**Taille totale : ~11 Mo** (contre 25 Mo pour l'ancien fichier unique) grâce à :
- Déduplication des vidéos (chaque vidéo apparaissait 2x dans l'ancien fichier — catalogue + accueil — n'existe qu'une fois maintenant)
- Déduplication des icônes réutilisées
- Compression naturelle : les fichiers binaires (images, vidéos, polices) ne sont plus gonflés de +33% par l'encodage base64

## Hébergement

Comme avant, aucune configuration serveur particulière n'est nécessaire — c'est un site 100% statique. La seule différence : il faut maintenant uploader **le dossier complet**, pas juste un fichier.

### Netlify (recommandé, le plus simple)
1. Aller sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. Glisser-déposer le **dossier entier** (celui qui contient `index.html`, `css/`, `js/`, etc.)
3. Le site est en ligne immédiatement

### Vercel
1. Créer un compte sur [vercel.com](https://vercel.com)
2. `New Project` → glisser le dossier complet

### GitHub Pages
1. Créer un repository, y pousser tout le contenu du dossier (en conservant la structure des sous-dossiers)
2. Activer Pages dans Settings → Pages → branche `main`

⚠️ **Important** : les chemins dans le HTML sont relatifs (`css/style.css`, `images/experts/av-kouassi.jpg`, etc.) — il faut donc que la structure de dossiers soit préservée telle quelle sur l'hébergeur. Ne pas renommer ou déplacer les sous-dossiers.

## Avantages de cette structure

- **Cache navigateur efficace** : un visiteur qui revient sur le site ne re-télécharge que le HTML modifié, pas les vidéos/images/polices déjà en cache
- **Chargement progressif** : la page peut s'afficher avant que toutes les vidéos soient chargées (contrairement au fichier unique où tout devait être téléchargé d'un bloc)
- **Fichiers modifiables individuellement** : pour changer une photo ou une vidéo, il suffit de remplacer le fichier correspondant, pas de re-générer tout le HTML
- **Poids réduit** : ~11 Mo au lieu de ~25 Mo (voir déduplication ci-dessus)

## Vérifications effectuées

- ✅ Tous les fichiers (91 ressources) correctement extraits et référencés
- ✅ Aucune donnée encodée en base64 résiduelle dans le HTML, CSS ou JS
- ✅ Rendu testé avec un vrai moteur Chromium : aucune erreur console, toutes les pages (Accueil, Experts, Comment ça marche) s'affichent correctement
- ✅ Support des requêtes HTTP Range confirmé pour le streaming vidéo (fonctionne avec n'importe quel hébergeur statique standard)
- ✅ Polices chargées et appliquées correctement
