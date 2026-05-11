import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/oauth";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?error=GitHub+OAuth+not+configured.+Set+GITHUB_CLIENT_ID+and+GITHUB_CLIENT_SECRET.", getBaseUrl())
    );
  }

  const redirectUri = `${getBaseUrl()}/api/auth/github/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "user:email read:user",
    allow_signup: "true",
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}
