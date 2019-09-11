import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class Service {



  
  //This is the current path of the file where you are activating the extesion
  public static getFileURI() {
      if (vscode.window.activeTextEditor) {
          return vscode.window.activeTextEditor.document.uri.toString();
      }
  }

  //Use this to get the current file name in combination with the function just above
  public static getFileName(currentPath: any) {
    return currentPath.substring(currentPath.lastIndexOf("/") + 1);
  }


  //Use this to get the actual URI of the root folder project
  public static getRootURI() {
    if(vscode.workspace.workspaceFolders){
        return vscode.workspace.workspaceFolders[0].uri.fsPath 
    }
  }

  //Use this function to check for relative stylesheet
  public static findRelativeStyleSheet( doc : string){
      return doc.replace("html", "css");
  }


  //Use this funtction to return selected elements
  public static getSelectedElement() : any{
    const editor = vscode.window.activeTextEditor;
    let ccsContent : any
    if (editor) {
      let selection = editor.selection;
      if (selection.isEmpty) {
        // the Position object gives you the line and character where the cursor is
        let position = editor.selection.active;
        let newPosition = position.with(position.line, 0);
        let newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
        return vscode.window.showErrorMessage("Nothing selected"), ccsContent = null;
      }
      return editor.document.getText(selection);
    }
  }

  public static getCssContent(selection: string , isSingle: boolean, regex?: RegExp | any, index?: number){

      let cssContent : string = ""

      if(isSingle){
          return  cssContent = `.` + selection + `{ }`;
      }
      index || (index = 1); // default to the first capturing group
      var matches = [];
      var match;
      while ((match = regex.exec(selection))) {
        matches.push(match[index]);
      }
      // need to find a way to check for multiple spaces this is working but is orrible >> "     "
      let classes = matches.join("       ").split(" ");
      classes = [...new Set(classes)];
      // and also lead to this shit
      classes = classes.filter((item:any) => item != "");

      //create multiple classes rules based on the regexmatch
      for (let index = 0; index < classes.length; index++) {
        cssContent +=
          "." + classes[index] + " {" + "\n" + "\n" + "}" + "\n" + "\n";
      }

      return cssContent;
  }

}