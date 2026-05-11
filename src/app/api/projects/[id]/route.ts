import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, deployments, envVariables } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
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

  const projectDeployments = await db
    .select()
    .from(deployments)
    .where(eq(deployments.projectId, projectId))
    .orderBy(desc(deployments.createdAt))
    .limit(10);

  const projectEnvVars = await db
    .select()
    .from(envVariables)
    .where(eq(envVariables.projectId, projectId));

  return NextResponse.json({
    project,
    deployments: projectDeployments,
    envVariables: projectEnvVars.map((v) => ({
      ...v,
      value: v.isSecret ? "••••••••" : v.value,
    })),
  });
}

export async function DELETE(
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

  // Delete related records
  await db.delete(deployments).where(eq(deployments.projectId, projectId));
  await db.delete(envVariables).where(eq(envVariables.projectId, projectId));
  await db.delete(projects).where(eq(projects.id, projectId));

  return NextResponse.json({ success: true });
}
