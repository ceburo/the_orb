# Mia - The Orb Publication Guide

This guide helps you prepare and publish your extension on the Visual Studio Marketplace.

## 1. Prerequisites

Ensure you have the `vsce` (Visual Studio Code Extensions) tool installed:

```bash
npm install -g @vscode/vsce
```

## 2. `package.json` Configuration

Before publishing, check and update the following fields in `package.json`:

1.  **publisher**: Replace `"your-publisher-name"` with your VS Code publisher ID (see section 4).
2.  **repository**: Update the URL with the link to your actual Git repository.
3.  **icon**: Ensure you have an `icon.png` image (minimum 128x128 pixels, PNG format) in the `media/` folder.

## 3. Adding an Icon

The Marketplace requires an icon.
Create or add an image named `icon.png` in the `media/` folder.

## 4. Create a Publisher Account

If you haven't already:
1.  Go to [management.azure.com](https://management.azure.com) to create a Personal Access Token (PAT).
2.  Go to the [Marketplace Management Portal](https://marketplace.visualstudio.com/manage).
3.  Create a new publisher and note its ID.

## 5. Packaging

To create the `.vsix` file (the extension installer):

```bash
vsce package
```

This will generate a `mia-0.1.1.vsix` file in the root directory. You can test this file by manually installing it in VS Code using the "Install from VSIX..." command.

## 6. Publication

Once ready, publish the extension:

```bash
vsce publish
```

If not logged in:
```bash
vsce login <your-publisher-id>
```

## 7. Verification

After a few minutes, your extension will be available on the Marketplace!

---

**Note**: Don't forget to update the `CHANGELOG.md` file with each new version.
