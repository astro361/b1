import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, deployments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const projectId = parseInt(id);

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Simulate deployment
  const commitHashes = ["a1b2c3d", "e4f5g6h", "i7j8k9l", "m0n1o2p", "q3r4s5t"];
  const randomHash = commitHashes[Math.floor(Math.random() * commitHashes.length)];

  const [deployment] = await db
    .insert(deployments)
    .values({
      projectId: project.id,
      commitHash: randomHash + Math.random().toString(36).substring(2, 8),
      commitMessage: "Manual deployment triggered",
      status: "building",
      logs: `[${new Date().toISOString()}] Deployment started...\n[${new Date().toISOString()}] Cloning repository...\n[${new Date().toISOString()}] Installing dependencies...\n[${new Date().toISOString()}] Running build command: ${project.buildCommand}\n`,
    })
    .returning();

  // Update project status
  await db
    .update(projects)
    .set({ status: "deploying", updatedAt: new Date() })
    .where(eq(projects.id, projectId));

  // Simulate deployment completion after creation
  setTimeout(async () => {
    try {
      const success = Math.random() > 0.15;
      const duration = Math.floor(Math.random() * 120) + 30;
      await db
        .update(deployments)
        .set({
          status: success ? "live" : "failed",
          duration,
          logs:
            deployment.logs +
            `[${new Date().toISOString()}] Build ${success ? "succeeded" : "failed"}!\n` +
            (success
              ? `[${new Date().toISOString()}] Starting service on port ${project.port}...\n[${new Date().toISOString()}] ✓ Deployment live!\n`
              : `[${new Date().toISOString()}] ✗ Build error: check logs\n`),
        })
        .where(eq(deployments.id, deployment.id));

      await db
        .update(projects)
        .set({ status: success ? "active" : "failed", updatedAt: new Date() })
        .where(eq(projects.id, projectId));
    } catch (e) {
      console.error("Deployment simulation error:", e);
    }
  }, 3000);

  return NextResponse.json({ deployment }, { status: 201 });
}
