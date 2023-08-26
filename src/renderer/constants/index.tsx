export const userApi = "userSerial";
export const tokenApi = "0febaed7a8fe0951fefd618b176e34d483082e12";

export const BAD_REQUEST_ERRORS =  ["INACTIVE", "NO_CONTENT", "ALL_ACTIVATIONS"];

export const range = (start, end) => {
    var ans = [];
    for (let i = start; i <= end; i++) {
      ans.push(i);
    }
    return ans;
};

export const years = range(1920, new Date().getFullYear() + 1, 1);

export const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Novimbre',
  'Diciembre',
];