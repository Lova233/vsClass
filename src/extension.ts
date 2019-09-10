// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

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
  let singleClass = vscode.commands.registerCommand(
    "extension.createSingleClass",
    () => {
      // The code you place here will be executed every time your command is executed

      //This is the root path for the project folder
      // let projectFolder =  vscode.workspace.workspaceFolders[0].uri.fsPath
      let cssContent: any = "";

      //This is the current path of the file where you are activating the extesion
      const currentFile = getFileName(getFileURI());

      //This is the current path of the file where you are activating the extesion
      function getFileURI() {
        if (vscode.window.activeTextEditor) {
          return vscode.window.activeTextEditor.document.uri.toString();
        }
      }

      //Use this to get the current file name
      function getFileName(currentPath: any) {
        return currentPath.substring(currentPath.lastIndexOf("/") + 1);
      }

      //This should be the style file that match the component one to add method to check scss etc
      const currentStyleFile = currentFile.replace("html", "css");

      //This will get the selected string
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        let selection = editor.selection;
        if (selection.isEmpty) {
          // the Position object gives you the line and character where the cursor is
          let position = editor.selection.active;
          let newPosition = position.with(position.line, 0);
          let newSelection = new vscode.Selection(newPosition, newPosition);
          editor.selection = newSelection;
        }
        let text = editor.document.getText(selection);
        cssContent = `.` + text + `{ }`;
      }

      //The content to write

      //This is not the right method to use, is too hight level and is difficult to use it for achieve
      //what we want here. Instead have a look on fs.write
      vscode.workspace.findFiles("**/" + currentStyleFile).then(res =>
        fs.appendFile(
          path.join(res[0].path.replace(/\//g, "\\").substr(1)),
          cssContent,
          err => {
            if (err) {
              console.error(err);
              return console.log("Something went wrong");
            }
            vscode.window.showInformationMessage("Everything is good");
          }
        )
      );

      vscode.window.showInformationMessage("SHOULD BE OK");
    }
  );







  /* 
    Create all class. Ideally this command would allowed
    users to automatically insert in the relative stylesheet 
    a all the new empty css class
  */
  let allClass = vscode.commands.registerCommand(
    "extension.createAllClass",
    () => {

      
      let cssClass: any = "";
      let regexClass: RegExp = /class=(?:\")(.*?)(?:\")/g;
      let classes: any;

      //This is the current path of the file where you are activating the extesion
      const currentFile = getFileName(getFileURI());

      //This should be implemented with stronger logic to find also other possible extension  scss...
      const currentStyleFile = currentFile.replace("html", "css");

      //This is the current path of the file where you are activating the extesion
      function getFileURI() {
        if (vscode.window.activeTextEditor) {
          return vscode.window.activeTextEditor.document.uri.toString();
        }
      }

      //Use this to get the current file name
      function getFileName(currentPath: any) {
        return currentPath.substring(currentPath.lastIndexOf("/") + 1);
      }

      //This will get the selected string
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        let selection = editor.selection;
        if (selection.isEmpty) {
          // the Position object gives you the line and character where the cursor is
          let position = editor.selection.active;
          let newPosition = position.with(position.line, 0);
          let newSelection = new vscode.Selection(newPosition, newPosition);
          editor.selection = newSelection;
        }
        let text = editor.document.getText(selection);
        cssClass = `.` + text + `{ }`;

        var matches = getMatches(text, regexClass, 1);

        function getMatches(string: any, regex: any, index: any) {
          index || (index = 1); // default to the first capturing group
          var matches = [];
          var match;
          while ((match = regex.exec(string))) {
            matches.push(match[index]);
          }

          return matches;
        }
        // need to find a way to check for multiple spaces this is working but is orrible >> "     "
        classes = matches.join("       ").split(" ");
        let buffer = "";
        classes = [...new Set(classes)];
        // and also lead to this shit 
        classes = classes.filter(item => item != "");
      }

      //This is not the right method to use, is too hight level and is difficult to use it for achieve
      //what we want here. Instead have a look on fs.write

      let cssContent = "";
      for (let index = 0; index < classes.length; index++) {
        cssContent += "." + classes[index] + " {" + "\n" + "\n" + "}" + "\n" + "\n";

        vscode.workspace.findFiles("**/" + currentStyleFile).then(res =>
          fs.open(
            path.join(res[0].path.replace(/\//g, "\\").substr(1)),
            "w",
            function (err, fd) {
              if (err) {
                throw err;
              }
              fs.appendFile(fd, cssContent, null, function (err) {
                if (err) throw err;
                fs.close(fd, function () {
                  console.log("wrote the file successfully");
                });
              });
            }
          )
        );
      }


      vscode.window.showInformationMessage("SHOULD BE OK");
    }

  )


  /* 
    Create all NEW class (no already open rule set). Ideally this command would allowed
    users to automatically insert in the relative stylesheet 
    a all the new empty css class
  */
  let newClass = vscode.commands.registerCommand(
    "extension.createAllNewClass",
    () => {

    })


  context.subscriptions.push(allClass, singleClass, newClass);
}

// this method is called when your extension is deactivated
export function deactivate() { }
