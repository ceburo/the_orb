import * as assert from 'assert';
import * as vscode from 'vscode';
import { GameController } from '../GameController';
import { GameProvider } from '../GameProvider';

suite('GameController Test Suite', () => {
    let controller: GameController;
    let mockContext: any;
    let mockProvider: any;
    let globalStateMap = new Map<string, any>();

    setup(() => {
        globalStateMap.clear();

        mockContext = {
            subscriptions: [],
            globalState: {
                get: (key: string, defaultValue: any) => {
                    const val = globalStateMap.get(key);
                    return val !== undefined ? val : defaultValue;
                },
                update: (key: string, value: any) => {
                    globalStateMap.set(key, value);
                    return Promise.resolve();
                }
            }
        };

        mockProvider = {
            onDidSaveState: () => ({ dispose: () => { } }),
            onDidResolveWebview: () => ({ dispose: () => { } }),
            updateState: () => { },
            addXp: () => { }
        };

        controller = new GameController(mockContext as vscode.ExtensionContext, mockProvider as GameProvider);
    });

    test('reset clears global state and initializes', async () => {
        globalStateMap.set('mia.xp', 500);
        globalStateMap.set('mia.level', 10);
        globalStateMap.set('mia.multiplier', 2.0);
        globalStateMap.set('mia.orbCount', 5);

        await controller.reset(false);

        assert.strictEqual(globalStateMap.get('mia.xp'), 0);
        assert.strictEqual(globalStateMap.get('mia.level'), 1);
        assert.strictEqual(globalStateMap.get('mia.multiplier'), 1);
        assert.strictEqual(globalStateMap.get('mia.orbCount'), 1);
    });

    test('dispose should clear all internal disposables', () => {
        controller.dispose();
    });
});
