# Étape 3 : Créer le pont via le `WebviewViewProvider` 🌉

Une vue ne s'affiche pas toute seule. Il faut un "fournisseur" (provider) côté TypeScript qui injecte le HTML.

## Le fichier `src/GameProvider.ts` 🛠️
Créez ce fichier et commencez par importer l'API VS Code :

```typescript
import * as vscode from 'vscode';

export class GameProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'orb.gameView'; // Doit matcher package.json

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        // Options cruciales pour la sécurité et le fonctionnement
        webviewView.webview.options = {
            enableScripts: true, // Désactivé par défaut ! Obligatoire pour nos animations
            localResourceRoots: [this._extensionUri] // Restreint l'accès aux fichiers locaux
        };

        // Injecter le HTML
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `
            <!DOCTYPE html>
            <html lang="fr">
            <head><title>The Orb</title></head>
            <body>
                <h1>XP: <span id="xp">0</span></h1>
                <div id="orb" style="width:50px; height:50px; background:purple; border-radius:50%"></div>
            </body>
            </html>`;
    }
}
```

### Pourquoi ces réglages ? 🧐
- **`enableScripts: true`** : Par défaut, VS Code interdit l'exécution de JavaScript dans une Webview. *Pourquoi ?* Pour éviter les attaques XSS si vous affichez du contenu externe. Comme on contrôle tout notre code, on l'active explicitement.
- **`localResourceRoots`** : Indique à VS Code que cette Webview est autorisée à charger des images ou des scripts uniquement depuis le dossier de votre extension. C'est une barrière de sécurité indispensable.

### Le Cycle de Vie 🧬
- **`resolveWebviewView`** est la méthode magique. Elle est appelée par VS Code au moment précis où l'utilisateur clique sur votre icône dans l'Activity Bar. C'est là que vous devez préparer votre UI.
- **Le HTML en string** : C'est un peu déroutant au début, mais VS Code reçoit votre interface sous forme d'une grosse chaîne de caractères. Astuce : utilisez les "Template Literals" (les backticks `` ` ``) pour coder confortablement en HTML multi-lignes.

## Enregistrer le fournisseur 🔌
Le `GameProvider` n'existe pas tant que vous ne l'avez pas "inscrit" dans les registres de VS Code.
Dans votre fichier `src/extension.ts` (dans la fonction `activate`) :

```typescript
export function activate(context: vscode.ExtensionContext) {
    // 1. Instancier le provider
    const provider = new GameProvider(context.extensionUri);

    // 2. Enregistrer le provider auprès de VS Code
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(GameProvider.viewType, provider)
    );
}
```
*Pourquoi `subscriptions.push` ?* Cela permet de s'assurer que si votre extension est désactivée, VS Code nettoiera proprement les ressources utilisées par votre provider pour éviter les fuites de mémoire.

---
**Ressource utile :** [Webview View Sample (GitHub)](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample)

---
**Étape suivante : [Lier le code à l'XP (04-game-logic.md)](04-game-logic.md)**

