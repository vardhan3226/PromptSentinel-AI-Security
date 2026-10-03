import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Home,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
} from "firebase/auth";

import { auth } from "../config/firebase";
import API_BASE_URL from "../config/api";
import registerIndia from "../assets/images/india/register-india.png";

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.fullName.trim().length < 3) {
      setError(
        "Full name must be at least 3 characters."
      );
      return;
    }

    if (formData.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    let firebaseUser = null;
    let backendRegistrationCompleted = false;

    try {
      setLoading(true);

      const email = formData.email
        .trim()
        .toLowerCase();

      /*
       * 1. Create the authentication account in Firebase.
       */
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          formData.password
        );

      firebaseUser = userCredential.user;

      /*
       * 2. Send Firebase's email verification message.
       */
      await sendEmailVerification(firebaseUser);

      /*
       * 3. Get the Firebase ID token.
       *
       * The account is intentionally still unverified
       * at this point. The backend stores the Prisma
       * account as emailVerified = false.
       */
      const idToken =
        await firebaseUser.getIdToken();

      /*
       * 4. Create the corresponding PromptSentinel
       *    database user.
       */
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName.trim(),
            email,
            password: formData.password,
            idToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      backendRegistrationCompleted = true;

      /*
       * Registration is complete.
       *
       * Firebase has already sent the verification
       * email. The user must verify the email before
       * logging in.
       */
      navigate("/login");
    } catch (err) {
      console.error(
        "Firebase registration error:",
        err
      );

      /*
       * If Firebase registration succeeded but the
       * complete registration flow failed before the
       * backend confirmed success, clean up the newly
       * created Firebase account.
       *
       * The backend also performs cleanup if its Prisma
       * user creation fails.
       */
      if (
        firebaseUser &&
        !backendRegistrationCompleted
      ) {
        try {
          await deleteUser(firebaseUser);
        } catch (cleanupError) {
          /*
           * The backend may already have deleted the
           * Firebase account after a Prisma failure.
           *
           * Cleanup failure should not replace the
           * original registration error shown to the user.
           */
          console.error(
            "Firebase registration cleanup error:",
            cleanupError
          );
        }
      }

      const message = (() => {
        switch (err?.code) {
          case "auth/email-already-in-use":
            return "This email address is already registered.";

          case "auth/invalid-email":
            return "Please enter a valid email address.";

          case "auth/weak-password":
            return "Password must be at least 8 characters.";

          case "auth/operation-not-allowed":
            return "Email and password registration is currently unavailable.";

          case "auth/network-request-failed":
            return "Network error. Please check your internet connection and try again.";

          default:
            return (
              err?.message ||
              "Unable to create your account."
            );
        }
      })();

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#eef8fb] p-3 sm:p-5 lg:p-6">
      {/* MAIN AUTH CARD */}
      <div className="mx-auto flex min-h-[calc(100vh-24px)] w-full max-w-[1250px] items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[26px] border border-[#d7e7ed] bg-white shadow-[0_18px_55px_rgba(15,53,72,0.10)] lg:grid-cols-[1fr_1fr]">
          {/* LEFT — REGISTER */}
          <section className="relative flex min-h-[680px] flex-col bg-white px-7 py-7 sm:px-10 lg:px-12">
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Link
                  to="/home"
                  className="flex items-center gap-2.5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <ShieldCheck
                      size={22}
                      strokeWidth={2}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <div className="text-[16px] font-black tracking-tight text-[#10254d]">
                      Prompt
                      <span className="text-blue-600">
                        Sentinel
                      </span>
                    </div>

                    <div className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      AI SECURITY PLATFORM
                    </div>
                  </div>
                </Link>

                {/* HOME BUTTON */}
                <button
                  type="button"
                  onClick={() => navigate("/home")}
                  aria-label="Go to Home"
                  title="Home"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Home
                    size={17}
                    strokeWidth={2}
                  />
                </button>
              </div>

              {/* MADE IN INDIA */}
              <div className="hidden text-right sm:block">
                <div className="flex justify-end">
                  <span className="h-1.5 w-5 rounded-l-full bg-orange-500" />
                  <span className="h-1.5 w-5 border-y border-slate-100 bg-white" />
                  <span className="h-1.5 w-5 rounded-r-full bg-green-600" />
                </div>

                <p className="mt-1 text-[8px] font-bold tracking-wide text-slate-600">
                  MADE IN INDIA
                </p>

                <p className="text-[6px] font-medium uppercase tracking-wide text-slate-400">
                  FOR A SAFER AI WORLD
                </p>
              </div>
            </div>

            {/* REGISTER CONTENT */}
            <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center">
              <h1 className="text-[30px] font-black tracking-tight text-[#10254d] sm:text-[34px]">
                Create Your Account
              </h1>

              <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
                Join PromptSentinel and help build a safer AI world.
              </p>

              {/* ERROR */}
              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-3.5"
              >
                {/* FULL NAME */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={16}
                      strokeWidth={1.8}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      autoComplete="name"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={16}
                      strokeWidth={1.8}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      autoComplete="email"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      strokeWidth={1.8}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      autoComplete="new-password"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      strokeWidth={1.8}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* TERMS */}
                <label className="flex cursor-pointer items-start gap-2 pt-0.5 text-[10px] leading-4 text-slate-500">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  <span>
                    I agree to the{" "}
                    <span className="font-semibold text-blue-600">
                      Terms
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-blue-600">
                      Privacy Policy
                    </span>
                  </span>
                </label>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-[12px] font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* LOGIN LINK */}
              <p className="mt-5 text-center text-[10px] text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Login
                </Link>
              </p>
            </div>
          </section>

          {/* RIGHT — INDIA VISUAL */}
          <section className="relative hidden min-h-[680px] overflow-hidden bg-[#f5fbfc] lg:block">
            <img
              src={registerIndia}
              alt="Red Fort representing Indian innovation and responsible AI"
              className="h-full w-full object-cover"
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;