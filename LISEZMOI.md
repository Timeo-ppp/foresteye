# ForestEye : version installable

Ce dossier `site/` est la version de ForestEye à publier sur internet (GitHub Pages, gratuit) pour l'installer sur un téléphone. Installée, l'application fonctionne sans réseau, et le GPS, la boussole, l'inclinomètre et la caméra deviennent utilisables (ils sont bloqués quand on ouvre le fichier en double-clic ou dans un aperçu).

Contenu :

| Fichier | Rôle |
|---|---|
| `index.html` | l'application, copie exacte de `ForestEye.html` |
| `sw.js` | le « service worker » : garde l'application et ses ressources en mémoire pour le mode hors ligne |
| `manifest.webmanifest` | nom, langue, icônes : ce qui rend l'application installable |
| `icon-192.png`, `icon-512.png` | icônes, dessinées par `outils/icones.mjs` sans ressource externe |

## Avant chaque publication : reconstruire le paquet

Depuis le dossier du projet (il faut Node.js, gratuit) :

```
node outils/construire-site.mjs
```

Le script copie `ForestEye.html` dans `site/index.html` et augmente de 1 le numéro de version du cache dans `sw.js`. C'est ce numéro qui fait que les téléphones déjà installés récupèrent la nouvelle version : ne publiez jamais un `index.html` modifié sans `sw.js` reconstruit.

## Publier sur GitHub Pages en 5 étapes

1. **Créer un compte GitHub** (gratuit) sur github.com, puis un dépôt **public**, par exemple `foresteye` (bouton « New repository »).
2. **Reconstruire le paquet** : `node outils/construire-site.mjs` (voir ci-dessus).
3. **Déposer les fichiers** : dans le dépôt, « Add file » puis « Upload files », glisser **le contenu** du dossier `site/` (les 6 fichiers, pas le dossier lui-même), puis « Commit changes ».
4. **Activer Pages** : « Settings » puis « Pages » ; dans « Build and deployment », choisir « Deploy from a branch », branche `main`, dossier `/ (root)`, puis « Save ».
5. **Ouvrir l'adresse** affichée après une à deux minutes, de la forme `https://votre-compte.github.io/foresteye/`. L'ouvrir une première fois avec du réseau.

Pour une mise à jour : refaire les étapes 2 et 3 (remplacer `index.html` et `sw.js`, au minimum). Sur les téléphones, la nouvelle version s'installe au lancement suivant avec du réseau ; fermer puis rouvrir l'application pour la voir.

## Installer sur le téléphone

**Android (Chrome)** : ouvrir l'adresse, puis menu « ⋮ » et « Installer l'application » (ou « Ajouter à l'écran d'accueil »). L'icône ForestEye apparaît avec les autres applications.

**iPhone (Safari obligatoirement)** : ouvrir l'adresse dans Safari, toucher le bouton « Partager » (carré avec une flèche), puis « Sur l'écran d'accueil » et « Ajouter ».

Au premier usage des capteurs, le téléphone demande l'autorisation pour la position, l'orientation (iPhone) et la caméra : répondre « Autoriser ».

## Vérifier le mode hors ligne (avant de partir en forêt)

1. Avec du réseau, ouvrir l'application installée et passer une fois par chaque onglet (la carte et les polices se mettent en mémoire).
2. Dans 1 · Préparer, délimiter la forêt puis toucher « Carte hors ligne » : les fonds de carte IGN et le cadastre autour de la forêt sont enregistrés.
3. Pour l'export Excel hors ligne, faire un export Excel une fois avec du réseau.
4. Passer le téléphone en mode avion, fermer complètement l'application puis la rouvrir depuis l'écran d'accueil : elle doit s'ouvrir avec le projet en cours, et la carte de la forêt doit s'afficher.
5. Toujours en mode avion, tester le GPS (le GPS n'a pas besoin du réseau) : 2 · Mesurer, « Relever la position ».

Ce qui demande toujours du réseau : la recherche de parcelle cadastrale, la recherche de commune et la liste en direct des forêts publiques. Tout le reste (saisie, calculs, résultats, exports CSV et projet) fonctionne sans réseau.

Les données restent dans le téléphone (stockage du navigateur). Pensez à « Sauvegarder le projet » (fichier .json) à la fin de chaque sortie.
