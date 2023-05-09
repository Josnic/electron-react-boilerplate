export const validateEmail = (email) => {
    const pattern = "^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
    let regex = new RegExp(pattern);
    return regex.test(email);
  };