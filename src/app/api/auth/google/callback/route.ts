import { NextRequest } from "next/server";
import { handleOAuthLogin, getBaseUrl, getOAuthErrorRedirect } from "@/lib/oauth";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    const error = req.nextUrl.searchParams.get("error");

    if (error || !code) {
      return getOAuthErrorRedirect("Google authorization was cancelled or failed.");
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return getOAuthErrorRedirect("Google OAuth is not configured.");
    }

    const redirectUri = `${getBaseUrl()}/api/auth/google/callback`;

    // Exchange code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;

    if (!tokenData.access_token) {
      return getOAuthErrorRedirect("Failed to get access token from Google.");
    }

    // Get user profile
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUser = (await userRes.json()) as GoogleUser;

    if (!googleUser.email) {
      return getOAuthErrorRedirect("Could not retrieve email from Google.");
    }

    return handleOAuthLogin({
      email: googleUser.email,
      name: googleUser.name || `${googleUser.given_name} ${googleUser.family_name}`,
      avatarUrl: googleUser.picture,
      provider: "google",
      providerId: googleUser.sub,
    });
  } catch (err) {
    console.error("Google OAuth error:", err);
    return getOAuthErrorRedirect("An error occurred during Google login.");
  }
}
