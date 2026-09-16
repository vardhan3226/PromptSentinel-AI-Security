import validator from "validator";

export const validateRegister = ({ fullName, email, password }) => {
  const errors = [];

  if (!fullName || fullName.trim().length < 3) {
    errors.push("Full name must be at least 3 characters.");
  }

  if (!email || !validator.isEmail(email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateLogin = ({ email, password }) => {
  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!password) {
    errors.push("Password is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};