import * as vscode from 'vscode';
import { unescape } from 'querystring';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.formatAndCopyJson', async () => {
		const clipboardText = await vscode.env.clipboard.readText();
		let jsonData = '';

		if (clipboardText.startsWith('jsondata=')) {
			jsonData = clipboardText.substring('jsondata='.length);
			try {
				jsonData = unescape(jsonData);
			} catch (error) {
				vscode.window.showErrorMessage('Failed to decode URL-encoded JSON data. Ensure it is correctly encoded.');
				return;
			}
		} else {
			jsonData = clipboardText;
		}

		try {
			const obj = JSON.parse(jsonData);
			const formatted = JSON.stringify(obj, null, 4);

			await vscode.env.clipboard.writeText(formatted);
			vscode.window.showInformationMessage('JSON formatted and copied to clipboard!');
		} catch (error: any) {
			vscode.window.showErrorMessage(`Error parsing JSON: ${error.message}. Check for common syntax issues like missing commas or quotation marks.`, 'View Help').then(selection => {
				if (selection === 'View Help') {
					vscode.env.openExternal(vscode.Uri.parse('https://www.json.org/json-en.html'));
				}
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
