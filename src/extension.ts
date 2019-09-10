// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import  { Service } from "./service"

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

      let error : boolean = false;

      //This is the current path of the file where you are activating the extesion
      const currentFile = Service.getFileName(Service.getFileURI());
 
      //This should be the style file that match the component one to add method to check scss etc
      const currentStyleFile = Service.findRelativeStyleSheet(currentFile)

      //Grab the selection and convert it to style content may be splitted in 2 functions
      const cssContent = Service.getSelectedElement()


      console.log(cssContent,"the content")

      if(cssContent != null){
        vscode.workspace.findFiles("**/" + currentStyleFile).then(res =>
          fs.appendFile(
            path.join(res[0].path.replace(/\//g, "\\").substr(1)),
            cssContent,
            err => {
              if (err) {
                console.error(err);
                error = true;
              }
              vscode.window.showInformationMessage("Content successfully written");
            }
          )
        );
      }else{
        console.log("qua")
         error = true
      }
      console.log(error);


      if(!error){
        vscode.window.showInformationMessage("YOU SHOULD BE GOOD MA BOY");
      }else{
        console.log("not here?")
        vscode.window.showErrorMessage("YOU ARE NOT SO GOOD MA BOY");        
      }
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
      let classes: any;
      let regexClass: RegExp = /class=(?:\")(.*?)(?:\")/g;

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
        classes = classes.filter((item:any) => item != "");
      }

      //This is not the right method to use, is too hight level and is difficult to use it for achieve
      //what we want here. Instead have a look on fs.write

      let cssContent = "";
      for (let index = 0; index < classes.length; index++) {
        cssContent +=
          "." + classes[index] + " {" + "\n" + "\n" + "}" + "\n" + "\n";

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
              });
            }
          )
        );
      }

      vscode.window.showInformationMessage("SHOULD BE OK");
    }
  );

  /* 
    Create all NEW class (no already open rule set). Ideally this command would allowed
    users to automatically insert in the relative stylesheet 
    a all the new empty css class
  */
  let newClass = vscode.commands.registerCommand(
    "extension.createAllNewClass",
    () => {

      let options = ""
      let userInput: any;
      let cssClass: any;
      let classes: any;
      let regexClass: RegExp = /class=(?:\")(.*?)(?:\")/g;

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
        classes = classes.filter((item:any) => item != "");
      }


      let cssContent = "";
      for (let index = 0; index < classes.length; index++) {
        cssContent +=
          "." + classes[index] + " {" + "\n" + "\n" + "}" + "\n" + "\n";

      

      //Use this to get the current file name
      function getFileName(currentPath: any) {
        return currentPath.substring(currentPath.lastIndexOf("/") + 1);
      }

      let inputOptions: vscode.InputBoxOptions = {
        placeHolder: "Choose your stylesheet"
      }



      const inputBox = vscode.window.showInputBox(inputOptions)
      .then(
          res => userInput = res)
      .then(function (userInput) {
          return writeOnRightFile(userInput)}
          )
      }
      

      function writeOnRightFile(userInput:any){
        vscode.workspace.findFiles("**/" + userInput).then(res =>
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
      }
      //Use util to inspect complex obj
      // console.log(util.inspect(input.then(res=>console.log(res)), {showHidden: false, depth: null}))
    });

  context.subscriptions.push(allClass, singleClass, newClass);
}

// this method is called when your extension is deactivated
export function deactivate() { }
