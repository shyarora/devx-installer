import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "shyarora-demo" is now active!');
  let disposable = vscode.commands.registerCommand(
    "shyarora-demo.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from shyarora-demo!");
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
