import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Commands should be registered', async () => {
		const extension = vscode.extensions.getExtension('NicolasBrouillet.mia');
		await extension?.activate();

		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('mia.addXp'), 'mia.addXp command not registered');
		assert.ok(commands.includes('mia.reset'), 'mia.reset command not registered');
	});
});
