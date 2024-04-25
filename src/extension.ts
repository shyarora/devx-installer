import vscode from "vscode";
import semver from "semver";
import { getExtensionInfo, infiniteProgress, installExtension, showReloadPrompt } from "./utils";

export async function activate(context: vscode.ExtensionContext) {


    vscode.commands.registerCommand("ide-installer.update-cisco-ide", async () => {
        const progress = infiniteProgress("Please wait while updating your IDE...");
        try {
            const { fileKey, version } = await getExtensionInfo();
            await installExtension(fileKey, version);
            showReloadPrompt("Update complete, please reload");
        } catch (e) {
            vscode.window.showErrorMessage(`Error occured while updating your IDE ${e}`);
        } finally {
            progress.finish();
        }
    });

    const extensions = vscode.extensions.all;

    const { fileKey, version } = await getExtensionInfo();

    const isInstalled = extensions.find((ext) => ext.id === "cisco-vscode.cisco-marketplace");

    if (isInstalled && semver.gte(isInstalled.packageJSON.version, version)) {
        return
    }

    const progress = infiniteProgress("Please wait while setting up your IDE...");
    try {
        await installExtension(fileKey, version);
        showReloadPrompt("Installation complete, please reload");
    } catch (e) {
        vscode.window.showErrorMessage(`Error occured while setting up your IDE ${e}`);
    } finally {
        progress.finish();
    }


}

// this method is called when your extension is deactivated
export function deactivate() { }
