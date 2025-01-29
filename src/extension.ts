import * as vscode from 'vscode';
import ollama from 'ollama';

export function activate(context: vscode.ExtensionContext) {
	console.log('DeepSeek extension is active!');
	const disposable = vscode.commands.registerCommand('vsode-deepseek-daddy.chat', () => {
		vscode.window.showInformationMessage('Hello World!');
		const panel = vscode.window.createWebviewPanel(
			'deepseek v0',
			'vsode-deepseek-daddy',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				// retainContextWhenHidden: true,
			}
		);
			panel.webview.html = getWebViewContent(); // hte amazing html
			panel.webview.onDidReceiveMessage(async (message:any) => {
				if (message.command === 'chat') {
					const usePrompt = message.text;
					let textResponse =''

					try {
						const streamResponse = await ollama.chat({
							model:"deepseek-r1:latest",
							messages: [
								{
									role: "user",
									content: usePrompt,
								},
							],
							stream: true as true, // Type assertion
							// temperature: 0.5,
							// max_tokens: 1000,
						});

						for await (const chunk of streamResponse) {
							textResponse += chunk.message.content;
							panel.webview.postMessage({
								command: 'response', 
								text:textResponse
							});
						}
						
					} catch (error) {
						console.log('ass error', error);
						
						panel.webview.postMessage({
							command: 'response', 
							text:error
						});
					}
				}
			});
	});

	context.subscriptions.push(disposable);

}


function getWebViewContent() {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<style>
		body { font-family: sans-serif; margin: 1rem; }
		#prompt { width: 100%; box-sizing: border-box; }
		#response { border: 1px solid #ccc; margin-top:1rem ,padding: 0.5rem; min-height: 0.5rem; }
		</style>
	</head>
	<body>
		<h2>Deepseek Daddy</h2>
		<textarea id="prompt" rows="3" placeholder="Ask something..."></textarea><br />
		<button id="askBtn">Ask</button>
		<div id="response"></div>
		<script>
			const vscode = acquireVsCodeApi();
			
			document.getElementById('askBtn').addEventListener('click', () => {
				const text = document.getElementById('prompt').value;
				vscode.postMessage({
					command: 'chat',
					text
				});
			});

			window.addEventListener('message', (event) => {
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
export function deactivate() {}