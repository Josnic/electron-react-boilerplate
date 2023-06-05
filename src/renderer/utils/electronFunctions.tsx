export const openSystemBrowser = (url) => {
    window.electron.ipcRenderer.sendMessage('openBrowser', [url]);
}

export const getPathCourseResource = async(path) => {
    return await window.electron.ipcRenderer.invoke('getPathCourseResource', path);
}