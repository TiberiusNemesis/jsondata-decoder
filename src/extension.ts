import * as vscode from 'vscode';
import { unescape } from 'querystring';
import { ClipboardHelper } from './clipboardHelper';

let clipboardText;

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.formatAndCopyJson', runExtension);
	context.subscriptions.push(disposable);
}

export async function runExtension() {
	clipboardText = await ClipboardHelper.readTextFromClipboard();
	if (clipboardText) {
		unescapeData(clipboardText);
	}
	await formatAndCopyJson(clipboardText);
}

// Removes the 'jsondata=' prefix from the clipboard text and unescapes the JSON data
export async function unescapeData(clipboardText: string) {
	try {
		clipboardText = unescape(clipboardText.replace('jsondata=', ''));
		return clipboardText;
	} catch (error: any) {
		vscode.window.showErrorMessage('Failed to decode URL-encoded JSON data: ' + clipboardText + '. Ensure it is correctly encoded.');
	}
}

// Formats the JSON and copies it to the clipboard
export async function formatAndCopyJson(clipboardText: string) {
	try {
		const obj = JSON.parse(clipboardText);
		const formatted = JSON.stringify(obj, null, 4);

		await ClipboardHelper.writeTextToClipboard(formatted); 
		vscode.window.showInformationMessage('JSON formatted and copied to clipboard.');
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error parsing JSON: ${error.message}. Check for common syntax issues like missing commas or quotation marks.`, 'View Help').then(selection => {
			if (selection === 'View Help') {
				vscode.env.openExternal(vscode.Uri.parse('https://www.json.org/json-en.html'));
			}
		});
	}
}

export function deactivate() { }
