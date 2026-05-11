import { NextRequest } from "next/server";
import { handleOAuthLogin, getOAuthErrorRedirect } from "@/lib/oauth";

export const dynamic = "force-dynamic";

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    const error = req.nextUrl.searchParams.get("error");

    if (error || !code) {
      return getOAuthErrorRedirect("GitHub authorization was cancelled or failed.");
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return getOAuthErrorRedirect("GitHub OAuth is not configured.");
    }

    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = (await tokenRes.json()) as GitHubTokenResponse;

    if (!tokenData.access_token) {
      return getOAuthErrorRedirect("Failed to get access token from GitHub.");
    }

    // Get user profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });

    const githubUser = (await userRes.json()) as GitHubUser;

    // Get primary email if not in profile
    let email = githubUser.email;
    if (!email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json",
        },
      });
      const emails = (await emailsRes.json()) as GitHubEmail[];
      const primaryEmail = emails.find((e) => e.primary && e.verified);
      email = primaryEmail?.email || emails[0]?.email || null;
    }

    if (!email) {
      return getOAuthErrorRedirect("Could not retrieve email from GitHub. Please ensure your email is public or verified.");
    }

    return handleOAuthLogin({
      email,
      name: githubUser.name || githubUser.login,
      avatarUrl: githubUser.avatar_url,
      provider: "github",
      providerId: String(githubUser.id),
    });
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    return getOAuthErrorRedirect("An error occurred during GitHub login.");
  }
}
