import * as vscode from 'vscode';

export class ClipboardHelper {
    static async readTextFromClipboard(): Promise<string> {
        return vscode.env.clipboard.readText();
    }

    static async writeTextToClipboard(text: string): Promise<void> {
        return vscode.env.clipboard.writeText(text);
    }
}