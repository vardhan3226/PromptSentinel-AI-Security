import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import prisma from "../lib/prisma.js";
import { sendVerificationEmail } from "./emailService.js";

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const VERIFICATION_TOKEN_EXPIRY_HOURS = 24;

const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const getVerificationExpiry = () => {
  return new Date(
    Date.now() +
      VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
  );
};

const buildVerificationUrl = ({
  email,
  verificationToken,
}) => {
  return `${FRONTEND_URL}/verify-email?token=${encodeURIComponent(
    verificationToken
  )}&email=${encodeURIComponent(email)}`;
};

export const registerUser = async ({
  fullName,
  email,
  password,
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email is already registered.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = generateVerificationToken();

  const verificationTokenHash =
    hashToken(verificationToken);

  const verificationTokenExpiry =
    getVerificationExpiry();

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,

      emailVerified: false,
      verificationTokenHash,
      verificationTokenExpiry,
    },
  });

  const verificationUrl = buildVerificationUrl({
    email: user.email,
    verificationToken,
  });

  try {
    await sendVerificationEmail({
      to: user.email,
      fullName: user.fullName,
      verificationUrl,
    });
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    throw new Error(
      "Registration could not be completed because the verification email could not be sent."
    );
  }

  return {
    message:
      "Registration successful. Please check your email to verify your account.",

    requiresEmailVerification: true,

    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  };
};

export const resendVerificationEmail = async ({
  email,
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error(
      "If an account exists with this email, a verification email will be sent."
    );
  }

  if (user.emailVerified) {
    throw new Error(
      "This email address is already verified."
    );
  }

  const verificationToken = generateVerificationToken();

  const verificationTokenHash =
    hashToken(verificationToken);

  const verificationTokenExpiry =
    getVerificationExpiry();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      verificationTokenHash,
      verificationTokenExpiry,
    },
  });

  const verificationUrl = buildVerificationUrl({
    email: user.email,
    verificationToken,
  });

  try {
    await sendVerificationEmail({
      to: user.email,
      fullName: user.fullName,
      verificationUrl,
    });
  } catch (error) {
    console.error(
      "Resend verification email error:",
      error
    );

    throw new Error(
      "Unable to send verification email at this time."
    );
  }

  return {
    message:
      "If the account exists and is not verified, a new verification email has been sent.",
  };
};

export const loginUser = async ({
  email,
  password,
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  if (!user.emailVerified) {
    throw new Error(
      "Please verify your email address before logging in."
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    message: "Login successful.",
    token,

    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  };
};