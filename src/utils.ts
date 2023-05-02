import axios from "axios";
import fs from "fs";
import path from "path";
import os from "os";
import vscode, { window, commands, ProgressLocation } from "vscode";
import { HOST_NAME } from "./constants";

/**
 *
 * @param message
 */
export const showReloadPrompt = async (message: string) => {
    const reload = await window.showInformationMessage(message, "Reload Now");
    if (reload) {
        commands.executeCommand("workbench.action.reloadWindow");
    }
};

/**
 *
 * @param title
 * @returns
 */
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
const downloadFile = async (url: string, destinationPath: string) => {
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

const getExtensionInfo = async (): Promise<{ latestVersion: string }> => {
    try {
        const result = await axios.get(`${HOST_NAME}/cisco-ide/info`);
        return result.data;
    } catch (e) {
        const errorMessage = `Error occured while fetching extension info ${e}`;
        if (errorMessage.includes("getaddrinfo ENOTFOUND")) {
            vscode.window.showInformationMessage("Tip: Cisco VPN is required to install this extension");
        }
        throw new Error(errorMessage);
    }
};

/**
 *
 * @param extensionStoragePath
 */
export const installExtension = async () => {
    const tmpStoragePath = path.join(os.homedir(), "ide-tmp");
    if (!fs.existsSync(tmpStoragePath)) {
        fs.mkdirSync(tmpStoragePath, { recursive: true });
    }
    const extensionInfo = await getExtensionInfo();
    const fileUrl = `${HOST_NAME}/cisco-ide/download?version=${extensionInfo.latestVersion}`;
    const filePath = path.join(tmpStoragePath, `${extensionInfo.latestVersion}.vsix`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    await downloadFile(fileUrl, filePath);
    await vscode.commands.executeCommand("workbench.extensions.installExtension", vscode.Uri.file(filePath));
    fs.unlinkSync(filePath);
};
