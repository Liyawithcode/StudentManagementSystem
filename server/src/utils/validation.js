export const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  // Simple validation for phone numbers (at least 7 digits, digits and optional leading +)
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password) => {
  // At least 6 characters
  return typeof password === "string" && password.length >= 6;
};

export default {
  isValidEmail,
  isValidPhone,
  isValidPassword,
};
