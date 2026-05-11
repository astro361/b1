"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoIcon, PlusIcon, GithubIcon, BoxIcon, RocketIcon } from "@/components/icons";

interface Project {
  id: number;
  name: string;
  slug: string;
  runtime: string;
  status: string;
  region: string;
  repoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  provider: string | null;
}

const statusStyles: Record<string, { dot: string; text: string }> = {
  active: { dot: "bg-emerald-500", text: "text-emerald-600" },
  deploying: { dot: "bg-amber-400", text: "text-amber-600" },
  building: { dot: "bg-blue-400", text: "text-blue-600" },
  inactive: { dot: "bg-slate-300", text: "text-slate-400" },
  failed: { dot: "bg-red-400", text: "text-red-500" },
};

const runtimeLabels: Record<string, string> = {
  nodejs: "Node.js",
  python: "Python",
  go: "Go",
  ruby: "Ruby",
  rust: "Rust",
  java: "Java",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [userRes, projectsRes] = await Promise.all([fetch("/api/auth/me"), fetch("/api/projects")]);
      if (!userRes.ok) { router.push("/login"); return; }
      const userData = await userRes.json();
      setUser(userData.user);
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.projects);
      }
    } catch { router.push("/login"); } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeCount = projects.filter((p) => p.status === "active").length;
  const deployingCount = projects.filter((p) => p.status === "deploying" || p.status === "building").length;
  const failedCount = projects.filter((p) => p.status === "failed").length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="glass-strong border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <LogoIcon className="w-7 h-7" />
            <span className="text-sm font-bold text-slate-800 tracking-tight">CloudDeploy</span>
          </Link>

          <div className="flex items-center gap-3">
            {user?.provider && user.provider !== "email" && (
              <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full capitalize flex items-center gap-1">
                {user.provider === "github" && <GithubIcon className="w-2.5 h-2.5" />}
                {user.provider}
              </span>
            )}
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full ring-2 ring-white shadow-sm" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-slate-500 text-xs hidden sm:block">{user?.name}</span>
            <button onClick={handleLogout} className="text-slate-400 hover:text-slate-600 text-xs font-medium transition-colors ml-1">
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Welcome, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Manage your projects and deployments</p>
          </div>
          <Link href="/dashboard/new" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-1.5">
            <PlusIcon className="w-4 h-4" />
            New Project
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: projects.length, color: "text-slate-800" },
            { label: "Active", value: activeCount, color: "text-emerald-600" },
            { label: "Deploying", value: deployingCount, color: "text-amber-600" },
            { label: "Failed", value: failedCount, color: "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl px-4 py-3.5">
              <div className="text-slate-400 text-[11px] font-medium uppercase tracking-wider mb-0.5">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Projects */}
        {projects.length === 0 ? (
          <div className="glass-strong rounded-2xl p-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-5">
              <RocketIcon className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-1.5">No projects yet</h2>
            <p className="text-slate-400 mb-6 max-w-xs mx-auto text-sm">Create your first project to deploy your backend to the cloud.</p>
            <Link href="/dashboard/new" className="inline-flex bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm items-center gap-1.5">
              <PlusIcon className="w-4 h-4" />
              Create Project
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => {
              const st = statusStyles[project.status] || statusStyles.inactive;
              return (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`}
                  className="flex items-center justify-between glass rounded-xl px-5 py-4 hover:bg-white/80 transition-all group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                      <BoxIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-slate-800 group-hover:text-brand-600 transition-colors">{project.name}</h3>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          <span className={`text-[11px] font-medium capitalize ${st.text}`}>{project.status}</span>
                        </div>
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        {project.slug}.clouddeploy.app · {runtimeLabels[project.runtime] || project.runtime} · {project.region}
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs hidden sm:block">{new Date(project.updatedAt).toLocaleDateString()}</div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
