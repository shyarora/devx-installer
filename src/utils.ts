import axios from "axios";
import fs from "fs";
import path from "path";
import os from "os";
import vscode, { window, commands, ProgressLocation } from "vscode";
import { BASEURL } from "./constants";

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
    let finish = () => { };
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

export const getExtensionInfo = async (): Promise<{ version: string; fileKey: string }> => {
    try {
        const result = await axios.get(`${BASEURL}/extension-namespace/api/marketplace/v1/get-installer-info`);
        return result.data?.latestVersion;
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
export const installExtension = async (fileKey: string, version: string) => {
    const tmpStoragePath = path.join(os.homedir(), "ide-tmp");
    if (!fs.existsSync(tmpStoragePath)) {
        fs.mkdirSync(tmpStoragePath, { recursive: true });
    }
    const fileUrl = `${BASEURL}/cdn/api/v1/download/${fileKey}`;
    const filePath = path.join(tmpStoragePath, `${version}.vsix`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    await downloadFile(fileUrl, filePath);
    await vscode.commands.executeCommand("workbench.extensions.installExtension", vscode.Uri.file(filePath));
    fs.unlinkSync(filePath);
};
