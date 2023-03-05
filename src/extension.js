const abcjs = require("./lib/abcjs")
const vscode = require("vscode")
const fs = require("fs")
const path = require("path")
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
	const show = vscode.commands.registerCommand(
		"abc.showPreview", () => showPanel()
	)
	ctx.subscriptions.push(show)

	const create = vscode.commands.registerCommand(
		"abc.createNew", () => createMidi()
	)
	ctx.subscriptions.push(create)
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

const createMidi = () => {
	const file = getFileName(),
		  output = getOutputPath() + ".mid"
	const abc = getEditorContent()
	const midi = Buffer.from(
		abcjs.synth.getMidiFile(
			abc, {
				midiOutputType: "binary",
				fileName: file + ".mid"
			}
		)[0]
	)
	writeFile(output, midi)
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
		vscode.Uri.joinPath(ctx.extensionUri, 'src/lib', 'abcjs.js')
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

const getFileName = () => {
	const path = vscode.window.activeTextEditor.document.fileName.split("\\")
	return path[path.length - 1].split(".")[0]
}

const getFolderName = () => {
	const file = getFileName()
	const path = vscode.window.activeTextEditor.document.fileName
	return path.replace(`${file}.abc`, "")
}

const getOutputPath = () => {
	const file = getFileName()
	const folder = getFolderName()
	return path.resolve(folder, file)
}

const isAbc = () => {
	const language = vscode.window.activeTextEditor.document.languageId
	return language == "abc" || language == "plaintext"
}

const openFile = (filename) => {
	try {
		return fs.readFileSync(filename).toString()
	} catch (err) {
		if (err) return console.error(err)
	}
}

const writeFile = (filename, data) => {
	fs.writeFile(filename, data, err => {
		if (err) return console.error(err)
	})
}