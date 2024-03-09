import * as assert from 'assert';
import * as vscode from 'vscode';
import * as decoder from '../extension';

suite('Extension Tests', () => {
  suiteSetup(async () => {
    const extension = vscode.extensions.getExtension('extension.formatAndCopyJson');
    if (!extension?.isActive) {
      await extension?.activate();
    }
  });

  test('Sample Test', async () => {
		assert.strictEqual(1, 1);
	});

});
