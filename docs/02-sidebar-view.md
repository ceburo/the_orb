# Step 2: Declare the View in the Sidebar

For your Orb to live in VS Code, it needs a "home". In this episode, we will declare an **Activity Bar Container** (the icon on the left) and a **View** (the panel that opens).

## Why the Activity Bar?
VS Code offers several places for your views: the Explorer (under files), the Panel (at the bottom with the terminal), or the **Activity Bar** (the vertical bar on the far left).
*Why the Activity Bar?* It's the premium location for cross-cutting tools (Git, Extensions, Debug). Since our Orb is a permanent companion, this location is perfect for it to be accessible without being hidden by your file tree.

## Modifying `package.json`
The `package.json` file is not just a simple dependency manager. For VS Code, it's the **Manifest** that declares at startup what the extension knows how to do, without even loading its code!

Replace the current `contributes` block with this one:
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

### Technical Explanation
- **`activitybar`**: Defines a new custom icon.
- **`id`**: The internal identifier that VS Code will use to link your different elements. Keep it consistent!
- **`type: "webview"`**: VS Code offers two types of views:
    1. **`tree`**: Pre-formatted item lists (like the File Explorer). Simple but rigid.
    2. **`webview`**: A complete blank page. This is what we choose to draw complex and animated entities.

## The `media/orb.svg` Icon
Create a `media/` folder at the root of your project and place an SVG file there.
*Why SVG?* Because SVGs are resolution-independent and weigh only a few bytes. It's the format recommended by VS Code for its interface icons.

## What is a Webview?
Think of a **Webview** as a miniature and secure browsing environment within VS Code.
- You use **HTML5, CSS3, JavaScript ES6**.
- You have your own DOM context.
- **Security**: By default, VS Code totally isolates the Webview. It cannot access your local files without explicit permission (we'll see this in the next step).

---
**Useful Resource:** [Tree Views vs Webviews (Documentation)](https://code.visualstudio.com/api/extension-guides/webview)

---
**Next step: [Create the bridge (03-webview-provider.md)](03-webview-provider.md)**

