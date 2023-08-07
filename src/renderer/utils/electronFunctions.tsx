export const openSystemBrowser = (url) => {
    window.electron.ipcRenderer.sendMessage('openBrowser', [url]);
}

export const getPathCourseResource = async(path) => {
    return await window.electron.ipcRenderer.invoke('getPathCourseResource', path);
}

export const getBinaryContent = async(path) => {
    return await window.electron.ipcRenderer.invoke('getBinaryContent', path);
}

export const getMachineId = async() => {
    return await window.electron.ipcRenderer.invoke('getMachineId');
}

export const deleteSerialFiles = async() => {
    return await window.electron.ipcRenderer.invoke('deleteSerialFiles');
}

export const readSerialFiles = async(pin) => {
    return await window.electron.ipcRenderer.invoke('readSerialFiles', pin);
}

export const isInternetAvailable = async(domain) => {
    return await window.electron.ipcRenderer.invoke('isInternetAvailable', domain);
}