# Step 5: Listen to Keypresses 

We have our XP logic, but how do we link the "keyboard" to this logic?

## Why not just use "onKeyPress"? 
If you're used to Web development, you might be tempted to look for a "keyboard strike" event. However, in VS Code, we prefer **`onDidChangeTextDocument`**.
*Why?*
1. **Precision**: This event captures everything that modifies the text, even copy-pastes or changes made by automatic formatting tools.
2. **Accessibility**: It doesn't care about the input method (keyboard, voice command, AI). It's only interested in the result: the document has changed.

## The Event Controller: `src/GameController.ts`
It's the one that will act as the arbiter between the editor (Workspace) and your view (Provider).

```typescript
import * as vscode from 'vscode';
import { GameLogic } from './GameLogic';
import { GameProvider } from './GameProvider';

export class GameController {
    constructor(private readonly _provider: GameProvider) {
        this._registerListeners();
    }

    private _registerListeners() {
        // MAIN LISTENER: Change in any open text document.
        vscode.workspace.onDidChangeTextDocument((event) => {
            // No content change? Ignore the event.
            if (event.contentChanges.length === 0) return;

            event.contentChanges.forEach(change => {
                const text = change.text.trim();
                // If the user only typed spaces, ignore.
                if (text.length === 0) return;

                // We get the line where the change took place
                const line = event.document.lineAt(change.range.start.line).text.trim();

                // We check that it's not a comment with our GameLogic
                if (GameLogic.isComment(line)) return;

                // We calculate the XP gain
                const xpGain = GameLogic.calculateXpGain(text.length);

                // We send the XP to our Sidebar View
                this._provider.addXp(xpGain);
            });
        });
    }
}
```

### Technical Explanation
- **`contentChanges`**: An array containing the details of each modification. If you select 10 lines and press "Delete", this array will contain information about that deletion.
- **`provider.addXp`**: This is our bridge to HTML. It will use the webview's `postMessage()` method. It's the equivalent of a `console.log()` but between two different worlds (the VS Code extension and your HTML page).

## Registering the Controller
In your `src/extension.ts` file (function `activate`):
```typescript
const controller = new GameController(provider);
// No need to add it to subscriptions if the controller doesn't change anything in the global system.
```

---
**Useful Resource:** [Workspace API (Documentation)](https://code.visualstudio.com/api/references/vscode-api#workspace)

---
**Next step: [Reflect on the Webview (06-webview-communication.md)](06-webview-communication.md)**

