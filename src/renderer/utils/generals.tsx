import sha256 from 'crypto-js/sha256';

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
  return sha256(str);
}
