import vscode from "vscode";
import os from "os";
import { infiniteProgress, installExtension, showReloadPrompt } from "./utils";

export async function activate(context: vscode.ExtensionContext) {
    const progress = infiniteProgress("Please wait while setting up your IDE...");
    try {
        await installExtension();
        showReloadPrompt("Installation complete, please reload");
    } catch (e) {
        vscode.window.showErrorMessage(`Error occured while setting up your IDE ${e}`);
    } finally {
        progress.finish();
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}
