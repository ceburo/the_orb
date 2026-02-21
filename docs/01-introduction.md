# Tutorial: Create "The Orb" - Your First VS Code Extension

Welcome to this comprehensive guide to creating a VS Code extension inspired by "The Orb". 🔮

## Why make a VS Code extension?
VS Code is the most popular editor today. Creating an extension allows you to:
- Customize your own workflow.
- Improve the productivity (or morale!) of your collaborators.
- Learn powerful VS Code APIs.

## The Project: "The Orb"
The concept is simple: a visual entity (the Orb) lives in your sidebar. It gains experience (XP) when you code, levels up, and can even divide (Mitosis) if you commit your code regularly.

## Necessary Tools 🛠️
Before starting, make sure you have installed:
1. **[Node.js](https://nodejs.org/)** (version 18+ recommended): The engine that runs the entire extension development system.
2. **[Visual Studio Code](https://code.visualstudio.com/)**: Your editor and test environment.
3. **The Yeoman generator** for extensions:
   ```bash
   npm install -g yo generator-code
   ```

## Why TypeScript?
The generator will offer you JavaScript or TypeScript. **Choose TypeScript.**
*Why?* VS Code is written in TypeScript. By using it, you benefit from autocompletion (IntelliSense) on the VS Code API. The editor will tell you immediately if you make a function name or parameter type error, which is essential when discovering a new API.

## Project Initialization
Open a terminal (the VS Code one via `Ctrl+scroll` or `Ctrl+``) and run:
```bash
yo code
```
Follow these recommended choices:
- **Type of extension**: `New Extension (TypeScript)`
- **Name**: `My Awesome Orb`
- **Identifier**: `my-awesome-orb` (used in the Marketplace)
- **Description**: `A gamification extension.`
- **Initialize git repository?**: `Yes` (to save your steps!)
- **Package manager**: `npm`

## Checking functionality
Once the project is generated, open it. Press **F5**.
*Why?* This starts a compilation process and opens a new window called **"Extension Development Host"**. It's a separate instance of VS Code where your extension is active.

Test it immediately:
1. In the new window, open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2. Type `Hello World`.
3. A message appears at the bottom right. Your link with VS Code is established!

---
**Official Documentation:** [VS Code Extension API](https://code.visualstudio.com/api)

---
**Next step: [Declare the sidebar view (02-sidebar-view.md)](02-sidebar-view.md)**

