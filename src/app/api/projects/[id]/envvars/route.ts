import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, envVariables } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
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

  const { key, value, isSecret } = await req.json();

  if (!key || !value) {
    return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
  }

  const [envVar] = await db
    .insert(envVariables)
    .values({
      projectId,
      key,
      value,
      isSecret: isSecret || false,
    })
    .returning();

  return NextResponse.json({ envVariable: envVar }, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
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

  const { searchParams } = new URL(req.url);
  const envVarId = searchParams.get("envVarId");

  if (!envVarId) {
    return NextResponse.json({ error: "envVarId is required" }, { status: 400 });
  }

  await db
    .delete(envVariables)
    .where(
      and(eq(envVariables.id, parseInt(envVarId)), eq(envVariables.projectId, projectId))
    );

  return NextResponse.json({ success: true });
}
