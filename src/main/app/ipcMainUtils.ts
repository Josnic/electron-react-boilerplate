import { join } from 'path';
import { app, shell } from 'electron';
import * as fs from 'fs';
import { machineIdSync } from 'node-machine-id';
import { isInternetAvailable } from 'is-internet-available'

export function ipcMainUtils(ipcMain) {
  ipcMain.on('openBrowser', async (event, arg) => {
    shell.openExternal(arg[0]);
  });

  ipcMain.handle('getPathCourseResource', async (event, ...args) => {
    return new Promise((resolve) => {
      const finalPath =
        (process.env.NODE_ENV === 'development' ? 'file://' : '') +
        join(app.getAppPath(), 'release/app/' + args[0]);
      resolve(finalPath);
    });
  });

  ipcMain.handle('getBinaryContent', async (event, ...args) => {
    return new Promise((resolve) => {
      const file = fs.readFileSync(
        join(app.getAppPath(), 'release/app', args[0])
      );
      resolve(file);
    });
  });

  ipcMain.handle('isInternetAvailable', async (event, ...args) => {
    const domain = args[0] ? args[0] : "google.com";
    return new Promise((resolve) => {
        isInternetAvailable({ authority: domain }).then((status)=>{
            resolve(status)
        }).catch((erro)=>{
            resolve(false);
        });
    });
  });

  ipcMain.handle('getMachineId', async (event, ...args) => {
    return new Promise((resolve) => {
      resolve(machineIdSync());
    });
  });

  ipcMain.handle('deleteSerialFiles', async (event, ...args) => {
    return new Promise((resolve) => {
        try{
            fs.unlinkSync(join(app.getAppPath(), 'release/app', 'fslite.qoc'));
            resolve({
                ok:true
            })
        }catch(err){
            resolve({
                error:err
            })
        }
    });
  });

  ipcMain.handle('readSerialFiles', async (event, ...args) => {
    return new Promise((resolve) => {
      let data = fs.readFileSync(
        join(app.getAppPath(), 'release/app', 'fslite.qoc'),
        { encoding: 'utf8' }
      );
      try {
        data = data.split('\n');
        const currentSerial = args[0];
        let found = false;
        for (var i = 0; i < data.length; i++) {
          console.log(data[i] + '---' + currentSerial);
          if ((data[i]).trim() == currentSerial) {
            found = true;
            i = data.length;
          }
        }
        resolve({
          ok: true,
          found: found,
          data: null,
        });
      } catch (err) {
        resolve({
          error: true,
          data: err,
          found: false,
        });
      }
    });
  });
}
