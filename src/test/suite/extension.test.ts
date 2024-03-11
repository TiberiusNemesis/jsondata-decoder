import * as vscode from 'vscode';
import { activate, deactivate, formatAndCopyJson, runExtension, unescapeData } from '../../extension';
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
      const validJson = testData.cases.standardJsonNotFormatted.input;
      const expectedFormattedJson = testData.cases.standardJsonNotFormatted.expected;
    
      const writeTextStub = sinon.stub(ClipboardHelper, 'writeTextToClipboard').resolves(undefined);
    
      await formatAndCopyJson(validJson);
    
      writeTextStub.restore();
      sinon.assert.calledOnceWithExactly(writeTextStub, expectedFormattedJson);
    });

    test("Handles all types of characters, JSON objects, and copies to clipboard", async () => {
      const validJson = testData.cases.allDataTypesJsonData.input;
      const expectedFormattedJson = JSON.stringify(testData.cases.allDataTypesJsonData.expected, null, 4);
      const readTextStub = sinon.stub(ClipboardHelper, 'readTextFromClipboard').resolves(validJson);
      const writeTextStub = sinon.stub(ClipboardHelper, 'writeTextToClipboard').resolves(undefined);
    
      await unescapeData(validJson).then(unescapeDataResult => {
        if (unescapeDataResult) {
          formatAndCopyJson(unescapeDataResult);
        }
      });
          
      readTextStub.restore();
      writeTextStub.restore();
      sinon.assert.calledOnceWithExactly(writeTextStub, expectedFormattedJson);
    });
    
    
    test("Shows error message for invalid JSON", async () => {
      const invalidJson = testData.cases.improperStructureJson.input;
      const showErrorMessageStub = sinon.stub(vscode.window, 'showErrorMessage').resolves();
      
      await formatAndCopyJson(invalidJson);
      
      showErrorMessageStub.restore();
      sinon.assert.calledOnce(showErrorMessageStub);
    });

    test("Handles empty clipboard without error", async () => {
      const readTextStub = sinon.stub(ClipboardHelper, 'readTextFromClipboard').resolves(' ');
      const showErrorMessageStub = sinon.stub(vscode.window, 'showErrorMessage').resolves();
    
      await runExtension();
      
      showErrorMessageStub.restore();
      readTextStub.restore();
      sinon.assert.notCalled(showErrorMessageStub);
    });
});

