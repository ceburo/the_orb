# Étape 6 : Refléter les Événements sur la Webview 🔮

Nous avons capturé les événements de l'éditeur dans notre contrôleur, mais notre vue HTML est encore statique. Nous devons créer un **pont** entre l'extension VS Code (le "Backend") et la Webview (le "Frontend").

## 1. Envoyer des messages depuis l'Extension 📤
L'API VS Code utilise `postMessage()` pour envoyer des données à une webview. Implémentons la méthode `addXp` dans `src/GameProvider.ts`. C'est la méthode que nous avons appelée à l'étape précédente :

```typescript
export class GameProvider implements vscode.WebviewViewProvider {
    // On conserve une référence à la vue une fois résolue
    private _view?: vscode.WebviewView;

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        // ... (code de configuration précédent)
    }

    public addXp(amount: number) {
        if (this._view) {
            // C'est ainsi que nous envoyons un "message" à travers le pont
            this._view.webview.postMessage({ 
                type: 'addXp', 
                amount: amount 
            });
        }
    }
}
```

## 2. Recevoir des messages dans la Webview 📥
Dans votre fichier `media/orb.js`, vous devez écouter l'événement `message`. Nous distinguons les **mises à jour incrémentales** (comme `addXp`) et la **synchronisation d'état** (comme `updateState`).

```javascript
// Au sommet de votre script
const vscode = acquireVsCodeApi();

window.addEventListener('message', event => {
    const message = event.data;
    
    switch (message.type) {
        case 'addXp':
            // Mise à jour immédiate pour l'animation
            addXp(message.amount);
            break;
        case 'updateState':
            // Synchronisation complète des valeurs (XP, Niveau, etc.)
            syncState(message);
            break;
    }
});

function syncState(data) {
    // Met à jour tous les affichages d'un coup
    document.getElementById('xp').innerText = data.xp || 0;
    document.getElementById('level').innerText = data.level || 1;
    
    // Mise à jour d'une barre de progression par exemple
    const progress = (data.xp / data.nextLevelXp) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function addXp(amount) {
    // Logique incrémentale existante...
}
```

### Synchronisation d'État vs Événements 🤔
- **Événements (`addXp`)** : Utilisés pour un retour visuel immédiat (pulsations, particules) pendant que l'utilisateur tape.
- **État (`updateState`)** : Utilisé lors de l'initialisation ou après le chargement d'une sauvegarde. Cela garantit que l'interface reflète toujours la réalité mathématique du jeu.

### Pourquoi `postMessage` ? 🤔
L'extension et la webview vivent dans des **processus complètement séparés**. Elles ne peuvent pas partager de variables directement.
- **Sérialisation** : Tout ce que vous envoyez via `postMessage` est "sérialisé" (converti en chaîne, puis reconstitué en objet). Cela signifie que vous ne pouvez envoyer que des données JSON valides (pas de fonctions, no complex classes).
- **Asynchrone** : L'envoi d'un message n'attend pas de réponse. C'est un mécanisme de type "tire et oublie".

## 3. Communication dans l'autre sens ↔️
Tout comme l'extension peut parler à la webview, la webview peut répondre ! Dans votre `media/orb.js`, vous pouvez envoyer des messages à l'extension en utilisant `vscode.postMessage` :

```javascript
// Dans media/orb.js
vscode.postMessage({ 
    type: 'onInfo', 
    value: 'L\'Orbe grandit !' 
});
```

And in `src/GameProvider.ts`, you listen for these messages in `resolveWebviewView` :
```typescript
webviewView.webview.onDidReceiveMessage(data => {
    switch (data.type) {
        case 'onInfo':
            vscode.window.showInformationMessage(data.value);
            break;
    }
});
```

---
**Ressource utile :** [Passage de messages Webview (Documentation)](https://code.visualstudio.com/api/extension-guides/webview#passing-messages-from-an-extension-to-a-webview)

---
**Étape suivante : [Sauvegarder l'héritage (07-persistence.md)](07-persistence.md)**
