# Step 8: Deployment and Sharing

It's the moment of truth! Your Orb is ready, it reacts to your code and saves your levels. All that's left is to turn it into a finished product.

## What is a `.vsix` file?
Behind this barbaric name hides a simple compressed file (similar to a `.zip`). It contains:
- Your **compiled JavaScript** files (often in a `dist/` folder).
- Your icons and multimedia files (`media/`).
- The `package.json` file that explains to VS Code how to launch all that.
*Why this format?* This is the universal format for the Microsoft Marketplace. It ensures that VS Code can unzip and install the extension properly without missing external dependencies.

## Packaging Step by Step

### 1. Install `vsce` (Visual Studio Code Extensions)
This is the essential tool for transforming your sources into an installable binary.
```bash
npm install -g @vscode/vsce
```

### 2. Why compile your code?
VS Code does not natively understand your TypeScript file (`.ts`).
*Why?* The VS Code engine (Electron) reads JavaScript. Your TypeScript files must therefore be "transpiled" into JavaScript before being packaged.
```bash
npm run compile
```
Make sure no `dist/` (or `out/`) folder is empty!

### 3. Create the final pack
Run this command at the root of your project:
```bash
vsce package
```
*Note: If vsce complains about the absence of README or license, it's time to fill them in!*

### 4. Share
You get a file named for example `my-awesome-orb-0.1.0.vsix`. You can send it by email, put it on GitHub, or even copy it to a USB key.

## How to install it without going through the Marketplace?
This is the ideal method for having your colleagues test your Orb before an official release. In VS Code:
1. Go to the **Extensions** tab (`Ctrl+Shift+X`).
2. Click on the **three little dots (...)** at the top right.
3. Choose **Install from VSIX...**
4. Select your file. And there you go! The Orb icon appears in the Activity Bar.

---

## Conclusion and Next Steps
Congratulations! You've just crossed the difficult step of creating a complex extension. You now master:
- **Architecture**: Decoupling between GameLogic and Extension API.
- **The View**: Integration of dynamic HTML5/CSS3 in a Webview.
- **Communication**: Real-time updates via `postMessage` and `onDidReceiveMessage`.
- **Events**: Real-time capture of developer activity.
- **Persistence**: Robust and synchronized saving via `globalState`.

**And next?** Why not add sounds? Or an online ranking? The VS Code API is huge and allows almost anything you can imagine.

Happy coding and long live your Orb! 🔮

---
**Complementary Resource:** [Publishing to the Marketplace (Documentation)](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

