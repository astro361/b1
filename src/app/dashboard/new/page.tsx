"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoIcon, ArrowRightIcon } from "@/components/icons";

const runtimes = [
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "ruby", label: "Ruby" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
];

const regions = [
  { value: "us-east-1", label: "US East" },
  { value: "us-west-2", label: "US West" },
  { value: "eu-west-1", label: "EU West" },
  { value: "eu-central-1", label: "EU Central" },
  { value: "ap-southeast-1", label: "Asia SE" },
  { value: "ap-northeast-1", label: "Asia NE" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", repoUrl: "", runtime: "nodejs",
    buildCommand: "npm run build", startCommand: "npm start",
    branch: "main", port: "3000", region: "us-east-1",
  });

  const updateRuntime = (runtime: string) => {
    const d: Record<string, { build: string; start: string; port: string }> = {
      nodejs: { build: "npm run build", start: "npm start", port: "3000" },
      python: { build: "pip install -r requirements.txt", start: "python app.py", port: "8000" },
      go: { build: "go build -o app .", start: "./app", port: "8080" },
      ruby: { build: "bundle install", start: "ruby app.rb", port: "4567" },
      rust: { build: "cargo build --release", start: "./target/release/app", port: "8080" },
      java: { build: "mvn package", start: "java -jar target/app.jar", port: "8080" },
    };
    const c = d[runtime] || d.nodejs;
    setForm({ ...form, runtime, buildCommand: c.build, startCommand: c.start, port: c.port });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      router.push(`/dashboard/projects/${data.project.id}`);
    } catch { setError("Something went wrong."); } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-300";

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="glass-strong border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
          <Link href="/dashboard"><LogoIcon className="w-7 h-7" /></Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 text-sm font-medium">New Project</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Project</h1>
          <p className="text-slate-400 text-sm mt-0.5">Configure your backend deployment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-2.5 rounded-xl text-sm">{error}</div>
          )}

          <div className="glass-strong rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">Project Info</h2>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-slate-500">Name <span className="text-rose-400">*</span></label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="my-awesome-api" required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-slate-500">Repository URL <span className="text-slate-300">optional</span></label>
              <input type="url" value={form.repoUrl} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} className={inputCls} placeholder="https://github.com/user/repo" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-slate-500">Branch</label>
              <input type="text" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} className={inputCls} placeholder="main" />
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">Runtime & Build</h2>
            <div>
              <label className="block text-xs font-medium mb-2 text-slate-500">Runtime <span className="text-rose-400">*</span></label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {runtimes.map((r) => (
                  <button key={r.value} type="button" onClick={() => updateRuntime(r.value)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${form.runtime === r.value ? "bg-brand-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-600"}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-slate-500">Build Command</label>
                <input type="text" value={form.buildCommand} onChange={(e) => setForm({ ...form, buildCommand: e.target.value })} className={`${inputCls} font-mono text-xs`} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-slate-500">Start Command</label>
                <input type="text" value={form.startCommand} onChange={(e) => setForm({ ...form, startCommand: e.target.value })} className={`${inputCls} font-mono text-xs`} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-slate-500">Port</label>
                <input type="number" value={form.port} onChange={(e) => setForm({ ...form, port: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-slate-500">Region</label>
                <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputCls}>
                  {regions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">Cancel</Link>
            <button type="submit" disabled={loading}
              className="bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2">
              {loading ? "Creating..." : "Create & Deploy"}
              {!loading && <ArrowRightIcon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
