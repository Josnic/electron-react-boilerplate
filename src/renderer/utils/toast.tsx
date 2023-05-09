import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message: string, type: string = "warning", callbackOpen = undefined, callbackClose = undefined) => {
    toast(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      type: type,
      onOpen: () => {
        if (typeof callbackOpen == "function"){
          callbackOpen();
        }
      },
      onClose: () => {
        if (typeof callbackClose == "function"){
          callbackClose();
        }
      }
    });
}