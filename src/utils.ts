import axios from "axios";
import fs from "fs";
import path from "path";
import vscode, { window, commands, ProgressLocation } from "vscode";
import { VSXI_FILE_URL } from "./constants";

export const showReloadPrompt = async (message: string) => {
    const reload = await window.showInformationMessage(message, "Reload Now");
    if (reload) {
        commands.executeCommand("workbench.action.reloadWindow");
    }
};

export const infiniteProgress = (title: string) => {
    let finish = () => {};
    vscode.window.withProgress(
        {
            location: ProgressLocation.Notification,
            title,
        },
        () =>
            new Promise(resolve => {
                // @ts-ignore
                finish = resolve;
            }),
    );
    return { finish };
};
/**
 *
 * @param url
 * @param destinationPath
 * @returns
 */

export const downloadFile = async (url: string, destinationPath: string) => {
    const writer = fs.createWriteStream(destinationPath);
    const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
};

export const installExtension = async (extensionStoragePath: string) => {
    if (!fs.existsSync(extensionStoragePath)) {
        fs.mkdirSync(extensionStoragePath);
    }
    const fileName = "shyarora-demo-test-0.0.1.vsix";
    const filePath = path.join(extensionStoragePath, fileName);
    await downloadFile(VSXI_FILE_URL, filePath);
    await vscode.commands.executeCommand("workbench.extensions.installExtension", vscode.Uri.file(filePath));
    fs.unlinkSync(filePath);
};
