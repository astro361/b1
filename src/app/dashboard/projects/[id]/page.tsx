"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface Project {
  id: number;
  name: string;
  slug: string;
  runtime: string;
  status: string;
  region: string;
  repoUrl: string | null;
  buildCommand: string | null;
  startCommand: string | null;
  branch: string | null;
  port: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Deployment {
  id: number;
  commitHash: string | null;
  commitMessage: string | null;
  status: string;
  logs: string | null;
  duration: number | null;
  createdAt: string;
}

interface EnvVar {
  id: number;
  key: string;
  value: string;
  isSecret: boolean;
}

const statusColors: Record<string, string> = {
  active: "bg-accent-500",
  live: "bg-accent-500",
  deploying: "bg-yellow-500",
  building: "bg-blue-500",
  queued: "bg-dark-400",
  inactive: "bg-dark-500",
  failed: "bg-red-500",
};

const statusBadgeColors: Record<string, string> = {
  active: "bg-accent-500/10 text-accent-400 border-accent-500/20",
  live: "bg-accent-500/10 text-accent-400 border-accent-500/20",
  deploying: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  building: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  queued: "bg-dark-400/10 text-dark-400 border-dark-500/20",
  inactive: "bg-dark-500/10 text-dark-400 border-dark-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const runtimeIcons: Record<string, string> = {
  nodejs: "🟢",
  python: "🐍",
  go: "🔵",
  ruby: "💎",
  rust: "🦀",
  java: "☕",
};

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [deploymentsList, setDeploymentsList] = useState<Deployment[]>([]);
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState<"deployments" | "env" | "settings">("deployments");
  const [envForm, setEnvForm] = useState({ key: "", value: "", isSecret: false });
  const [envAdding, setEnvAdding] = useState(false);
  const [showLogs, setShowLogs] = useState<number | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      setProject(data.project);
      setDeploymentsList(data.deployments);
      setEnvVars(data.envVariables);
    } catch {
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Auto-refresh while deploying
  useEffect(() => {
    if (project?.status === "deploying" || project?.status === "building") {
      const interval = setInterval(fetchProject, 3000);
      return () => clearInterval(interval);
    }
  }, [project?.status, fetchProject]);

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      await fetch(`/api/projects/${projectId}/deploy`, { method: "POST" });
      await fetchProject();
    } catch (err) {
      console.error("Deploy error:", err);
    } finally {
      setDeploying(false);
    }
  };

  const handleAddEnvVar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvAdding(true);
    try {
      await fetch(`/api/projects/${projectId}/envvars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(envForm),
      });
      setEnvForm({ key: "", value: "", isSecret: false });
      await fetchProject();
    } catch (err) {
      console.error("Add env var error:", err);
    } finally {
      setEnvAdding(false);
    }
  };

  const handleDeleteEnvVar = async (envVarId: number) => {
    try {
      await fetch(`/api/projects/${projectId}/envvars?envVarId=${envVarId}`, {
        method: "DELETE",
      });
      await fetchProject();
    } catch (err) {
      console.error("Delete env var error:", err);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }
    try {
      await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      router.push("/dashboard");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">
                C
              </div>
            </Link>
            <span className="text-dark-600">/</span>
            <Link href="/dashboard" className="text-dark-400 hover:text-white text-sm transition-colors">
              Projects
            </Link>
            <span className="text-dark-600">/</span>
            <span className="text-sm font-medium">{project.name}</span>
          </div>

          <button
            onClick={handleDeploy}
            disabled={deploying}
            className="bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
          >
            {deploying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deploying...
              </>
            ) : (
              <>🚀 Deploy</>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Project Header */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{runtimeIcons[project.runtime] || "📦"}</div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold">{project.name}</h1>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                      statusBadgeColors[project.status] || statusBadgeColors.inactive
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="text-dark-400 text-sm mt-1 space-x-3">
                  <span>🌐 {project.slug}.clouddeploy.app</span>
                  <span>📍 {project.region}</span>
                  <span>🔌 Port {project.port}</span>
                </div>
              </div>
            </div>

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-white text-sm border border-dark-700 hover:border-dark-500 px-4 py-2 rounded-xl transition-colors"
              >
                📂 View Repository
              </a>
            )}
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-dark-800/50 rounded-xl px-4 py-3">
              <div className="text-dark-500 text-xs mb-0.5">Runtime</div>
              <div className="text-sm font-medium capitalize">{project.runtime}</div>
            </div>
            <div className="bg-dark-800/50 rounded-xl px-4 py-3">
              <div className="text-dark-500 text-xs mb-0.5">Branch</div>
              <div className="text-sm font-medium">{project.branch || "main"}</div>
            </div>
            <div className="bg-dark-800/50 rounded-xl px-4 py-3">
              <div className="text-dark-500 text-xs mb-0.5">Build</div>
              <div className="text-sm font-mono truncate">{project.buildCommand}</div>
            </div>
            <div className="bg-dark-800/50 rounded-xl px-4 py-3">
              <div className="text-dark-500 text-xs mb-0.5">Start</div>
              <div className="text-sm font-mono truncate">{project.startCommand}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-dark-900 border border-dark-800 rounded-xl p-1 w-fit">
          {(["deployments", "env", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "bg-dark-700 text-white"
                  : "text-dark-400 hover:text-white"
              }`}
            >
              {tab === "env" ? "Environment" : tab}
            </button>
          ))}
        </div>

        {/* Deployments Tab */}
        {activeTab === "deployments" && (
          <div className="space-y-3">
            {deploymentsList.length === 0 ? (
              <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8 text-center">
                <p className="text-dark-400">No deployments yet. Click Deploy to start!</p>
              </div>
            ) : (
              deploymentsList.map((dep) => (
                <div
                  key={dep.id}
                  className="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden"
                >
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-dark-800/30 transition-colors"
                    onClick={() => setShowLogs(showLogs === dep.id ? null : dep.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          statusColors[dep.status] || "bg-dark-500"
                        } ${dep.status === "building" ? "animate-pulse-dot" : ""}`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium capitalize">{dep.status}</span>
                          {dep.commitHash && (
                            <code className="text-xs text-dark-500 bg-dark-800 px-2 py-0.5 rounded">
                              {dep.commitHash.substring(0, 7)}
                            </code>
                          )}
                        </div>
                        <div className="text-dark-500 text-xs mt-0.5">
                          {dep.commitMessage || "No commit message"} •{" "}
                          {new Date(dep.createdAt).toLocaleString()}
                          {dep.duration && ` • ${dep.duration}s`}
                        </div>
                      </div>
                    </div>
                    <span className="text-dark-500 text-sm">
                      {showLogs === dep.id ? "▲" : "▼"}
                    </span>
                  </div>

                  {showLogs === dep.id && dep.logs && (
                    <div className="border-t border-dark-800 bg-dark-950 p-4">
                      <pre className="text-xs font-mono text-dark-400 whitespace-pre-wrap">
                        {dep.logs}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Environment Variables Tab */}
        {activeTab === "env" && (
          <div className="space-y-4">
            <form
              onSubmit={handleAddEnvVar}
              className="bg-dark-900 border border-dark-800 rounded-2xl p-6"
            >
              <h3 className="font-semibold mb-4">Add Environment Variable</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-dark-300">
                    Key <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={envForm.key}
                    onChange={(e) =>
                      setEnvForm({ ...envForm, key: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors placeholder:text-dark-600"
                    placeholder="DATABASE_URL"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-dark-300">
                    Value <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={envForm.value}
                    onChange={(e) => setEnvForm({ ...envForm, value: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors placeholder:text-dark-600"
                    placeholder="postgres://..."
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-dark-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={envForm.isSecret}
                    onChange={(e) =>
                      setEnvForm({ ...envForm, isSecret: e.target.checked })
                    }
                    className="rounded border-dark-600"
                  />
                  Mark as secret (value will be hidden)
                </label>
                <button
                  type="submit"
                  disabled={envAdding}
                  className="bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  {envAdding ? "Adding..." : "Add Variable"}
                </button>
              </div>
            </form>

            {envVars.length > 0 && (
              <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-3 bg-dark-800/50 border-b border-dark-700">
                  <h3 className="font-semibold text-sm">Variables ({envVars.length})</h3>
                </div>
                <div className="divide-y divide-dark-800">
                  {envVars.map((v) => (
                    <div
                      key={v.id}
                      className="px-6 py-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <code className="text-sm font-mono text-primary-400">{v.key}</code>
                        <code className="text-sm font-mono text-dark-500">{v.value}</code>
                        {v.isSecret && (
                          <span className="text-xs bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded">
                            🔒 Secret
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteEnvVar(v.id)}
                        className="text-dark-500 hover:text-red-400 text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Project Settings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-dark-800">
                  <span className="text-dark-400">Project ID</span>
                  <code className="text-dark-300">{project.id}</code>
                </div>
                <div className="flex justify-between py-2 border-b border-dark-800">
                  <span className="text-dark-400">Slug</span>
                  <code className="text-dark-300">{project.slug}</code>
                </div>
                <div className="flex justify-between py-2 border-b border-dark-800">
                  <span className="text-dark-400">URL</span>
                  <code className="text-primary-400">https://{project.slug}.clouddeploy.app</code>
                </div>
                <div className="flex justify-between py-2 border-b border-dark-800">
                  <span className="text-dark-400">Created</span>
                  <span className="text-dark-300">{new Date(project.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-dark-400">Last Updated</span>
                  <span className="text-dark-300">{new Date(project.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-900 border border-red-500/20 rounded-2xl p-6">
              <h3 className="font-semibold text-red-400 mb-2">Danger Zone</h3>
              <p className="text-dark-400 text-sm mb-4">
                Deleting a project will remove all deployments, environment variables, and configuration.
                This action cannot be undone.
              </p>
              <button
                onClick={handleDeleteProject}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Delete Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
