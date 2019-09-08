// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as textEditor from 'fs'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {



	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated


	console.log('Congratulations, your extension "autoclass" is now active!');


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed



		//This is the root path for the project folder 
		// let projectFolder =  vscode.workspace.workspaceFolders[0].uri.fsPath

		//This is the current path of the file where you are activating the extesion
		const currentFilePath = vscode.window.activeTextEditor.document.uri.toString()

		//This is the current path of the file where you are activating the extesion
		const currentFile = getFileName(currentFilePath)

		// const currentFolder = getActualFolder(projectFolder)


		//This should be the style file that match the component one to add method to check scss etc
		const currentStyleFile = currentFile.replace('html','css')

		//This will get the selected string
		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;
		if(selection.isEmpty)
		{
			// the Position object gives you the line and character where the cursor is
			  const position = editor.selection.active;
			  var newPosition = position.with(position.line, 0);
			  var newSelection = new vscode.Selection(newPosition, newPosition);
			  editor.selection = newSelection;
		}
		const text = editor.document.getText(selection);

		//The content to write
		const cssContent =  `.` + text + `{ }`;

		const cssfile = vscode.workspace.findFiles("**/" + currentStyleFile).then((res) =>
		fs.writeFile(path.join(res[0].path.replace(/\//g, "\\").substr(1)), cssContent, err => {
			if(err){
				console.error(err);
				return console.log("Something went wrong");
			}
			vscode.window.showInformationMessage("Everything is good")
		}) 
	)

		//Use this to get the current file name
		function getFileName(currentPath: any) {
			return currentPath.substring(currentPath.lastIndexOf('/') + 1)
		}
		vscode.window.showInformationMessage('SHOULD BE OK');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
