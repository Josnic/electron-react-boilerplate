export const validateEmail = (email) => {
    const pattern = "^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
    let regex = new RegExp(pattern);
    return regex.test(email);
  };

  export const getMysqlDate = () =>{
    const d = new Date();
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0];
    return date + " " + time
  }