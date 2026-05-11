"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  LogoIcon, RocketIcon, TrashIcon, ExternalIcon, PlusIcon, ChevronIcon, BoxIcon, LockIcon,
} from "@/components/icons";

interface Project {
  id: number; name: string; slug: string; runtime: string; status: string; region: string;
  repoUrl: string | null; buildCommand: string | null; startCommand: string | null;
  branch: string | null; port: number | null; createdAt: string; updatedAt: string;
}
interface Deployment {
  id: number; commitHash: string | null; commitMessage: string | null;
  status: string; logs: string | null; duration: number | null; createdAt: string;
}
interface EnvVar { id: number; key: string; value: string; isSecret: boolean; }

const statusStyles: Record<string, { dot: string; badge: string }> = {
  active: { dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  live: { dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  deploying: { dot: "bg-amber-400", badge: "bg-amber-50 text-amber-600 border-amber-200" },
  building: { dot: "bg-blue-400 animate-pulse-soft", badge: "bg-blue-50 text-blue-600 border-blue-200" },
  queued: { dot: "bg-slate-300", badge: "bg-slate-50 text-slate-500 border-slate-200" },
  inactive: { dot: "bg-slate-300", badge: "bg-slate-50 text-slate-400 border-slate-200" },
  failed: { dot: "bg-red-400", badge: "bg-red-50 text-red-500 border-red-200" },
};

const runtimeLabels: Record<string, string> = {
  nodejs: "Node.js", python: "Python", go: "Go", ruby: "Ruby", rust: "Rust", java: "Java",
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
      if (!res.ok) { router.push("/dashboard"); return; }
      const data = await res.json();
      setProject(data.project);
      setDeploymentsList(data.deployments);
      setEnvVars(data.envVariables);
    } catch { router.push("/dashboard"); } finally { setLoading(false); }
  }, [projectId, router]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  useEffect(() => {
    if (project?.status === "deploying" || project?.status === "building") {
      const i = setInterval(fetchProject, 3000);
      return () => clearInterval(i);
    }
  }, [project?.status, fetchProject]);

  const handleDeploy = async () => {
    setDeploying(true);
    try { await fetch(`/api/projects/${projectId}/deploy`, { method: "POST" }); await fetchProject(); }
    catch (e) { console.error(e); } finally { setDeploying(false); }
  };

  const handleAddEnvVar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvAdding(true);
    try {
      await fetch(`/api/projects/${projectId}/envvars`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(envForm),
      });
      setEnvForm({ key: "", value: "", isSecret: false });
      await fetchProject();
    } catch (err) { console.error(err); } finally { setEnvAdding(false); }
  };

  const handleDeleteEnvVar = async (envVarId: number) => {
    await fetch(`/api/projects/${projectId}/envvars?envVarId=${envVarId}`, { method: "DELETE" });
    await fetchProject();
  };

  const handleDeleteProject = async () => {
    if (!confirm("Delete this project permanently?")) return;
    await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    router.push("/dashboard");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!project) return null;

  const st = statusStyles[project.status] || statusStyles.inactive;
  const inputCls = "w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-slate-300";

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="glass-strong border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm">
            <Link href="/dashboard"><LogoIcon className="w-7 h-7" /></Link>
            <span className="text-slate-300">/</span>
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors font-medium">Projects</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold">{project.name}</span>
          </div>
          <button onClick={handleDeploy} disabled={deploying}
            className="bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-1.5">
            {deploying ? (
              <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deploying...</>
            ) : (
              <><RocketIcon className="w-4 h-4" />Deploy</>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Project Header */}
        <div className="glass-strong rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                <BoxIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-bold text-slate-900">{project.name}</h1>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border capitalize ${st.badge}`}>{project.status}</span>
                </div>
                <div className="text-slate-400 text-xs mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                  <span>{project.slug}.clouddeploy.app</span>
                  <span>{project.region}</span>
                  <span>Port {project.port}</span>
                </div>
              </div>
            </div>
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                className="text-slate-400 hover:text-brand-600 text-sm border border-slate-200 hover:border-brand-200 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 w-fit">
                <ExternalIcon className="w-3.5 h-3.5" />Repository
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Runtime", value: runtimeLabels[project.runtime] || project.runtime },
              { label: "Branch", value: project.branch || "main" },
              { label: "Build", value: project.buildCommand || "—" },
              { label: "Start", value: project.startCommand || "—" },
            ].map((s) => (
              <div key={s.label} className="bg-slate-50 rounded-xl px-3.5 py-2.5">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider font-medium mb-0.5">{s.label}</div>
                <div className="text-sm text-slate-700 font-mono truncate">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 mb-6 glass rounded-xl p-1 w-fit">
          {(["deployments", "env", "settings"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize ${activeTab === tab ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
              {tab === "env" ? "Environment" : tab}
            </button>
          ))}
        </div>

        {/* Deployments */}
        {activeTab === "deployments" && (
          <div className="space-y-2">
            {deploymentsList.length === 0 ? (
              <div className="glass-strong rounded-2xl p-10 text-center">
                <p className="text-slate-400 text-sm">No deployments yet. Click Deploy to start.</p>
              </div>
            ) : deploymentsList.map((dep) => {
              const ds = statusStyles[dep.status] || statusStyles.inactive;
              return (
                <div key={dep.id} className="glass rounded-xl overflow-hidden">
                  <div className="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-white/60 transition-all"
                    onClick={() => setShowLogs(showLogs === dep.id ? null : dep.id)}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${ds.dot}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700 capitalize">{dep.status}</span>
                          {dep.commitHash && (
                            <code className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">{dep.commitHash.substring(0, 7)}</code>
                          )}
                        </div>
                        <div className="text-slate-400 text-xs mt-0.5">
                          {dep.commitMessage || "No message"} · {new Date(dep.createdAt).toLocaleString()}
                          {dep.duration ? ` · ${dep.duration}s` : ""}
                        </div>
                      </div>
                    </div>
                    <ChevronIcon direction={showLogs === dep.id ? "up" : "down"} className="w-4 h-4 text-slate-400" />
                  </div>
                  {showLogs === dep.id && dep.logs && (
                    <div className="border-t border-slate-200/50 bg-slate-900 p-4 rounded-b-xl">
                      <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">{dep.logs}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Env Vars */}
        {activeTab === "env" && (
          <div className="space-y-4">
            <form onSubmit={handleAddEnvVar} className="glass-strong rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Add Variable</h3>
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-500">Key</label>
                  <input type="text" value={envForm.key} onChange={(e) => setEnvForm({ ...envForm, key: e.target.value.toUpperCase() })}
                    className={`${inputCls} font-mono text-xs`} placeholder="DATABASE_URL" required />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-500">Value</label>
                  <input type="text" value={envForm.value} onChange={(e) => setEnvForm({ ...envForm, value: e.target.value })}
                    className={`${inputCls} font-mono text-xs`} placeholder="postgres://..." required />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
                  <input type="checkbox" checked={envForm.isSecret} onChange={(e) => setEnvForm({ ...envForm, isSecret: e.target.checked })}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-200" />
                  Mark as secret
                </label>
                <button type="submit" disabled={envAdding}
                  className="bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5">
                  <PlusIcon className="w-3.5 h-3.5" />
                  {envAdding ? "Adding..." : "Add"}
                </button>
              </div>
            </form>

            {envVars.length > 0 && (
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/20">
                  <h3 className="text-xs font-semibold text-slate-600">{envVars.length} variable{envVars.length !== 1 ? "s" : ""}</h3>
                </div>
                <div className="divide-y divide-slate-200/50">
                  {envVars.map((v) => (
                    <div key={v.id} className="px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <code className="text-sm font-mono text-brand-600 font-medium">{v.key}</code>
                        <code className="text-sm font-mono text-slate-400 truncate">{v.value}</code>
                        {v.isSecret && (
                          <span className="flex items-center gap-1 text-[10px] font-medium bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded shrink-0">
                            <LockIcon className="w-2.5 h-2.5" />Secret
                          </span>
                        )}
                      </div>
                      <button onClick={() => handleDeleteEnvVar(v.id)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0 ml-3">
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <div className="glass-strong rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Details</h3>
              <div className="space-y-2.5 text-sm">
                {[
                  { label: "Project ID", value: String(project.id) },
                  { label: "Slug", value: project.slug },
                  { label: "URL", value: `https://${project.slug}.clouddeploy.app`, highlight: true },
                  { label: "Created", value: new Date(project.createdAt).toLocaleString() },
                  { label: "Updated", value: new Date(project.updatedAt).toLocaleString() },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-400">{r.label}</span>
                    <code className={`${r.highlight ? "text-brand-600" : "text-slate-700"} text-xs`}>{r.value}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border-red-200/50">
              <h3 className="text-sm font-semibold text-red-500 mb-1.5">Danger Zone</h3>
              <p className="text-slate-400 text-xs mb-4">This permanently deletes the project and all associated data.</p>
              <button onClick={handleDeleteProject}
                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5">
                <TrashIcon className="w-3.5 h-3.5" />
                Delete Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
