import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your email address..."
  );

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setStatus("error");
        setMessage(
          "Invalid verification link. The verification token or email is missing."
        );
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/auth/verify-email?token=${encodeURIComponent(
            token
          )}&email=${encodeURIComponent(email)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          setStatus("error");
          setMessage(
            data.message || "Email verification failed."
          );
          return;
        }

        setStatus("success");
        setMessage(
          data.message || "Email verified successfully."
        );
      } catch (error) {
        console.error("Email verification error:", error);

        setStatus("error");
        setMessage(
          "Unable to connect to the server. Please try again."
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-dvh bg-[#f6f9fc] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        {status === "verifying" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-[#0b1f3a]" />
            </div>

            <h1 className="text-2xl font-bold text-[#0b1f3a]">
              Verifying Email
            </h1>

            <p className="mt-3 text-slate-600">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl text-green-600">
                ✓
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#0b1f3a]">
              Email Verified
            </h1>

            <p className="mt-3 text-slate-600">
              {message}
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#0b1f3a] px-5 py-3 font-semibold text-white transition hover:bg-[#12345f]"
            >
              Continue to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-3xl text-red-600">
                !
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#0b1f3a]">
              Verification Failed
            </h1>

            <p className="mt-3 text-slate-600">
              {message}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#0b1f3a] px-5 py-3 font-semibold text-white transition hover:bg-[#12345f]"
              >
                Go to Login
              </Link>

              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold text-[#0b1f3a] transition hover:bg-slate-50"
              >
                Back to Register
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;