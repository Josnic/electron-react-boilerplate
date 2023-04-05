export function ipcMainUtils(ipcMain, shell) {
    ipcMain.on('openBrowser', async (event, arg) => {
        shell.openExternal(arg[0]);
    });
}