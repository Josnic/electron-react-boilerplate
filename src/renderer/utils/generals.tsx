import sha256 from 'crypto-js/sha256';
import MD5 from 'crypto-js/md5';
import { MIME_TYPES_DATABASE } from './mimedb';

export const validateEmail = (email) => {
  const pattern = '^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  let regex = new RegExp(pattern);
  return regex.test(email);
};

export const getMysqlDate = () => {
  const d = new Date();
  const date = d.toISOString().split('T')[0];
  const time = d.toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0];
  return date + ' ' + time;
};

export const formatDate = (d) => {
  const date = d.toISOString().split('T')[0];
  const time = d.toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0];
  return date
}

export const base64Encode = (str) => {
  return btoa(str);
}

export const base64Decode = (str) => {
  return atob(str);
}

export const sha256Encode = (str) => {
  return sha256(str).toString();
}

export const md5Encode = (str) => {
  return MD5(str).toString();
}

export const getMimeType = (fileExtension) => {
  let resultMimeType = 'application/octet-stream';
  const arKeys = Object.keys(MIME_TYPES_DATABASE);
  for(let i = 0; i < arKeys.length; i++) {
    if (MIME_TYPES_DATABASE[arKeys[i]].extensions && Array.isArray(MIME_TYPES_DATABASE[arKeys[i]].extensions)) {
      if (MIME_TYPES_DATABASE[arKeys[i]].extensions.includes(fileExtension)) {
        resultMimeType = arKeys[i];
        i = arKeys.length;
      }
    }
  }
  return resultMimeType;
}