import vscode from "vscode";
import { infiniteProgress, installExtension, showReloadPrompt } from "./utils";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand("shyarora-demo.setup-installer", async () => {
        const progress = infiniteProgress("Please wait while extension is installing");
        try {
            await installExtension(context.globalStorageUri.path);
            showReloadPrompt("Installation complete, please reload");
        } catch (e) {
            vscode.window.showErrorMessage(`Error occured while installing extension ${e}`);
        } finally {
            progress.finish();
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
