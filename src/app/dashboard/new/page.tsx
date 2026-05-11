"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const runtimes = [
  { value: "nodejs", label: "Node.js", icon: "🟢" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "go", label: "Go", icon: "🔵" },
  { value: "ruby", label: "Ruby", icon: "💎" },
  { value: "rust", label: "Rust", icon: "🦀" },
  { value: "java", label: "Java", icon: "☕" },
];

const regions = [
  { value: "us-east-1", label: "🇺🇸 US East (Virginia)" },
  { value: "us-west-2", label: "🇺🇸 US West (Oregon)" },
  { value: "eu-west-1", label: "🇪🇺 EU West (Ireland)" },
  { value: "eu-central-1", label: "🇩🇪 EU Central (Frankfurt)" },
  { value: "ap-southeast-1", label: "🇸🇬 Asia Pacific (Singapore)" },
  { value: "ap-northeast-1", label: "🇯🇵 Asia Pacific (Tokyo)" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    repoUrl: "",
    runtime: "nodejs",
    buildCommand: "npm run build",
    startCommand: "npm start",
    branch: "main",
    port: "3000",
    region: "us-east-1",
  });

  const updateRuntime = (runtime: string) => {
    const defaults: Record<string, { build: string; start: string; port: string }> = {
      nodejs: { build: "npm run build", start: "npm start", port: "3000" },
      python: { build: "pip install -r requirements.txt", start: "python app.py", port: "8000" },
      go: { build: "go build -o app .", start: "./app", port: "8080" },
      ruby: { build: "bundle install", start: "ruby app.rb", port: "4567" },
      rust: { build: "cargo build --release", start: "./target/release/app", port: "8080" },
      java: { build: "mvn package", start: "java -jar target/app.jar", port: "8080" },
    };
    const d = defaults[runtime] || defaults.nodejs;
    setForm({
      ...form,
      runtime,
      buildCommand: d.build,
      startCommand: d.start,
      port: d.port,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create project");
        return;
      }

      router.push(`/dashboard/projects/${data.project.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">
              C
            </div>
          </Link>
          <span className="text-dark-600">/</span>
          <span className="text-dark-400 text-sm">New Project</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Create New Project</h1>
          <p className="text-dark-400 text-sm">
            Fill in the details below to deploy your backend. Only the project name and runtime are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Project Name */}
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="text-lg">📦</span> Project Info
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-dark-300">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors placeholder:text-dark-600"
                placeholder="my-awesome-api"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-dark-300">
                GitHub Repository URL
                <span className="ml-2 text-xs text-dark-500 font-normal">Optional</span>
              </label>
              <input
                type="url"
                value={form.repoUrl}
                onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors placeholder:text-dark-600"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-dark-300">
                Branch
                <span className="ml-2 text-xs text-dark-500 font-normal">Default: main</span>
              </label>
              <input
                type="text"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors placeholder:text-dark-600"
                placeholder="main"
              />
            </div>
          </div>

          {/* Runtime */}
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="text-lg">⚙️</span> Runtime & Build
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2 text-dark-300">
                Runtime <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {runtimes.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => updateRuntime(r.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors ${
                      form.runtime === r.value
                        ? "border-primary-500 bg-primary-500/10 text-primary-400"
                        : "border-dark-700 hover:border-dark-500 text-dark-400"
                    }`}
                  >
                    <span className="text-xl">{r.icon}</span>
                    <span className="text-xs font-medium">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-dark-300">
                  Build Command
                </label>
                <input
                  type="text"
                  value={form.buildCommand}
                  onChange={(e) => setForm({ ...form, buildCommand: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors placeholder:text-dark-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-dark-300">
                  Start Command
                </label>
                <input
                  type="text"
                  value={form.startCommand}
                  onChange={(e) => setForm({ ...form, startCommand: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors placeholder:text-dark-600"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-dark-300">
                  Port
                </label>
                <input
                  type="number"
                  value={form.port}
                  onChange={(e) => setForm({ ...form, port: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors placeholder:text-dark-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-dark-300">
                  Region
                </label>
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                >
                  {regions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="text-dark-400 hover:text-white text-sm transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {loading ? "Creating..." : "Create & Deploy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
