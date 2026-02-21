# Step 6: Reflect Events on the Webview

We've successfully captured editor events in our controller, but our HTML view is still static. We need to create a **bridge** between the VS Code extension (the "Backend") and the Webview (the "Frontend").

## 1. Sending messages from the Extension
The VS Code API uses `postMessage()` to send data to a webview. Let's implement the `addXp` method in `src/GameProvider.ts`. This is the method we called in the previous step:

```typescript
export class GameProvider implements vscode.WebviewViewProvider {
    // We store a reference to the view when it's resolved
    private _view?: vscode.WebviewView;

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;
        // ... (previous setup code)
    }

    public addXp(amount: number) {
        if (this._view) {
            // This is how we send a "message" across the bridge
            this._view.webview.postMessage({ 
                type: 'addXp', 
                amount: amount 
            });
        }
    }
}
```

## 2. Receiving messages in the Webview
In your `media/orb.js` file (which is loaded by the HTML), you need to listen for the `message` event. We distinguish between **incremental events** (like `addXp`) and **state updates** (like `updateState`).

```javascript
// At the top of your script
const vscode = acquireVsCodeApi();

window.addEventListener('message', event => {
    const message = event.data;
    
    switch (message.type) {
        case 'addXp':
            // Incremental update for animations
            addXp(message.amount);
            break;
        case 'updateState':
            // Full sync of values (XP, Level, etc.)
            syncState(message);
            break;
    }
});

function syncState(data) {
    // Update all displays at once
    document.getElementById('xp').innerText = data.xp || 0;
    document.getElementById('level').innerText = data.level || 1;
    
    // You could also update a progress bar here
    const progress = (data.xp / data.nextLevelXp) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function addXp(amount) {
    // Existing incremental logic for pulses/sounds...
}
```

### State Synchronization vs Events
- **Events (`addXp`)**: Used for immediate visual feedback (pulses, particles) while the user is typing.
- **State (`updateState`)**: Used during initialization or after loading a save. It ensures the UI is a "Source of Truth" for the current progress. Try to call a full sync whenever the extension starts or the user switches projects.

### Why `postMessage`?
The extension and the webview live in **completely separate processes**. They cannot share variables directly.
- **Serialization**: Everything you send via `postMessage` is "serialized" (converted to a string, then back to an object). This means you can only send data that is valid JSON (no functions, no complex classes).
- **Asynchronous**: Sending a message doesn't wait for a response. It's a "fire and forget" mechanism.

## 3. Communication in the other direction
Just like the extension can talk to the webview, the webview can talk back! In your `media/orb.js`, you can send messages to the extension using `vscode.postMessage`:

```javascript
// In media/orb.js
vscode.postMessage({ 
    type: 'onInfo', 
    value: 'The Orb is growing!' 
});
```

And in `src/GameProvider.ts`, you listen for these messages in `resolveWebviewView`:
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
**Useful Resource:** [Webview Message Passing (Documentation)](https://code.visualstudio.com/api/extension-guides/webview#passing-messages-from-an-extension-to-a-webview)

---
**Next step: [Save the legacy (07-persistence.md)](07-persistence.md)**
