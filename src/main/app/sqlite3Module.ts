import sqlite from 'sqlite3';
const sqlite3 = sqlite.verbose();
var db;

export function sqlite3Module(ipcMain) {
    console.log("sqlite3  ok")

    ipcMain.on('SQLITE3_BULK_INSERT_PREPARED', async (event, arg) => {
        return new Promise((resolve) => {
            db = new sqlite3.Database(':memory:');
            const stmt = db.prepare(arg[0]);
            const values = arg[1];
            for (let i = 0; i < values.length; i++) {
                stmt.run(values[i]);
            }
            stmt.finalize();
            db.close();
            resolve({
                OK: true
            })
        });
    });

    ipcMain.on('SQLITE3_INSERT_LASTID', async (event, arg) => {
        return new Promise((resolve) => {
            db = new sqlite3.Database(':memory:');
            const stmt = db.prepare(arg[0]);
            stmt.run(arg[1], function(err){
                stmt.finalize();
                db.close();
                if (err){
                    resolve({
                        ERROR: err
                    });
                }else{
                    resolve({
                        OK: this.lastID
                    })
                }
            });
        });
    });

    ipcMain.handle('SQLITE3_RUN', async (event, arg) => {
        return new Promise((resolve) => {
            db = new sqlite3.Database(':memory:');
            db.run(arg[0], arg[1], function(err){
                db.close();
                if (err){
                    resolve({
                        ERROR: err
                    });
                }else{
                    resolve({
                        OK: true
                    })
                }
            });
        });
    });

    ipcMain.handle('SQLITE3_SELECT', async (event, arg) => {
        return new Promise((resolve) => {
            db = new sqlite3.Database(':memory:');
            db.all(arg[0], function(err, rows) {
                db.close();
                if (err){
                    resolve({
                        ERROR: err
                    });
                }else{
                    resolve({
                        OK: rows
                    })
                }
            });
        });
    });
}