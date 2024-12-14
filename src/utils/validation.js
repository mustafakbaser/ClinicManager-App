export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePhone = (phone) => {
    const re = /^[0-9]{10,11}$/;
    return re.test(phone);
  };
  
  export const validateTckn = (tckn) => {
    const re = /^[0-9]{11}$/;
    return re.test(tckn);
  };
  
  export const validateRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  };