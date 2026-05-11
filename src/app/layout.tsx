import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudDeploy — Free Backend Hosting Platform",
  description:
    "Deploy your backend projects for free. Support for Node.js, Python, Go, Ruby, and more. Zero config deployments with automatic HTTPS.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-dark-950 text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
