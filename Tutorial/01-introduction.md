# Tutoriel : Créer "The Orb" - Votre première extension VS Code

Bienvenue dans ce guide complet pour créer une extension VS Code inspirée de "The Orb". 🔮

## Pourquoi faire une extension VS Code ?
VS Code est l'éditeur le plus populaire aujourd'hui. Créer une extension vous permet de :
- Personnaliser votre propre workflow.
- Améliorer la productivité (ou le moral !) de vos collaborateurs.
- Apprendre les APIs puissantes de VS Code.

## Le Projet : "The Orb"
Le concept est simple : une entité visuelle (l'Orb) vit dans votre barre latérale. Elle gagne de l'expérience (XP) quand vous codez, monte de niveau, et peut même se diviser (Mitose) si vous commitez régulièrement votre code.

## Outils nécessaires 🛠️
Avant de commencer, assurez-vous d'avoir installé :
1. **[Node.js](https://nodejs.org/)** (version 18+ recommandée) : Le moteur qui fait tourner tout le système de développement des extensions.
2. **[Visual Studio Code](https://code.visualstudio.com/)** : Votre éditeur et environnement de test.
3. **Le générateur Yeoman** pour extensions :
   ```bash
   npm install -g yo generator-code
   ```

## Pourquoi TypeScript ? 🛡️
Le générateur vous proposera JavaScript ou TypeScript. **Choisissez TypeScript.**
*Pourquoi ?* VS Code est écrit en TypeScript. En l'utilisant, vous bénéficiez de l'autocomplétion (IntelliSense) sur l'API de VS Code. L'éditeur vous dira immédiatement si vous faites une erreur de nom de fonction ou de type de paramètre, ce qui est indispensable quand on découvre une nouvelle API.

## Initialisation du Projet
Ouvrez un terminal (celui de VS Code via `Ctrl+ù` ou `Ctrl+``) et lancez :
```bash
yo code
```
Suivez ces choix recommandés :
- **Type of extension**: `New Extension (TypeScript)`
- **Name**: `My Awesome Orb`
- **Identifier**: `my-awesome-orb` (utilisé dans le Marketplace)
- **Description**: `Une extension de gamification.`
- **Initialize git repository?**: `Yes` (pour sauvegarder vos étapes !)
- **Package manager**: `npm`

## Vérification du fonctionnement
Une fois le projet généré, ouvrez-le. Appuyez sur **F5**.
*Pourquoi ?* Cela lance un processus de compilation et ouvre une nouvelle fenêtre appelée **"Extension Development Host"**. C'est une instance séparée de VS Code où votre extension est active.

Testez-la immédiatement :
1. Dans la nouvelle fenêtre, ouvrez la palette de commandes (`Ctrl+Shift+P` ou `Cmd+Shift+P`).
2. Tapez `Hello World`.
3. Un message s'affiche en bas à droite. Votre lien avec VS Code est établi !

---
**Documentation officielle :** [VS Code Extension API](https://code.visualstudio.com/api)

---
**Étape suivante : [Déclarer la vue latérale (02-sidebar-view.md)](02-sidebar-view.md)**

