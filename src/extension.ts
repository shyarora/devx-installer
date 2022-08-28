import vscode from "vscode";
import { infiniteProgress, installExtension } from "./utils";

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "shyarora-demo" is now active!');

    // let disposable = vscode.commands.registerCommand("shyarora-demo.helloWorld", async () => {
    //     const progress = infiniteProgress("Please wait while extension is installing");
    //     try {
    //         await installExtension(context.globalStorageUri.path);
    //     } catch (e) {
    //         vscode.window.showErrorMessage(`Error occured while installing extension ${e}`);
    //     } finally {
    //         progress.finish();
    //     }
    // });

    let disposable = vscode.commands.registerCommand("shyarora-demo-file.info-command", async () => {
        vscode.window.showInformationMessage("This is just info-command");
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
