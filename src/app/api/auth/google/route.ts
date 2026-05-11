import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/oauth";

export const dynamic = "force-dynamic";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/login?error=Google+OAuth+not+configured.+Set+GOOGLE_CLIENT_ID+and+GOOGLE_CLIENT_SECRET.", getBaseUrl())
    );
  }

  const redirectUri = `${getBaseUrl()}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
