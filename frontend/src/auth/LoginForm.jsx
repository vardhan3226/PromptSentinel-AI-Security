import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Home,
} from "lucide-react";
import {
  reload,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import API_BASE_URL from "../config/api";
import { auth } from "../config/firebase";
import loginIndia from "../assets/images/india/login-india.png";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      /*
       * 1. Authenticate with Firebase
       */
      const credential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

      const firebaseUser = credential.user;

      /*
       * 2. Refresh Firebase user information so that
       *    emailVerified is current.
       */
      await reload(firebaseUser);

      /*
       * 3. Do not allow unverified Firebase users
       *    to continue into PromptSentinel.
       */
      if (!firebaseUser.emailVerified) {
        await signOut(auth);

        throw new Error(
          "Please verify your email address before logging in."
        );
      }

      /*
       * 4. Get a fresh Firebase ID token.
       */
      const idToken = await firebaseUser.getIdToken(true);

      /*
       * 5. Send the Firebase token to the PromptSentinel
       *    backend. The backend verifies the token with
       *    Firebase Admin and maps it to the Prisma user.
       */
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password,
            idToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      /*
       * The backend returns the Firebase ID token.
       * Existing protected API requests continue using
       * localStorage("token").
       */
      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      let message;

      switch (err?.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          message = "Invalid email or password.";
          break;

        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;

        case "auth/user-disabled":
          message =
            "This account has been disabled. Please contact support.";
          break;

        case "auth/too-many-requests":
          message =
            "Too many login attempts. Please try again later.";
          break;

        case "auth/network-request-failed":
          message =
            "Network error. Please check your internet connection and try again.";
          break;

        default:
          message =
            err?.message || "Unable to login.";
      }

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
          {/* LEFT — LOGIN */}
          <section className="relative flex min-h-[680px] flex-col bg-white px-7 py-7 sm:px-10 lg:px-12">
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* HOME BUTTON */}
                <button
                  type="button"
                  onClick={() => navigate("/home")}
                  aria-label="Go to Home"
                  title="Home"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Home size={18} strokeWidth={2} />
                </button>

                {/* LOGO */}
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

            {/* LOGIN CONTENT */}
            <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center">
              <h1 className="text-[32px] font-black tracking-tight text-[#10254d] sm:text-[36px]">
                Welcome Back
              </h1>

              <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
                Continue to your secure workspace.
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
                className="mt-7 space-y-4"
              >
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      autoComplete="current-password"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
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

                {/* REMEMBER / FORGOT */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex cursor-pointer items-center gap-2 text-[10px] text-slate-500">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[10px] font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-[12px] font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Login
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* REGISTER LINK */}
              <p className="mt-5 text-center text-[10px] text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Register
                </Link>
              </p>
            </div>
          </section>

          {/* RIGHT — INDIA VISUAL */}
          <section className="relative hidden min-h-[680px] overflow-hidden bg-[#f5fbfc] lg:block">
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#eaf8fc] via-white to-[#eef9f1]" />

            <div className="absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-green-200/30 blur-3xl" />

            <div className="absolute -bottom-32 -left-24 h-[360px] w-[360px] rounded-full bg-orange-200/25 blur-3xl" />

            {/* SOFT DECORATIVE CURVE */}
            <div className="absolute right-[-120px] top-[70px] h-[220px] w-[520px] rotate-[-16deg] rounded-[50%] border-[35px] border-green-200/25" />

            {/* QUOTE CARD */}
            <div className="absolute left-9 right-9 top-[72px] z-20 rounded-[25px] border border-white/60 bg-white/25 p-7 shadow-[0_12px_35px_rgba(15,53,72,0.05)] backdrop-blur-[2px]">
              <h2 className="max-w-[300px] text-[25px] font-black leading-[1.08] tracking-tight text-[#10254d]">
                “Safe AI
                <br />
                builds a brighter
                <br />
                India.”
              </h2>

              {/* TRICOLOR */}
              <div className="mt-5 flex">
                <span className="h-1.5 w-8 rounded-l-full bg-orange-500" />
                <span className="h-1.5 w-8 bg-slate-100" />
                <span className="h-1.5 w-8 rounded-r-full bg-green-600" />
              </div>

              <div className="mt-5 space-y-0.5 text-[10px] font-medium leading-4 text-slate-600">
                <p>Analyze.</p>
                <p>Detect.</p>
                <p>Protect.</p>
              </div>
            </div>

            {/* INDIA VISUAL IMAGE */}
            <div className="absolute inset-0 z-10">
              <img
                src={loginIndia}
                alt="Taj Mahal representing Indian innovation and responsible AI"
                className="h-full w-full object-cover"
              />

              {/* RESPONSIBLE AI BACKDROP */}
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
                <span className="whitespace-nowrap text-[72px] font-black uppercase tracking-[0.18em] text-white/20 drop-shadow-[0_2px_18px_rgba(15,53,72,0.18)] sm:text-[88px]">
                  RESPONSIBLE AI
                </span>
              </div>

              {/* Soft readability overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#eef9f1]/35 via-transparent to-white/10" />

              {/* Subtle cinematic glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-green-400/10" />
            </div>

            {/* SMALL BIRDS */}
            <div className="absolute right-20 top-[245px] text-[13px] text-slate-400">
              ︵ ︵
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;