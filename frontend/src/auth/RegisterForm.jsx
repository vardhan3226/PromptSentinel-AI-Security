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
} from "lucide-react";

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      navigate("/login");
    } catch (err) {
      setError(
        err.message || "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#eef8fb] p-3 sm:p-5 lg:p-6">

      {/* MAIN AUTH CARD */}

      <div className="mx-auto flex min-h-[calc(100vh-24px)] w-full max-w-[1250px] items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-[26px] border border-[#d7e7ed] bg-white shadow-[0_18px_55px_rgba(15,53,72,0.10)] lg:grid-cols-[1fr_1fr]">

          {/* =====================================================
              LEFT — REGISTER
          ====================================================== */}

          <section className="relative flex min-h-[680px] flex-col bg-white px-7 py-7 sm:px-10 lg:px-12">

            {/* HEADER */}

            <div className="flex items-start justify-between">

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
                        setShowConfirmPassword((value) => !value)
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


          {/* =====================================================
              RIGHT — INDIA VISUAL
          ====================================================== */}

          <section className="relative hidden min-h-[680px] overflow-hidden bg-[#f5fbfc] lg:block">

            {/* BACKGROUND */}

            <div className="absolute inset-0 bg-gradient-to-br from-[#eaf8fc] via-white to-[#eef9f1]" />

            <div className="absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-green-200/30 blur-3xl" />

            <div className="absolute -bottom-32 -left-24 h-[360px] w-[360px] rounded-full bg-orange-200/25 blur-3xl" />


            {/* SOFT CURVE */}

            <div className="absolute -right-32 top-20 h-[230px] w-[560px] rotate-[-16deg] rounded-[50%] border-[35px] border-green-200/25" />


            {/* MESSAGE */}

            <div className="absolute left-9 right-9 top-[72px] z-20 rounded-[25px] border border-white/80 bg-white/85 p-7 shadow-[0_12px_35px_rgba(15,53,72,0.07)] backdrop-blur-sm">

              <h2 className="text-[24px] font-black leading-[1.08] tracking-tight text-[#10254d]">

                Empowering

                <br />

                Responsible AI

                <br />

                for a Better India

              </h2>


              <div className="mt-5 flex">

                <span className="h-1.5 w-8 rounded-l-full bg-orange-500" />

                <span className="h-1.5 w-8 bg-slate-100" />

                <span className="h-1.5 w-8 rounded-r-full bg-green-600" />

              </div>

            </div>


            {/* BUILDING */}

            <div className="absolute bottom-[55px] left-1/2 z-10 h-[310px] w-[350px] -translate-x-1/2">

              {/* GROUND */}

              <div className="absolute bottom-0 left-1/2 h-20 w-72 -translate-x-1/2 rounded-full bg-green-300/30 blur-2xl" />


              {/* BUILDING */}

              <div className="absolute bottom-5 left-1/2 h-[165px] w-[245px] -translate-x-1/2 rounded-t-[50%] border-[10px] border-[#d2b47b] bg-[#ead7ac]">

                {/* DOME */}

                <div className="absolute left-1/2 top-[-66px] h-[85px] w-[135px] -translate-x-1/2 rounded-t-full bg-[#d7b77b]" />

                <div className="absolute left-1/2 top-[-76px] h-4 w-4 -translate-x-1/2 rounded-full bg-[#b48a4e]" />


                {/* DOME BASE */}

                <div className="absolute left-1/2 top-[-4px] h-4 w-[160px] -translate-x-1/2 rounded-full bg-[#c69d61]" />


                {/* PILLARS */}

                <div className="absolute bottom-0 left-7 right-7 flex justify-between">

                  <span className="h-[118px] w-5 rounded-t-full bg-[#d1ae6f]" />

                  <span className="h-[118px] w-5 rounded-t-full bg-[#d1ae6f]" />

                  <span className="h-[118px] w-5 rounded-t-full bg-[#d1ae6f]" />

                  <span className="h-[118px] w-5 rounded-t-full bg-[#d1ae6f]" />

                  <span className="h-[118px] w-5 rounded-t-full bg-[#d1ae6f]" />

                </div>


                {/* ENTRANCE */}

                <div className="absolute bottom-0 left-1/2 h-[82px] w-[82px] -translate-x-1/2 rounded-t-full bg-[#f5f8f5]" />

              </div>


              {/* WAVES */}

              <svg
                className="absolute -bottom-10 -left-[125px] h-[220px] w-[600px]"
                viewBox="0 0 600 250"
                preserveAspectRatio="none"
              >

                <path
                  d="M-20 190 C120 100 190 220 315 160 C430 110 500 155 620 55"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="20"
                  opacity="0.27"
                />

                <path
                  d="M-20 215 C120 125 190 245 320 185 C435 135 505 180 620 80"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="23"
                />

                <path
                  d="M-20 240 C120 150 195 270 325 210 C440 160 510 205 620 105"
                  fill="none"
                  stroke="#20a36a"
                  strokeWidth="18"
                  opacity="0.42"
                />

              </svg>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}

export default RegisterForm;