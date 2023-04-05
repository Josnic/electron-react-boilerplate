export const openSystemBrowser = (url) => {
    window.electron.ipcRenderer.sendMessage('openBrowser', [url]);
}