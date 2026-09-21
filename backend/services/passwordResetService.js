import crypto from "crypto";
import prisma from "../lib/prisma.js";
import { sendPasswordResetEmail } from "./emailService.js";

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const RESET_TOKEN_EXPIRY_MINUTES = 30;

const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

export const requestPasswordReset = async ({ email }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  /*
   * Do not reveal whether an email address is registered.
   * This prevents account enumeration.
   */
  if (!user) {
    return {
      message:
        "If an account exists with this email, a password reset email has been sent.",
    };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetTokenHash = hashToken(resetToken);

  const resetTokenExpiry = new Date(
    Date.now() +
      RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetTokenHash,
      resetTokenExpiry,
    },
  });

  const resetUrl =
    `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(
      resetToken
    )}&email=${encodeURIComponent(user.email)}`;

  try {
    await sendPasswordResetEmail({
      to: user.email,
      fullName: user.fullName,
      resetUrl,
    });
  } catch (error) {
    console.error(
      "Password reset email error:",
      error
    );

    /*
     * Remove the reset token if email delivery failed.
     * This prevents an unusable reset token from remaining
     * active in the database.
     */
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetTokenHash: null,
        resetTokenExpiry: null,
      },
    });

    throw new Error(
      "Unable to send password reset email at this time."
    );
  }

  return {
    message:
      "If an account exists with this email, a password reset email has been sent.",
  };
};

export const resetPassword = async ({
  email,
  token,
  newPassword,
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid or expired password reset link.");
  }

  if (
    !user.resetTokenHash ||
    !user.resetTokenExpiry
  ) {
    throw new Error("Invalid or expired password reset link.");
  }

  if (new Date() > user.resetTokenExpiry) {
    throw new Error("Password reset link has expired.");
  }

  const resetTokenHash = hashToken(token);

  if (resetTokenHash !== user.resetTokenHash) {
    throw new Error("Invalid or expired password reset link.");
  }

  const hashedPassword = await cryptoPassword(newPassword);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetTokenHash: null,
      resetTokenExpiry: null,
    },
  });

  return {
    message:
      "Password reset successfully. You can now log in with your new password.",
  };
};

const cryptoPassword = async (password) => {
  const bcrypt = await import("bcryptjs");

  return bcrypt.default.hash(password, 10);
};