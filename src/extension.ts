import * as vscode from 'vscode';
import { Ollama } from 'ollama';

let panel: vscode.WebviewPanel | undefined = undefined;

// Initialize Ollama client
const ollama = new Ollama({
    host: 'http://localhost:11434'  // default Ollama host
});

export function activate(context: vscode.ExtensionContext) {
    console.log('DeepSeek extension is active!');
    
    let disposable = vscode.commands.registerCommand('vscode-deepseek-daddy.chatbaby', async () => {
        try {
            // Check if Ollama is running
            await ollama.list();
        } catch (error) {
            vscode.window.showErrorMessage('Could not connect to Ollama. Please make sure it is running on your system.');
            return;
        }

        if (panel) {
            panel.reveal(vscode.ViewColumn.One);
            return;
        }

        panel = vscode.window.createWebviewPanel(
            'deepseekChat',
            'DeepSeek Chat',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = getWebViewContent();

        panel.webview.onDidReceiveMessage(async (message: any) => {
            try {
                if (message.command === 'chat' && panel) {
                    const response = await ollama.chat({
                        model: 'deepseek-r1:latest',
                        messages: [{ role: 'user', content: message.text }],
                        stream: true
                    });

                    let textResponse = '';
                    for await (const chunk of response) {
                        if (chunk.message?.content) {
                            textResponse += chunk.message.content;
                            if (panel) {
                                panel.webview.postMessage({
                                    command: 'response',
                                    text: textResponse
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                vscode.window.showErrorMessage(`Error: ${errorMessage}`);
                if (panel) {
                    panel.webview.postMessage({
                        command: 'response',
                        text: `Error: ${errorMessage}`
                    });
                }
            }
        });

        panel.onDidDispose(() => {
            panel = undefined;
        }, null, context.subscriptions);
    });

    context.subscriptions.push(disposable);
}

function getWebViewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DeepSeek Chat</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    padding: 20px;
                    color: var(--vscode-editor-foreground);
                    background-color: var(--vscode-editor-background);
                }
                #prompt {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 10px;
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border: 1px solid var(--vscode-input-border);
                }
                #response {
                    padding: 10px;
                    margin-top: 10px;
                    white-space: pre-wrap;
                    background-color: var(--vscode-editor-background);
                    border: 1px solid var(--vscode-input-border);
                }
                button {
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    padding: 8px 16px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
            </style>
        </head>
        <body>
            <textarea id="prompt" rows="4" placeholder="Ask something..."></textarea>
            <button id="askBtn">Ask DeepSeek</button>
            <div id="response"></div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                document.getElementById('askBtn').addEventListener('click', sendMessage);
                document.getElementById('prompt').addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                        sendMessage();
                    }
                });

                function sendMessage() {
                    const text = document.getElementById('prompt').value.trim();
                    if (!text) return;
                    
                    document.getElementById('response').innerText = 'Thinking...';
                    vscode.postMessage({
                        command: 'chat',
                        text: text
                    });
                }

                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'response') {
                        document.getElementById('response').innerText = message.text;
                    }
                });
            </script>
        </body>
        </html>
    `;
}

export function deactivate() {
    if (panel) {
        panel.dispose();
    }
}