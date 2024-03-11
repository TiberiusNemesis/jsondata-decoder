import * as vscode from 'vscode';
import { activate, deactivate, formatAndCopyJson, unescapeData } from '../../extension';
import * as testData from '../testData.json';
import { ClipboardHelper } from '../../clipboardHelper';
import assert from 'assert';
import sinon from 'sinon';

suite("Extension Tests", () => {
    vscode.window.showInformationMessage('Starting test suite execution.');
   
    test("Verifies that unescapeData properly unescapes data", async () => {
      const escapedData = '%7B%22key%22%3A%22value%22%7D';
      const expectedUnescapedData = '{"key":"value"}';

      const unescapedData = await unescapeData(escapedData);

      assert.strictEqual(unescapedData, expectedUnescapedData);
    });

    test("Verifies that unescapeData removes 'jsondata=' prefix", async () => {
      const clipboardText = 'jsondata={"key":"value"}';
      const expectedUnescapedData = '{"key":"value"}';

      const unescapedData = await unescapeData(clipboardText);

      assert.strictEqual(unescapedData, expectedUnescapedData);
    });

    test("Formats valid JSON and copies to clipboard", async () => {
      const validJson = '{"key": "value"}';
      const expectedFormattedJson = '{\n    "key": "value"\n}';
    
      const writeTextStub = sinon.stub(ClipboardHelper, 'writeTextToClipboard').resolves(undefined);
    
      await formatAndCopyJson(validJson);
    
      sinon.assert.calledOnceWithExactly(writeTextStub, expectedFormattedJson);
      writeTextStub.restore();
    });
    
});

