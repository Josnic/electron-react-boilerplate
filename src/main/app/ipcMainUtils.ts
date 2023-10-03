import { join } from 'path';
import { app, shell } from 'electron';
import * as fs from 'fs';
import axios from 'axios';
import { machineIdSync } from 'node-machine-id';
import { isInternetAvailable } from 'is-internet-available';

const localPath = app.isPackaged ? "../" : "release/app";

const API = axios.create({
  timeout: 4000,
  headers: {
      'accept': 'application/json', 
      'Content-Type': 'application/json',
      'user': 'userSerial',
      'token': '0febaed7a8fe0951fefd618b176e34d483082e12'
  },
  adapter: 'http' 
})

const errorHandler = (error) => {
  if (error.response){
      return {
          type: "response",
          error: {
            status: error.response.status,
            data: error.response.data
          }
      }
  }else if (error.request){
      return {
          type: "request",
          error: {
            status: error.request.status ? error.request.status : 0,
            data: error.request.data ? error.request.data : "REQUEST_ERROR"
          }
      }
  }else{
      return {
          type: "unknown",
          error: error.message
      }
  }
}

export function ipcMainUtils(ipcMain) {
  ipcMain.on('openBrowser', async (event, arg) => {
    shell.openExternal(arg[0]);
  });

  ipcMain.handle('axiosNativePost', async (event, ...args) => {
        try{
          const result = await API.post(args[0].path, args[0].payload);
          return {
            status: result.status,
            data: result.data
          }
      }catch(e){
        console.log(e.response)
          return {
              data: errorHandler(e),
              error: true
          }
      }  
  });

  ipcMain.handle('getPathCourseResource', async (event, ...args) => {
    return new Promise((resolve) => {
      const finalPath =
        (process.env.NODE_ENV === 'development' ? 'file://' : '') +
        join(app.getAppPath(), `${localPath}/` + args[0]);
      resolve(finalPath);
    });
  });

  ipcMain.handle('getBinaryContent', async (event, ...args) => {
    return new Promise((resolve) => {
      const file = fs.readFileSync(
        join(app.getAppPath(), `${localPath}`, args[0])
      );
      resolve(file);
    });
  });

  ipcMain.handle('isInternetAvailable', async (event, ...args) => {
    const domain = args[0] ? args[0] : "https://google.com";
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
            fs.unlinkSync(join(app.getAppPath(), `${localPath}`, 'fslite.qoc'));
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
        join(app.getAppPath(), `${localPath}`, 'fslite.qoc'),
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
