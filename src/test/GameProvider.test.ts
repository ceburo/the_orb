import * as assert from 'assert';
import * as vscode from 'vscode';
import { GameProvider } from '../GameProvider';

suite('GameProvider Test Suite', () => {
    let provider: GameProvider;
    let mockWebview: any;
    let mockWebviewView: any;

    setup(() => {
        const mockExtensionUri = vscode.Uri.file('/mock/path');
        provider = new GameProvider(mockExtensionUri);

        mockWebview = {
            postMessage: (msg: any) => {
                mockWebview.lastMessage = msg;
                return Promise.resolve(true);
            },
            asWebviewUri: (uri: vscode.Uri) => uri,
            onDidReceiveMessage: () => ({ dispose: () => { } }),
            options: {}
        };

        mockWebviewView = {
            webview: mockWebview,
            onDidDispose: () => ({ dispose: () => { } }),
            visible: true
        };

        (provider as any)._view = mockWebviewView;
    });

    test('addXp sends correct message', () => {
        provider.addXp(15);
        assert.deepStrictEqual(mockWebview.lastMessage, { type: 'addXp', amount: 15 });
    });

    test('updateState sends correct message (full)', () => {
        provider.updateState(2.5, 3, 100, 5);
        assert.deepStrictEqual(mockWebview.lastMessage, {
            type: 'updateState',
            multiplier: 2.5,
            orbCount: 3,
            xp: 100,
            level: 5
        });
    });

    test('updateState sends correct message (partial)', () => {
        provider.updateState(1.2, 1);
        assert.deepStrictEqual(mockWebview.lastMessage, {
            type: 'updateState',
            multiplier: 1.2,
            orbCount: 1,
            xp: undefined,
            level: undefined
        });
    });

    test('triggerMitosisEffect sends correct message', () => {
        provider.triggerMitosisEffect();
        assert.deepStrictEqual(mockWebview.lastMessage, { type: 'mitosisEffect' });
    });
});
