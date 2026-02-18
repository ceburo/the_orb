import * as vscode from 'vscode';
import { GameProvider } from './GameProvider';
import { GameLogic } from './GameLogic';

export class GameController implements vscode.Disposable {
    private static readonly MAX_XP_PER_EVENT = 5;

    private readonly _disposables: vscode.Disposable[] = [];
    private readonly _provider: GameProvider;
    private readonly _context: vscode.ExtensionContext;
    private readonly _boundRepos = new Set<string>();

    constructor(context: vscode.ExtensionContext, provider: GameProvider) {
        this._context = context;
        this._provider = provider;

        this._registerTextListener();
        this._registerGitListener();
        this._initializeState();

        this._disposables.push(
            this._provider.onDidSaveState(state => {
                console.log(`Mia: Saving State -> XP: ${state.xp}, Level: ${state.level}`);
                this._context.globalState.update('mia.xp', state.xp);
                this._context.globalState.update('mia.level', state.level);
            }),
            this._provider.onDidResolveWebview(() => {
                this._initializeState();
            })
        );
    }

    public dispose() {
        this._disposables.forEach(d => d.dispose());
    }

    private _initializeState() {
        const storedMultiplier = this._context.globalState.get<number>('mia.multiplier', 1);
        let currentMultiplier = typeof storedMultiplier === 'number' ? storedMultiplier : Number(storedMultiplier) || 1;
        currentMultiplier = Math.round(currentMultiplier * 10) / 10;

        const storedOrbCount = this._context.globalState.get<number>('mia.orbCount', 1);
        const orbCount = typeof storedOrbCount === 'number' ? storedOrbCount : Number(storedOrbCount) || 1;

        const storedXp = this._context.globalState.get<number>('mia.xp', 0);
        const xp = Math.max(0, typeof storedXp === 'number' ? storedXp : Number(storedXp) || 0);

        const storedLevel = this._context.globalState.get<number>('mia.level', 1);
        const level = Math.max(1, typeof storedLevel === 'number' ? storedLevel : Number(storedLevel) || 1);

        console.log(`Mia: Initializing State -> XP: ${xp}, Level: ${level}, Multiplier: ${currentMultiplier}, Orbs: ${orbCount}`);

        this._provider.updateState(currentMultiplier, orbCount, xp, level);
    }

    private _registerTextListener() {
        this._disposables.push(
            vscode.workspace.onDidChangeTextDocument((event) => this._onTextChange(event))
        );
    }

    private _onTextChange(event: vscode.TextDocumentChangeEvent) {
        if (event.contentChanges.length === 0) return;

        console.debug(`Mia: Processing ${event.contentChanges.length} changes`);

        const document = event.document;
        event.contentChanges.forEach(change => {
            const text = change.text.trim();
            if (text.length === 0) return;

            const line = document.lineAt(change.range.start.line);
            const lineText = line.text.trim();

            if (this._isComment(lineText)) return;

            const xpGain = GameLogic.calculateXpGain(text.length);
            this._provider.addXp(xpGain);
        });
    }

    private _isComment(line: string): boolean {
        return GameLogic.isComment(line);
    }

    private async _registerGitListener() {
        try {
            const gitExtension = vscode.extensions.getExtension('vscode.git');
            if (!gitExtension) return;

            if (!gitExtension.isActive) {
                await gitExtension.activate();
            }

            const git = gitExtension.exports.getAPI(1);
            if (!git) return;

            if (git.state === 'initialized') {
                this._bindGitRepos(git.repositories);
            } else {
                const stateDisposable = git.onDidChangeState((state: any) => {
                    if (state === 'initialized') {
                        this._bindGitRepos(git.repositories);
                        stateDisposable.dispose();
                    }
                });
                this._disposables.push(stateDisposable);
            }

            this._disposables.push(
                git.onDidOpenRepository((repo: any) => this._bindSingleRepo(repo))
            );
        } catch (error) {
            console.warn('Mia: Failed to initialize Git events', error);
        }
    }

    private _bindGitRepos(repositories: any[]) {
        repositories.forEach(repo => this._bindSingleRepo(repo));
    }

