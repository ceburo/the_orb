# Étape 2 : Déclarer la vue dans la barre latérale 🔮

Pour que votre Orb vive dans VS Code, il lui faut une "maison". Dans cet épisode, nous allons déclarer un **Activity Bar Container** (l'icône à gauche) et une **View** (le panneau qui s'ouvre).

## Pourquoi l'Activity Bar ? 🧭
VS Code propose plusieurs endroits pour vos vues : l'Explorateur (en dessous des fichiers), le Panel (en bas avec le terminal), ou l'**Activity Bar** (la barre verticale tout à gauche).
*Pourquoi l'Activity Bar ?* C'est l'emplacement premium pour les outils transversaux (Git, Extensions, Debug). Notre Orb étant un compagnon permanent, cet endroit est parfait pour qu'il soit accessible sans être masqué par l'arborescence de vos fichiers.

## Modification du `package.json`
Le fichier `package.json` n'est pas qu'un simple gestionnaire de dépendances. Pour VS Code, c'est le **Manifeste** qui déclare au démarrage ce que l'extension sait faire, sans même charger son code !

Remplacez le bloc `contributes` actuel par celui-ci :
```json
"contributes": {
  "viewsContainers": {
    "activitybar": [
      {
        "id": "orb-view-container",
        "title": "My Orb",
        "icon": "media/orb.svg"
      }
    ]
  },
  "views": {
    "orb-view-container": [
      {
        "type": "webview",
        "id": "orb.gameView",
        "name": "The Mystic Orb"
      }
    ]
  }
}
```

### Explication technique 🔎
- **`activitybar`** : Définit une nouvelle icône personnalisée.
- **`id`** : L'identifiant interne que VS Code utilisera pour relier vos différents éléments. Gardez-le cohérent !
- **`type: "webview"`** : VS Code propose deux types de vues :
    1. **`tree`** : Listes d'items pré-formatées (comme l'Explorateur de fichiers). Simple mais rigide.
    2. **`webview`** : Une page blanche totale. C'est ce qu'on choisit pour dessiner des entités complexes et animées.

## L'Icône `media/orb.svg` 🎨
Créez un dossier `media/` à la racine de votre projet et placez-y un fichier SVG.
*Pourquoi SVG ?* Parce que les SVG sont insensibles à la résolution et pèsent seulement quelques octets. C'est le format recommandé par VS Code pour ses icônes d'interface.

## Qu'est-ce qu'une Webview ? 🧊
Pensez à une **Webview** comme un environnement de navigation miniature et sécurisé dans VS Code.
- Vous utilisez **HTML5, CSS3, JavaScript ES6**.
- Vous avez votre propre context DOM.
- **Sécurité** : Par défaut, VS Code isole totalement la Webview. Elle ne peut pas accéder à vos fichiers locaux sans une autorisation explicite (nous verrons cela dans l'étape suivante).

---
**Ressource utile :** [Tree Views vs Webviews (Documentation)](https://code.visualstudio.com/api/extension-guides/webview)

---
**Étape suivante : [Créer le pont (03-webview-provider.md)](03-webview-provider.md)**

