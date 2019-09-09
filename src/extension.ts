// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated


	console.log('Congratulations, your extension "autoclass" is now active!');


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	

	/* Create single class. Ideally this command would allowed
	   users to automatically insert in the relative stylesheet 
	   a new empty css class
	*/
	let singleClass = vscode.commands.registerCommand('extension.createSingleClass', () => {
		// The code you place here will be executed every time your command is executed

		//This is the root path for the project folder 
		// let projectFolder =  vscode.workspace.workspaceFolders[0].uri.fsPath
		let cssContent : any = ""

		


		//This is the current path of the file where you are activating the extesion
		const currentFile = getFileName(getFileURI())

		//This is the current path of the file where you are activating the extesion
		function getFileURI(){
			if(vscode.window.activeTextEditor){
				return vscode.window.activeTextEditor.document.uri.toString()
			}
		}
		
		//Use this to get the current file name
		function getFileName(currentPath: any) {
			return currentPath.substring(currentPath.lastIndexOf('/') + 1)
		}

		//This should be the style file that match the component one to add method to check scss etc
		const currentStyleFile = currentFile.replace('html','css')

		//This will get the selected string
		const editor = vscode.window.activeTextEditor;

		if(editor){
			let selection = editor.selection;
			if(selection.isEmpty){
				// the Position object gives you the line and character where the cursor is
				let position = editor.selection.active;
				let newPosition = position.with(position.line, 0);
				let newSelection = new vscode.Selection(newPosition, newPosition);
				editor.selection = newSelection;
			}
			let text = editor.document.getText(selection);
			cssContent =  `.` + text + `{ }`;
		}
		
		
		//The content to write 

		//This is not the right method to use, is too hight level and is difficult to use it for achieve 
		//what we want here. Instead have a look on fs.write
		const cssfile = vscode.workspace.findFiles("**/" + currentStyleFile).then((res) =>
			fs.writeFile(path.join(res[0].path.replace(/\//g, "\\").substr(1)), cssContent, err => {
				if(err){
					console.error(err);
					return console.log("Something went wrong");
				}
				vscode.window.showInformationMessage("Everything is good")
			}) 
	)


		vscode.window.showInformationMessage('SHOULD BE OK');
	});

	let allClass = vscode.commands.registerCommand('extension.createAllClass', () => {
			
		// const editor = vscode.window.activeTextEditor;
		// const selection = editor.selection;
		// if(selection.isEmpty)
		// {
		// 	// the Position object gives you the line and character where the cursor is
		// 	  const position = editor.selection.active;
		// 	  const newPosition = position.with(position.line, 0);
		// 	  const newSelection = new vscode.Selection(newPosition, newPosition);
		// 	  editor.selection = newSelection;
		// }
		// const text = editor.document.getText(selection);

	});

	context.subscriptions.push(allClass,singleClass);
}

// this method is called when your extension is deactivated
export function deactivate() {

}
