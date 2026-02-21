# Step 3: Create the Bridge via the `WebviewViewProvider`

A view doesn't display itself. A "provider" is needed on the TypeScript side to inject the HTML.

## The `src/GameProvider.ts` File
Create this file and start by importing the VS Code API:

```typescript
import * as vscode from 'vscode';

export class GameProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'orb.gameView'; // Must match package.json

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        // Crucial options for security and operation
        webviewView.webview.options = {
            enableScripts: true, // Disabled by default! Mandatory for our animations
            localResourceRoots: [this._extensionUri] // Restricts access to local files
        };

        // Inject the HTML
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head><title>The Orb</title></head>
            <body>
                <h1>XP: <span id="xp">0</span></h1>
                <div id="orb" style="width:50px; height:50px; background:purple; border-radius:50%"></div>
            </body>
            </html>`;
    }
}
```

### Why These Settings?
- **`enableScripts: true`**: By default, VS Code prohibits JavaScript execution in a Webview. *Why?* To prevent XSS attacks if you display external content. Since we control all our code, we explicitly enable it.
- **`localResourceRoots`**: Tells VS Code that this Webview is allowed to load images or scripts only from your extension's folder. This is an essential security barrier.

### The Life Cycle
- **`resolveWebviewView`** is the magic method. It's called by VS Code at the exact moment the user clicks your icon in the Activity Bar. This is where you should prepare your UI.
- **HTML as a string**: It's a bit confusing at first, but VS Code receives your interface as a long string. Pro tip: use template literals (the backticks `` ` ``) to code comfortably in multi-line HTML.

## Registering the Provider
The `GameProvider` doesn't exist until you have "registered" it in the VS Code registries.
In your `src/extension.ts` file (in the `activate` function):

```typescript
export function activate(context: vscode.ExtensionContext) {
    // 1. Instantiate the provider
    const provider = new GameProvider(context.extensionUri);

    // 2. Register the provider with VS Code
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(GameProvider.viewType, provider)
    );
}
```
*Why `subscriptions.push`?* This ensures that if your extension is disabled, VS Code will properly clean up the resources used by your provider to avoid memory leaks.

---
**Useful Resource:** [Webview View Sample (GitHub)](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample)

---
**Next step: [Link code to XP (04-game-logic.md)](04-game-logic.md)**

