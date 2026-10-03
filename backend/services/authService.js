import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import prisma from "../lib/prisma.js";
import { sendVerificationEmail } from "./emailService.js";
import { firebaseAuth } from "../config/firebaseAdmin.js";

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

/*
 * Firebase registration
 *
 * Firebase is responsible for:
 * - Password authentication
 * - Email verification
 *
 * Prisma remains responsible for:
 * - Application user record
 * - Existing user ID
 * - Role
 * - Prompt scans
 * - AI conversations
 *
 * The password field is retained in Prisma for legacy
 * compatibility. A random bcrypt hash is stored because
 * Firebase is the actual authentication authority for
 * Firebase-created accounts.
 */
export const registerFirebaseUser = async ({
  fullName,
  email,
  idToken,
}) => {
  if (!idToken) {
    throw new Error(
      "Firebase authentication token is required."
    );
  }

  if (!fullName || fullName.trim().length < 3) {
    throw new Error(
      "Full name must be at least 3 characters."
    );
  }

  if (!email) {
    throw new Error("Email address is required.");
  }

  let decodedToken;

  try {
    decodedToken =
      await firebaseAuth.verifyIdToken(idToken);
  } catch (error) {
    console.error(
      "Firebase registration token verification error:",
      error
    );

    throw new Error(
      "Invalid Firebase authentication token."
    );
  }

  const firebaseUid = decodedToken.uid;

  const firebaseEmail =
    decodedToken.email?.trim().toLowerCase();

  const submittedEmail =
    String(email).trim().toLowerCase();

  if (!firebaseUid || !firebaseEmail) {
    throw new Error(
      "Firebase account information is incomplete."
    );
  }

  /*
   * The email submitted by the frontend must match
   * the email authenticated by Firebase.
   */
  if (firebaseEmail !== submittedEmail) {
    throw new Error(
      "Firebase account email does not match the registered email address."
    );
  }

  /*
   * At initial registration, Firebase email verification
   * has normally not happened yet.
   *
   * Therefore, DO NOT require email_verified === true here.
   *
   * Firebase will send the verification email. The login
   * flow will verify the Firebase emailVerified state before
   * allowing access.
   */
  const emailVerified =
    decodedToken.email_verified === true;

  const existingFirebaseUser =
    await prisma.user.findUnique({
      where: {
        firebaseUid,
      },
    });

  if (existingFirebaseUser) {
    throw new Error(
      "Firebase account is already registered."
    );
  }

  const existingEmailUser =
    await prisma.user.findUnique({
      where: {
        email: firebaseEmail,
      },
    });

  if (existingEmailUser) {
    throw new Error(
      "Email is already registered."
    );
  }

  /*
   * Prisma currently requires the password field.
   *
   * Firebase is the real password authority for this
   * account. This random bcrypt hash exists only for
   * legacy database compatibility.
   */
  const compatibilityPassword =
    await bcrypt.hash(
      crypto.randomBytes(32).toString("hex"),
      10
    );

  let user;

  try {
    user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: firebaseEmail,
        firebaseUid,
        password: compatibilityPassword,

        emailVerified,

        /*
         * Firebase handles email verification for
         * Firebase-created accounts, so the old
         * application verification-token fields are
         * not used for this registration path.
         */
        verificationTokenHash: null,
        verificationTokenExpiry: null,
      },
    });
  } catch (error) {
    /*
     * The Firebase account was created by the frontend
     * immediately before this backend registration call.
     *
     * If the Prisma record cannot be created, remove the
     * newly-created Firebase account so the user is not
     * left with an orphaned Firebase account.
     */
    try {
      await firebaseAuth.deleteUser(firebaseUid);
    } catch (cleanupError) {
      console.error(
        "Firebase registration cleanup error:",
        cleanupError
      );
    }

    console.error(
      "Firebase Prisma user creation error:",
      error
    );

    throw new Error(
      "Unable to create the PromptSentinel account."
    );
  }

  return {
    message: emailVerified
      ? "Registration successful. Your email has been verified through Firebase."
      : "Registration successful. Please check your email and verify your account before logging in.",

    requiresEmailVerification:
      !emailVerified,

    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      firebaseUid: user.firebaseUid,
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

/*
 * Firebase login
 *
 * The frontend authenticates the user's email and
 * password directly with Firebase.
 *
 * The resulting Firebase ID token is sent here.
 *
 * Firebase Admin verifies the token and retrieves the
 * authoritative Firebase user record.
 *
 * Prisma is then used to locate the corresponding
 * PromptSentinel application user.
 */
export const loginFirebaseUser = async ({
  idToken,
}) => {
  if (!idToken) {
    throw new Error(
      "Firebase authentication token is required."
    );
  }

  let decodedToken;

  try {
    decodedToken =
      await firebaseAuth.verifyIdToken(idToken);
  } catch (error) {
    console.error(
      "Firebase login token verification error:",
      error
    );

    throw new Error(
      "Invalid or expired Firebase authentication token."
    );
  }

  const firebaseUid = decodedToken.uid;

  if (!firebaseUid) {
    throw new Error(
      "Firebase account information is incomplete."
    );
  }

  /*
   * Get the authoritative Firebase user record.
   *
   * This avoids relying only on a potentially stale
   * email_verified claim from the ID token.
   */
  let firebaseUser;

  try {
    firebaseUser =
      await firebaseAuth.getUser(firebaseUid);
  } catch (error) {
    console.error(
      "Firebase user lookup error:",
      error
    );

    throw new Error(
      "Unable to verify the Firebase account."
    );
  }

  if (!firebaseUser.email) {
    throw new Error(
      "Firebase account email is unavailable."
    );
  }

  const firebaseEmail =
    firebaseUser.email.trim().toLowerCase();

  /*
   * Email verification is mandatory before application
   * access is granted.
   */
  if (!firebaseUser.emailVerified) {
    throw new Error(
      "Please verify your email address before logging in."
    );
  }

  /*
   * Firebase-created accounts must already have a
   * corresponding PromptSentinel user record.
   */
  let user = await prisma.user.findUnique({
    where: {
      firebaseUid,
    },
  });

  /*
   * Do not silently create a new application account
   * during login.
   */
  if (!user) {
    throw new Error(
      "PromptSentinel account not found. Please complete registration first."
    );
  }

  /*
   * Confirm the Firebase email still matches the
   * PromptSentinel account.
   */
  if (
    user.email.trim().toLowerCase() !==
    firebaseEmail
  ) {
    throw new Error(
      "Firebase account email does not match the PromptSentinel account."
    );
  }

  /*
   * Synchronize Firebase verification state with Prisma.
   */
  if (!user.emailVerified) {
    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
      },
    });
  }

  return {
    message: "Login successful.",

    /*
     * The Firebase ID token becomes the authenticated
     * token used by the frontend for protected API calls.
     */
    token: idToken,

    authProvider: "firebase",

    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      firebaseUid: user.firebaseUid,
    },
  };
};

/*
 * Legacy JWT login
 *
 * Kept temporarily during the Firebase migration.
 */
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