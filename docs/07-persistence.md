# Step 7: Save the Legacy

Imagine reaching level 20 and losing everything by closing the editor... How frustrating! Fortunately, VS Code offers us **Persistence**.

## Why not just create a "data.json" file?
It's much the first thought of many developers.
*Why is it a bad idea in an extension?*
1. **Access rights**: Extensions are installed in protected system folders (`.vscode/extensions`). Writing to them is risky.
2. **Synchronization**: If the user uses VS Code on two different machines (via [Settings Sync](https://code.visualstudio.com/docs/editor/settings-sync)), their local `data.json` file will not be synchronized.
3. **Complexity**: You have to manage paths, JSON reading and parsing errors... VS Code does it for you via its API.

## `globalState`: Your mini-database
VS Code's `globalState` is a secure key-value store, already synchronized and automatic.

### Loading data at startup
It all starts in your `activate()` function:
```typescript
// We ask VS Code for the value for 'mia.xp'. If it doesn't exist, we set it to 0 by default.
const xp = context.globalState.get<number>('mia.xp', 0);
const level = context.globalState.get<number>('mia.level', 1);

// We send these values to our provider to wake up the Orb
provider.updateState(xp, level);
```

### Saving data
Saving is usually done following a message coming from the Webview:
```typescript
webviewView.webview.onDidReceiveMessage(data => {
    switch (data.type) {
        case 'saveState': {
            // Magic update. VS Code handles writing to disk asynchronously.
            context.globalState.update('mia.xp', data.xp);
            context.globalState.update('mia.level', data.level);
            break;
        }
    }
});
```

## Performance Strategy
**Warning!** Saving in `globalState` triggers a disk write.
- If you save with **each key stroke** (10 times per second), you could slow down the user's computer.
- **Golden rule**: Update visually in the Webview immediately, but stagger (throttle/debounce) the actual saving to VS Code (every few seconds).

## Key Difference: `globalState` vs `workspaceState`
- **`globalState`**: Your levels are the same, regardless of the project (ideal for our Orb).
- **`workspaceState`**: Your data is linked to a specific project (useful for build settings, for example).

---
**Useful Resource:** [Data Storage API (Documentation)](https://code.visualstudio.com/api/extension-guides/state#global-state)

---
**Final step: [Launch your creation (08-deployment.md)](08-deployment.md)**

