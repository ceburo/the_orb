Nous avons notre logique d'XP, mais comment relier le "clavier" à cette logique ?

## Pourquoi ne pas simplement utiliser "onKeyPress" ? ⌨️
Si vous avez l'habitude du développement Web, vous pourriez être tenté de chercher un événement de "frappe au clavier". Pourtant, dans VS Code, on privilégie **`onDidChangeTextDocument`**.
*Pourquoi ?*
1. **Précision** : Cet événement capte tout ce qui modifie le texte, même les copier-coller ou les modifications faites par des outils de formatage automatique.
2. **Accessibilité** : Il se moque de la méthode d'entrée (clavier, commande vocale, IA). Il ne s'intéresse qu'au résultat : le document a changé.

## Le Contrôleur d'Événements : `src/GameController.ts` 🛠️
C'est lui qui va faire l'arbitre entre l'éditeur (Workspace) et votre vue (Provider).

```typescript
import * as vscode from 'vscode';
import { GameLogic } from './GameLogic';
import { GameProvider } from './GameProvider';

export class GameController {
    constructor(private readonly _provider: GameProvider) {
        this._registerListeners();
    }

    private _registerListeners() {
        // ÉCOUTEUR PRINCIPAL : Changement dans n'importe quel document texte ouvert.
        vscode.workspace.onDidChangeTextDocument((event) => {
            // Pas de changement de contenu ? On ignore l'événement.
            if (event.contentChanges.length === 0) return;

            event.contentChanges.forEach(change => {
                const text = change.text.trim();
                // Si l'utilisateur n'a tapé que des espaces, on ignore.
                if (text.length === 0) return;

                // On récupère la ligne où le changement a eu lieu
                const line = event.document.lineAt(change.range.start.line).text.trim();

                // On vérifie que ce n'est pas un commentaire avec notre GameLogic
                if (GameLogic.isComment(line)) return;

                // On calcule le gain d'XP
                const xpGain = GameLogic.calculateXpGain(text.length);

                // On envoie l'XP à notre Vue Latérale
                this._provider.addXp(xpGain);
            });
        });
    }
}
```

### Explication technique 🔎
- **`contentChanges`** : Un tableau qui contient les détails de chaque modification. Si vous sélectionnez 10 lignes et que vous appuyez sur "Suppr", ce tableau contiendra les informations sur cette suppression.
- **`provider.addXp`** : C'est notre pont vers le HTML. Il va utiliser la méthode `postMessage()` de la webview. C'est l'équivalent d'un `console.log()` mais entre deux mondes différents (l'extension VS Code et votre page HTML).

## Enregistrer le Contrôleur 🔌
Dans votre fichier `src/extension.ts` (fonction `activate`) :
```typescript
const controller = new GameController(provider);
// Pas besoin de l'ajouter aux subscriptions si le controller ne change rien au système global.
```

---
**Ressource utile :** [Workspace API (Documentation)](https://code.visualstudio.com/api/references/vscode-api#workspace)

---
**Étape suivante : [Refléter sur la Webview (06-webview-communication.md)](06-webview-communication.md)**

