export const openSystemBrowser = (url) => {
    window.electron.ipcRenderer.sendMessage('openBrowser', [url]);
}

export const getPathCourseResource = async(path) => {
    return await window.electron.ipcRenderer.invoke('getPathCourseResource', path);
}

export const getBinaryContent = async(path) => {
    return await window.electron.ipcRenderer.invoke('getBinaryContent', path);
}