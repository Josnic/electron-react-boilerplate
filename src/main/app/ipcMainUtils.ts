import { join } from 'path';
import { app, shell } from 'electron';
import * as fs from 'fs';

export function ipcMainUtils(ipcMain) {
    ipcMain.on('openBrowser', async (event, arg) => {
        shell.openExternal(arg[0]);
    });

    ipcMain.handle('getPathCourseResource', async(event, ...args) => {
        return new Promise((resolve) => {
            const finalPath = ((process.env.NODE_ENV === 'development') ? "file://" : "") + join(app.getAppPath(), "release/app/" + args[0]);
            resolve(finalPath);
        });
    });

    ipcMain.handle('getBinaryContent', async(event, ...args) => {
        return new Promise((resolve) => {
            const file = fs.readFileSync(join(app.getAppPath(), "release/app", args[0]));
            resolve(file);
        });
    });
}