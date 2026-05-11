"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoIcon, GoogleIcon, GithubIcon } from "@/components/icons";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) setError(oauthError);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      router.push("/dashboard");
    } catch { setError("Something went wrong."); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-brand-200/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-mint-200/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-5">
            <LogoIcon className="w-10 h-10 mx-auto" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create your account</h1>
          <p className="text-slate-400 text-sm mt-1">Start deploying in minutes</p>
        </div>

        <div className="glass-strong rounded-2xl p-6 shadow-lg shadow-slate-200/50">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-2.5 rounded-xl text-sm mb-5">
              {error}
            </div>
          )}

          <div className="space-y-2.5 mb-5">
            <a href="/api/auth/google" className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-sm font-medium transition-colors border border-slate-200 shadow-sm">
              <GoogleIcon className="w-4 h-4" />
              Sign up with Google
            </a>
            <a href="/api/auth/github" className="w-full flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
              <GithubIcon className="w-4 h-4" />
              Sign up with GitHub
            </a>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-[11px] uppercase tracking-widest font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-slate-500">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-300"
                placeholder="John Doe" required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-slate-500">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-300"
                placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-slate-500">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-300"
                placeholder="Min 6 characters" minLength={6} required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
