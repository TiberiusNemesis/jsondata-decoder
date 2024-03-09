import * as chai from 'chai';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { activate, deactivate } from '../extension';

const expect = chai.expect;

suite("Extension Tests", () => {
    let sandbox: sinon.SinonSandbox;

    setup(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(vscode.env.clipboard, 'readText').returns(Promise.resolve('jsondata=%7B%22test%22%3A%20%7B%22array%22%3A%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%2C%20%22string%22%3A%20%22Hello%20World%22%2C%20%22stringWithAllSpecialCharacters%22%3A%20%22-%3D%2B%21%40%23%24%25%5E%26%2A%28%29_%2B%7B%7D%7C%3A%3C%3E%3F%5B%5D%3B%27%2C./%60~%22%2C%20%22object%22%3A%20%7B%22key%22%3A%20%22value%22%7D%2C%20%22number%22%3A%20123%2C%20%22boolean%22%3A%20true%2C%20%22null%22%3A%20null%7D%7D'));
        sandbox.stub(vscode.env.clipboard, 'writeText').resolves();
        sandbox.stub(vscode.window, 'showInformationMessage').resolves();
        sandbox.stub(vscode.window, 'showErrorMessage').resolves();
    });

    teardown(() => {
        sandbox.restore();
    });

    test("Formats valid JSON from clipboard", async () => {
        const inputJSON = '{"key": "value"}';
        const expectedJSON = '{\n    "key": "value"\n}';
        vscode.env.clipboard.readText.resolves(inputJSON);

        await activate(<any>{ subscriptions: [] });

        expect(vscode.env.clipboard.writeText.calledWith(expectedJSON)).to.be.true;
    });

    test("Handles invalid JSON from clipboard", async () => {
        vscode.env.clipboard.readText.resolves('invalid json');

        await activate(<any>{ subscriptions: [] });

        expect(vscode.window.showErrorMessage.calledWithMatch(/Error parsing JSON/)).to.be.true;
    });

    test("Decodes and formats 'jsondata=' prefixed JSON from clipboard", async () => {
        const inputJSON = 'jsondata=%7B%22key%22%3A%20%22value%22%7D';
        const expectedJSON = '{\n    "key": "value"\n}';
        vscode.env.clipboard.readText.resolves(inputJSON);

        await activate(<any>{ subscriptions: [] });

        expect(vscode.env.clipboard.writeText.calledWith(expectedJSON)).to.be.true;
    });

    // Add more tests as needed to cover other scenarios...
});

