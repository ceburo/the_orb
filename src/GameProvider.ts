import * as vscode from 'vscode';

export class GameProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'mia.gameView';

    private _view?: vscode.WebviewView;

    private _onDidSaveState = new vscode.EventEmitter<{ xp: number, level: number }>();
    public readonly onDidSaveState = this._onDidSaveState.event;

    private _onDidResolveWebview = new vscode.EventEmitter<void>();
    public readonly onDidResolveWebview = this._onDidResolveWebview.event;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,

            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'onInfo': {
                    if (data.value) vscode.window.showInformationMessage(data.value);
                    break;
                }
                case 'onError': {
                    if (data.value) vscode.window.showErrorMessage(data.value);
                    break;
                }
                case 'stateUpdate': {
                    this._onDidSaveState.fire({
                        xp: data.xp,
                        level: data.level
                    });
                    break;
                }
                case 'gameReady': {
                    this._onDidResolveWebview.fire();
                    break;
                }
                case 'reset': {
                    vscode.commands.executeCommand('mia.reset');
                    break;
                }
            }
        });
    }

    public addXp(amount: number) {
        if (this._view) {
            this._view.webview.postMessage({ type: 'addXp', amount: amount });
        }
    }

    public updateState(multiplier: number, orbCount: number, xp?: number, level?: number) {
        if (this._view) {
            this._view.webview.postMessage({
                type: 'updateState',
                multiplier: multiplier,
                orbCount: orbCount,
                xp: xp,
                level: level
            });
        }
    }

    public triggerMitosisEffect() {
        if (this._view) {
            this._view.webview.postMessage({ type: 'mitosisEffect' });
        }
    }

    public triggerShake() {
        if (this._view) {
            this._view.webview.postMessage({ type: 'shake' });
        }
    }

    public updateMultiplier(multiplier: number) {
        this.updateState(multiplier, 1);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'orb.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'orb.css'));

        const version = vscode.extensions.getExtension('NicolasBrouillet.mia')?.packageJSON.version || '0.0.0';

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleUri}" rel="stylesheet">
				<title>Mia Orb</title>
			</head>
			<body>
				<div class="container">
					<div class="stats">
						XP: <span id="xp-display">0</span>/<span id="next-level-xp-display">10</span> | Level: <span id="level-display">1</span>
					</div>
                    <div class="multiplier-container">
                        Multiplier: x<span id="multiplier-display">1.0</span>
                    </div>
					<div id="orb-container">
					</div>
					<div class="message" id="message-display">Type code to grow the orb!</div>
                    
                    <div class="settings-container">
                        <button id="settings-toggle" class="icon-button" title="Settings">⚙️</button>
                        <div id="settings-panel" class="settings-panel hidden">
                            <h3>Settings</h3>
                            <button id="reset-button" class="danger-button">Reset All Progress</button>
                        </div>
                    </div>

                    <div class="version-display">v${version}</div>
				</div>
				<script src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}
