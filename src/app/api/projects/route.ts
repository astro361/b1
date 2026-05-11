import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, deployments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
import { nanoid } from "nanoid";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
    .orderBy(desc(projects.createdAt));

  return NextResponse.json({ projects: userProjects });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, repoUrl, runtime, buildCommand, startCommand, branch, port, region } = body;

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + nanoid(6);

    const [project] = await db
      .insert(projects)
      .values({
        userId: user.id,
        name,
        slug,
        repoUrl: repoUrl || null,
        runtime: runtime || "nodejs",
        buildCommand: buildCommand || "npm run build",
        startCommand: startCommand || "npm start",
        branch: branch || "main",
        port: port ? parseInt(port) : 3000,
        region: region || "us-east-1",
        status: "inactive",
      })
      .returning();

    // Create initial deployment
    await db.insert(deployments).values({
      projectId: project.id,
      status: "queued",
      commitMessage: "Initial deployment",
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
