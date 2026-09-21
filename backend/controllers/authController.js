import crypto from "crypto";

import {
  registerUser,
  loginUser,
  resendVerificationEmail,
} from "../services/authService.js";

import {
  requestPasswordReset,
  resetPassword,
} from "../services/passwordResetService.js";

import prisma from "../lib/prisma.js";

import {
  validateRegister,
  validateLogin,
} from "../validations/authValidation.js";

const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

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

export const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: "Verification token and email are required.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: String(email).toLowerCase(),
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (user.emailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified.",
      });
    }

    if (
      !user.verificationTokenHash ||
      !user.verificationTokenExpiry
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Verification token is invalid or no longer available.",
      });
    }

    if (new Date() > user.verificationTokenExpiry) {
      return res.status(400).json({
        success: false,
        message:
          "Verification token has expired. Please request a new verification email.",
      });
    }

    const hashedToken = hashToken(String(token));

    if (hashedToken !== user.verificationTokenHash) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token.",
      });
    }

    const verifiedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
        verificationTokenHash: null,
        verificationTokenExpiry: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      user: {
        id: verifiedUser.id,
        fullName: verifiedUser.fullName,
        email: verifiedUser.email,
        role: verifiedUser.role,
        emailVerified: verifiedUser.emailVerified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify email at this time.",
    });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const result = await resendVerificationEmail({
      email: String(email).trim().toLowerCase(),
    });

    return res.status(200).json({
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

/*
 * Request password reset
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const result = await requestPasswordReset({
      email: String(email).trim().toLowerCase(),
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request at this time.",
    });
  }
};

/*
 * Reset password using reset token
 */
export const changePassword = async (req, res) => {
  try {
    const {
      email,
      token,
      newPassword,
    } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Email, reset token, and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 8 characters long.",
      });
    }

    const result = await resetPassword({
      email: String(email).trim().toLowerCase(),
      token: String(token),
      newPassword,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Password reset error:", error);

    return res.status(400).json({
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