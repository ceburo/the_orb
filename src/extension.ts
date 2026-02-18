import * as vscode from 'vscode';
import { GameProvider } from './GameProvider';
import { GameController } from './GameController';

export function activate(context: vscode.ExtensionContext) {
	const provider = new GameProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(GameProvider.viewType, provider)
	);

	const controller = new GameController(context, provider);
	context.subscriptions.push(controller);

	context.subscriptions.push(
		vscode.commands.registerCommand('mia.addXp', () => {
			provider.addXp(10);
		}),
		vscode.commands.registerCommand('mia.reset', () => {
			controller.reset();
		})
	);
}

export function deactivate() { }
