"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "../config";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthPageProps {
  isSignin: boolean;
}

export default function AuthPage({ isSignin }: AuthPageProps) {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const emailRef    = useRef<HTMLInputElement | null>(null);
  const router      = useRouter();

  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function authHandler() {
    setError("");
    setLoading(true);
    const email    = emailRef.current?.value?.trim();
    const password = passwordRef.current?.value;
    const username = usernameRef.current?.value?.trim();

    try {
      if (!isSignin) {
        await axios.post(`${HTTP_BACKEND}/users/signup`, { email, password, username });
        router.push("/signin");
      } else {
        const { data } = await axios.post(`${HTTP_BACKEND}/users/signin`, { email, password });
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") authHandler();
  };

  return (
    <div
      className="relative bg-[#0d0d0f] min-h-screen w-screen flex items-center justify-center px-5 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-card { animation: fadeUp 0.55s ease both 0.05s; }

        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 10px 14px;
          color: rgba(255,255,255,0.85);
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .auth-input::placeholder { color: rgba(255,255,255,0.2); }
        .auth-input:focus {
          border-color: rgba(99,102,241,0.6);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .auth-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 6px;
          font-family: 'DM Mono', monospace;
        }

        .auth-btn {
          width: 100%;
          padding: 11px;
          background: #6366f1;
          color: white;
          border-radius: 10px;
          font-weight: 500;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .auth-btn:hover:not(:disabled) {
          background: #818cf8;
          transform: translateY(-1px);
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
        }
        .auth-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }} />

      {/* Ambient glow */}
      <div className="absolute top-[-80px] left-[40%] w-[400px] h-[400px] rounded-full bg-indigo-700/10 blur-[120px] pointer-events-none -translate-x-1/2" />

      {/* Card */}
      <div
        className="auth-card relative w-full max-w-sm rounded-2xl border border-white/[0.08] p-8"
        style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)" }}
      >
        {/* Logo mark */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7 Q5 2 7 7 Q9 12 12 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <span className="text-white/60 text-sm font-medium tracking-wide">Canvas</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-light text-white mb-1 tracking-tight">
          {isSignin ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-white/30 text-sm mb-8">
          {isSignin
            ? "Sign in to your workspace."
            : "Start drawing with your team."}
        </p>

        {/* Fields */}
        <div className="flex flex-col gap-5" onKeyDown={handleKeyDown}>
          <div>
            <label className="auth-label">Email</label>
            <input ref={emailRef} type="email" className="auth-input" placeholder="you@example.com" />
          </div>

          <div>
            <label className="auth-label">Password</label>
            <input ref={passwordRef} type="password" className="auth-input" placeholder="••••••••" />
          </div>

          {!isSignin && (
            <div>
              <label className="auth-label">Username</label>
              <input ref={usernameRef} type="text" className="auth-input" placeholder="yourname" />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={authHandler}
          disabled={loading}
          className="auth-btn mt-6"
        >
          {loading
            ? "Please wait…"
            : isSignin ? "Sign in" : "Create account"}
        </button>

        {/* Toggle link */}
        <p className="mt-5 text-center text-white/25 text-sm">
          {isSignin ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={isSignin ? "/signup" : "/signin"}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {isSignin ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}