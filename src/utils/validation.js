// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) => emailRegex.test(email);

export const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  if (!isValidEmail(email)) return "Please enter a valid email";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

export const validatePasswordMatch = (password, repeatPassword) => {
  if (!repeatPassword) return "Please confirm your password";
  if (password !== repeatPassword) return "Passwords do not match";
  return null;
};

export const validateName = (name) => {
  if (!name.trim()) return "Name is required";
  return null;
};

export const validatePhone = (phoneNumber) => {
  if (phoneNumber && isNaN(phoneNumber))
    return "Please enter a valid phone number";
  return null;
};
