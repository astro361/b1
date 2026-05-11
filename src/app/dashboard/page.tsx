"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const statusColors: Record<string, string> = {
  active: "bg-accent-500",
  deploying: "bg-yellow-500",
  inactive: "bg-dark-500",
  failed: "bg-red-500",
  building: "bg-blue-500",
};

const runtimeIcons: Record<string, string> = {
  nodejs: "🟢",
  python: "🐍",
  go: "🔵",
  ruby: "💎",
  rust: "🦀",
  java: "☕",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [userRes, projectsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/projects"),
      ]);

      if (!userRes.ok) {
        router.push("/login");
        return;
      }

      const userData = await userRes.json();
      setUser(userData.user);

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.projects);
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Dashboard Nav */}
      <nav className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">
                C
              </div>
              <span className="text-lg font-bold">CloudDeploy</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user?.provider && user.provider !== "email" && (
              <span className="text-xs bg-dark-800 border border-dark-700 text-dark-400 px-2 py-0.5 rounded-full capitalize flex items-center gap-1">
                {user.provider === "github" ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-3 h-3" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /></svg>
                )}
                {user.provider}
              </span>
            )}
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-full border border-dark-600"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-dark-400 text-sm hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-dark-400 hover:text-white text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-dark-400 text-sm mt-1">
              Manage your backend projects and deployments.
            </p>
          </div>
          <Link
            href="/dashboard/new"
            className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> New Project
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-4">
            <div className="text-dark-500 text-xs font-medium mb-1">Total Projects</div>
            <div className="text-2xl font-bold">{projects.length}</div>
          </div>
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-4">
            <div className="text-dark-500 text-xs font-medium mb-1">Active</div>
            <div className="text-2xl font-bold text-accent-400">
              {projects.filter((p) => p.status === "active").length}
            </div>
          </div>
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-4">
            <div className="text-dark-500 text-xs font-medium mb-1">Deploying</div>
            <div className="text-2xl font-bold text-yellow-400">
              {projects.filter((p) => p.status === "deploying" || p.status === "building").length}
            </div>
          </div>
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-4">
            <div className="text-dark-500 text-xs font-medium mb-1">Failed</div>
            <div className="text-2xl font-bold text-red-400">
              {projects.filter((p) => p.status === "failed").length}
            </div>
          </div>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
            <p className="text-dark-400 mb-6 max-w-md mx-auto">
              Create your first project to start deploying your backend to the cloud.
            </p>
            <Link
              href="/dashboard/new"
              className="inline-flex bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between bg-dark-900 border border-dark-800 rounded-xl p-5 hover:border-dark-600 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {runtimeIcons[project.runtime] || "📦"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold group-hover:text-primary-400 transition-colors">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-2 h-2 rounded-full ${statusColors[project.status] || "bg-dark-500"}`}
                        />
                        <span className="text-xs text-dark-400 capitalize">
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-dark-500 text-sm mt-0.5">
                      {project.slug}.clouddeploy.app • {project.runtime} • {project.region}
                    </div>
                  </div>
                </div>

                <div className="text-dark-500 text-sm hidden sm:block">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
