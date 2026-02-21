# Étape 7 : Sauvegarder l'héritage 💾

Imaginez atteindre le niveau 20 et tout perdre en fermant l'éditeur... Quelle frustration ! Heureusement, VS Code nous offre la **Persistence**.

## Pourquoi ne pas simplement créer un fichier "data.json" ? 📂
C'est la première pensée de beaucoup de développeurs.
*Pourquoi c'est une mauvaise idée dans une extension ?*
1. **Droit d'accès** : L'extension est installée dans des dossiers protégés du système (`.vscode/extensions`). Écrire dedans est risqué.
2. **Synchronisation** : Si l'utilisateur utilise VS Code sur deux machines différentes (via [Settings Sync](https://code.visualstudio.com/docs/editor/settings-sync)), son fichier local `data.json` ne sera pas synchronisé.
3. **Complexité** : Vous devez gérer les chemins, les erreurs de lecture, de parsing JSON... VS Code le fait pour vous via son API.

## Le `globalState` : Votre mini-base de données 🗄️
Le `globalState` de VS Code est un stockage clé-valeur sécurisé, déjà synchronisé et automatique.

### Charger les données au démarrage 🚀
Tout commence dans votre fonction `activate()` :
```typescript
// On demande à VS Code la valeur pour 'mia.xp'. Si elle n'existe pas, on met 0 par défaut.
const xp = context.globalState.get<number>('mia.xp', 0);
const level = context.globalState.get<number>('mia.level', 1);

// On envoie ces valeurs à notre fournisseur pour réveiller l'Orb
provider.updateState(xp, level);
```

### Sauvegarder les données 💾
La sauvegarde se fait généralement suite à un message provenant de la Webview :
```typescript
webviewView.webview.onDidReceiveMessage(data => {
    switch (data.type) {
        case 'saveState': {
            // Mise à jour magique. VS Code gère l'écriture sur le disque de façon asynchrone.
            context.globalState.update('mia.xp', data.xp);
            context.globalState.update('mia.level', data.level);
            break;
        }
    }
});
```

## Stratégie de Performance ⚡
**Attention !** Sauvegarder dans le `globalState` déclenche une écriture disque.
- Si vous sauvegardez à **chaque frappe de touche** (10 fois par seconde), vous pourriez ralentir l'ordinateur de l'utilisateur.
- **Règle d'or** : Mettez à jour visuellement dans la Webview immédiatement, mais échelonnez (throttle/debounce) la sauvegarde réelle à VS Code (toutes les quelques secondes).

## Différence clé : `globalState` vs `workspaceState` 🧠
- **`globalState`** : Vos levels sont les mêmes, peu importe le projet (idéal pour notre Orb).
- **`workspaceState`** : Vos données sont liées à un projet spécifique (utile pour des réglages de build, par exemple).

---
**Ressource utile :** [Data Storage API (Documentation)](https://code.visualstudio.com/api/extension-guides/state#global-state)

---
**Étape finale : [Lancer votre création (08-deployment.md)](08-deployment.md)**

