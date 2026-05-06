import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logInUser } from "../../../services/authService";
import { supabase } from "../../../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Forgot password state
  const [forgotMode, setForgotMode] = useState<"none" | "email" | "sent">("none");
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const f = e.target as HTMLFormElement;
    const email = f.email.value.trim();
    const password = f.password.value;

    if (!email || !password) {
      setErrorMsg("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const result = await logInUser(email, password);

    if (result.error) {
      setErrorMsg(result.error);
      setLoading(false);
      return;
    }

    const roles = result.roles || [];

    if (roles.includes("employer") && !roles.includes("seeker")) {
      navigate("/EmployerDashboard");
    } else {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  const handleSendReset = async () => {
    if (!resetEmail.trim()) {
      setResetMsg("Please enter your email address.");
      return;
    }
    setResetLoading(true);
    setResetMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: window.location.origin + "/login",
    });
    setResetLoading(false);
    if (error) {
      setResetMsg(error.message);
    } else {
      setForgotMode("sent");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gray-950 p-12">
        <div className="text-white text-xl font-bold tracking-tight">Workify</div>
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Find work.<br />Hire talent.<br />Move forward.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Kenya's unified platform for corporate professionals and casual workers.
          </p>
          <div className="mt-10 flex flex-col gap-6">
            {[["48K+", "Active listings"], ["120K+", "Registered workers"], ["8,400", "Employers hiring"]].map(([n, l]) => (
              <div key={l} className="border-l-2 border-gray-700 pl-4">
                <div className="text-2xl font-bold text-white font-mono">{n}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-600">© 2025 Workify · Kenya</div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-xl font-bold text-gray-900 mb-8">Workify</div>

          {/* ── Forgot Password: Enter Email ── */}
          {forgotMode === "email" && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Reset your password</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your email and we'll send you a recovery link.</p>

              {resetMsg && (
                <div className="bg-red-50 border-l-4 border-red-500 px-4 py-2.5 text-xs text-red-700 mb-4">{resetMsg}</div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className="w-full h-11 border border-gray-200 px-3 text-sm text-gray-900 outline-none focus:border-gray-900 transition placeholder:text-gray-400"
                  />
                </div>
                <button
                  onClick={handleSendReset}
                  disabled={resetLoading}
                  className="w-full h-11 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {resetLoading ? "Sending..." : "Send Recovery Link →"}
                </button>
                <button
                  onClick={() => { setForgotMode("none"); setResetMsg(""); }}
                  className="w-full text-center text-sm text-gray-400 hover:text-gray-700 mt-2"
                >
                  ← Back to Sign In
                </button>
              </div>
            </>
          )}

          {/* ── Forgot Password: Sent Confirmation ── */}
          {forgotMode === "sent" && (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">Check your email</h2>
              <p className="text-sm text-gray-500 mb-2 text-center">
                We've sent a password recovery link to:
              </p>
              <p className="text-sm font-semibold text-gray-900 text-center mb-6 font-mono">{resetEmail}</p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
                <p className="text-xs text-amber-800 m-0 leading-relaxed">
                  Click the link in the email to reset your password. If you don't see it, check your spam folder. The link expires in 1 hour.
                </p>
              </div>
              <button
                onClick={() => { setForgotMode("none"); setResetEmail(""); setResetMsg(""); }}
                className="w-full h-11 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition flex items-center justify-center"
              >
                ← Back to Sign In
              </button>
            </>
          )}

          {/* ── Normal Login Form ── */}
          {forgotMode === "none" && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
              <p className="text-sm text-gray-500 mb-8">Sign in to your account to continue.</p>

              {errorMsg && (
                <div className="bg-red-50 border-l-4 border-red-500 px-4 py-2.5 text-xs text-red-700 mb-4">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-1.5">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full h-11 border border-gray-200 px-3 text-sm text-gray-900 outline-none focus:border-gray-900 transition placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotMode("email")}
                      className="text-xs text-gray-400 hover:text-gray-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      name="password"
                      type={show ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full h-11 border border-gray-200 px-3 pr-14 text-sm text-gray-900 outline-none focus:border-gray-900 transition placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono"
                    >
                      {show ? "hide" : "show"}
                    </button>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-gray-900 w-4 h-4" />
                  <span className="text-sm text-gray-600">Remember me for 30 days</span>
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span
                        style={{
                          width: 14, height: 14,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          display: "inline-block",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                      Signing in…
                    </>
                  ) : (
                    "Sign in →"
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{" "}
                <Link to="/signup">
                  <button className="text-gray-900 font-semibold hover:underline">
                    Create one free
                  </button>
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}