const abcjs = require("./abcjs")
const vscode = require("vscode")
const uri = { script: "", styles: "", abcjs: "" }
let ctx, panel

const activate = (context) => {
	ctx = context
	registerCommands()
	registerEvents()
}

const deactivate = () => {}

module.exports = {
	activate,
	deactivate
}

const registerCommands = () => {
	const play = vscode.commands.registerCommand(
		"abc.showPreview", () => showPanel()
	)
	ctx.subscriptions.push(play)
}

const registerEvents = () => {
	ctx.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(() => {
			updatePanel()
		})
	)
}

const showPanel = () => {
	initializePanel()
	const abc = getEditorContent()
	panel.webview.html = getWebviewContent(abc)
}

const updatePanel = () => {
	if (panel && isAbc()) {
		const abc = getEditorContent()
		panel.webview.html = getWebviewContent(abc)
	}
}

const initializePanel = () => {
	panel = vscode.window.createWebviewPanel(
        'previewPanel',
        'Preview',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
	)

	uri.styles = panel.webview.asWebviewUri(
		vscode.Uri.joinPath(ctx.extensionUri, 'webview', 'main.css')
	)
	uri.script = panel.webview.asWebviewUri(
		vscode.Uri.joinPath(ctx.extensionUri, 'webview', 'main.js')
	)
	uri.abcjs = panel.webview.asWebviewUri(
		vscode.Uri.joinPath(ctx.extensionUri, 'src', 'abcjs.js')
	)
}

const getEditorContent = () => {
	const content = vscode.window.activeTextEditor?.document.getText()
	return content.replace(/\r\n/g, "\n")
}

const getWebviewContent = (content) => {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Preview</title>
			<link href="${uri.styles}" rel="stylesheet">
			<script src="${uri.abcjs}"></script>
		</head>
		<body>
			<abc>${content}</abc>
			<button>&#xea1c;</button>
			<main></main>
			<script src="${uri.script}"></script>
		</body>
		</html>
	`
}

const isAbc = () => {
	const language = vscode.window.activeTextEditor.document.languageId
	return language == "abc" || language == "plaintext"
}