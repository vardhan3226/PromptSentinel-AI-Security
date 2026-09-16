import {
  registerUser,
  loginUser,
} from "../services/authService.js";

import {
  validateRegister,
  validateLogin,
} from "../validations/authValidation.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const validation = validateRegister({
      fullName,
      email,
      password,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    const result = await registerUser({
      fullName,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validation = validateLogin({
      email,
      password,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    const result = await loginUser({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
};