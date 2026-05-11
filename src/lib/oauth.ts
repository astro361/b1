import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

interface OAuthProfile {
  email: string;
  name: string;
  avatarUrl?: string;
  provider: string;
  providerId: string;
}

export async function handleOAuthLogin(profile: OAuthProfile): Promise<NextResponse> {
  const { email, name, avatarUrl, provider, providerId } = profile;

  // Check if user already exists with this email
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  let userId: number;

  if (existingUser) {
    // Update provider info and avatar if needed
    await db
      .update(users)
      .set({
        avatarUrl: avatarUrl || existingUser.avatarUrl,
        provider: existingUser.provider === "email" ? provider : existingUser.provider,
        providerId: existingUser.providerId || providerId,
      })
      .where(eq(users.id, existingUser.id));

    userId = existingUser.id;
  } else {
    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
        passwordHash: null,
        avatarUrl: avatarUrl || null,
        provider,
        providerId,
      })
      .returning({ id: users.id });

    userId = newUser.id;
  }

  const token = signToken(userId);

  const response = NextResponse.redirect(new URL("/dashboard", getBaseUrl()));
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}

export function getBaseUrl(): string {
  // Use the app's own URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Fallback for development
  return `http://localhost:${process.env.PORT || 3000}`;
}

export function getOAuthErrorRedirect(message: string): NextResponse {
  const url = new URL("/login", getBaseUrl());
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}
