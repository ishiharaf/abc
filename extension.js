const vscode = require('vscode');

function activate(context) {
	console.log('Congratulations, your extension "abc" is now active!');
	let disposable = vscode.commands.registerCommand('abc.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from abc!');
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}