    private _bindSingleRepo(repo: any) {
        const repoPath = repo.rootUri.fsPath;
        if (this._boundRepos.has(repoPath)) {
            console.log(`Mia: Repo ${repoPath} already bound, skipping.`);
            return;
        }

        this._boundRepos.add(repoPath);

        let lastHead = repo.state.HEAD?.commit;
        console.log(`Mia: Binding to repo ${repoPath}, initial HEAD: ${lastHead}`);

        const disposable = repo.state.onDidChange(() => {
            const currentHead = repo.state.HEAD?.commit;

            if (currentHead && currentHead !== lastHead) {
                if (lastHead) {
                    console.log(`Mia: Commit detected in ${repoPath}!`);
                    this._handleCommit();
                }
                lastHead = currentHead;
            }
        });

        this._disposables.push(disposable);
    }

    private _handleCommit() {
        const storedMultiplier = this._context.globalState.get<number>('mia.multiplier', 1);
        let multiplier = typeof storedMultiplier === 'number' ? storedMultiplier : Number(storedMultiplier) || 1;

        const storedOrbCount = this._context.globalState.get<number>('mia.orbCount', 1);
        let orbCount = typeof storedOrbCount === 'number' ? storedOrbCount : Number(storedOrbCount) || 1;

        const storedXp = this._context.globalState.get<number>('mia.xp', 0);
        const xp = typeof storedXp === 'number' ? storedXp : Number(storedXp) || 0;

        console.log(`Mia: Commit Detected -> Current Multiplier: ${multiplier}, XP: ${xp}, Orbs: ${orbCount}`);

        if (GameLogic.shouldTriggerMitosis(multiplier)) {
            this._triggerMitosis();
        } else {
            multiplier = GameLogic.incrementMultiplier(multiplier);

            console.log(`Mia: New Multiplier -> ${multiplier}`);

            this._context.globalState.update('mia.multiplier', multiplier);
            this._provider.updateState(multiplier, orbCount);

            vscode.window.setStatusBarMessage(`Mia: Multiplier increased to x${multiplier.toFixed(1)}! 🚀`, 5000);
        }
    }

    private _triggerMitosis() {
        const newMultiplier = 1;

        const storedOrbCount = this._context.globalState.get<number>('mia.orbCount', 1);
        const orbCount = typeof storedOrbCount === 'number' ? storedOrbCount : Number(storedOrbCount) || 1;
        const newOrbCount = orbCount * 2;

        console.log(`Mia: Triggering Mitosis! Old Orbs: ${orbCount}, New Orbs: ${newOrbCount}`);

        const newXp = 0;

        this._context.globalState.update('mia.multiplier', newMultiplier);
        this._context.globalState.update('mia.orbCount', newOrbCount);
        this._context.globalState.update('mia.xp', newXp);

        const storedLevel = this._context.globalState.get<number>('mia.level', 1);
        const level = typeof storedLevel === 'number' ? storedLevel : Number(storedLevel) || 1;

        this._provider.updateState(newMultiplier, newOrbCount, newXp, level);
        this._provider.triggerMitosisEffect();

        vscode.window.showInformationMessage(`🧬 MITOSIS! Your orb has split! You now have ${newOrbCount} orbs gathering XP! Multiplier reset to x1.0.`);
    }

    public async reset(confirm: boolean = true) {
        let result: string | undefined = 'Reset Progress';
        if (confirm) {
            result = await vscode.window.showWarningMessage(
                'Are you sure you want to reset all progress for Mia - The Orb?',
                { modal: true },
                'Reset Progress'
            );
        }

        if (result === 'Reset Progress') {
            console.log('Mia: Resetting progress...');
            this._context.globalState.update('mia.xp', 0);
            this._context.globalState.update('mia.level', 1);
            this._context.globalState.update('mia.multiplier', 1);
            this._context.globalState.update('mia.orbCount', 1);

            this._initializeState();
            vscode.window.showInformationMessage('Mia: Your progress has been reset.');
        }
    }
}
