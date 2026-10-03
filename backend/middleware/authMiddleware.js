import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { firebaseAuth } from "../config/firebaseAdmin.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    /*
     * ---------------------------------------------------------
     * 1. Firebase Authentication
     * ---------------------------------------------------------
     */
    try {
      const decodedFirebaseToken =
        await firebaseAuth.verifyIdToken(token);

      const firebaseUid = decodedFirebaseToken.uid;

      let user = await prisma.user.findUnique({
        where: {
          firebaseUid,
        },
      });

      /*
       * Existing Prisma users may not have a Firebase UID yet.
       *
       * Link an existing account only when Firebase confirms
       * that the email address is verified.
       */
      if (!user && decodedFirebaseToken.email) {
        const emailVerified =
          decodedFirebaseToken.email_verified === true;

        if (emailVerified) {
          user = await prisma.user.findUnique({
            where: {
              email: decodedFirebaseToken.email,
            },
          });

          if (user && !user.firebaseUid) {
            user = await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                firebaseUid,
                emailVerified: true,
              },
            });
          }
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User account not found.",
        });
      }

      req.user = user;
      req.authProvider = "firebase";

      return next();
    } catch (firebaseError) {
      /*
       * Firebase verification failed.
       *
       * During the migration, temporarily fall back to the
       * existing JWT authentication so current sessions remain
       * functional.
       */
    }

    /*
     * ---------------------------------------------------------
     * 2. Existing JWT Authentication
     * ---------------------------------------------------------
     */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;
    req.authProvider = "jwt";

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleware;