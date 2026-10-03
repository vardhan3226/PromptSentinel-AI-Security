import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseServiceAccountBase64 =
  process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (!firebaseServiceAccountBase64) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_BASE64 is not configured."
  );
}

let serviceAccount;

try {
  const serviceAccountJson = Buffer.from(
    firebaseServiceAccountBase64,
    "base64"
  ).toString("utf8");

  serviceAccount = JSON.parse(serviceAccountJson);
} catch (error) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_BASE64 contains invalid credentials."
  );
}

const firebaseApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

export const firebaseAuth = getAuth(firebaseApp);
export default firebaseApp;