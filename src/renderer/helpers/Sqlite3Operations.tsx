
export const sqlite3Run = async (sql, params) => {
    return await window.electron.ipcRenderer.invoke('SQLITE3_RUN', [sql, params]);
}

export const sqlite3All = async (sql) => {
    return await window.electron.ipcRenderer.invoke('SQLITE3_SELECT', [sql]);
}

export const sqlite3LastId = async (sql, values) => {
    return await window.electron.ipcRenderer.invoke('SQLITE3_INSERT_LASTID', [sql, values]);
}

export const sqlite3InsertBulk = async (sql, values) => {
    return await window.electron.ipcRenderer.invoke('SQLITE3_BULK_INSERT_PREPARED', [sql, values]);
}