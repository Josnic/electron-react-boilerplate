import { join } from 'path';
import { app, shell } from 'electron';

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
}