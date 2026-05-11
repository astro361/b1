import Link from "next/link";

const features = [
  {
    icon: "⚡",
    title: "Instant Deployments",
    desc: "Push your code and watch it go live in seconds. Automatic builds from your Git repository.",
  },
  {
    icon: "🔒",
    title: "Free SSL / HTTPS",
    desc: "Every deployment gets automatic HTTPS with free SSL certificates. Zero configuration needed.",
  },
  {
    icon: "🌍",
    title: "Global Edge Network",
    desc: "Deploy to multiple regions worldwide. Your backend runs close to your users for low latency.",
  },
  {
    icon: "📊",
    title: "Real-time Logs",
    desc: "Monitor your deployments with real-time build logs, error tracking, and performance metrics.",
  },
  {
    icon: "🔧",
    title: "Environment Variables",
    desc: "Securely manage secrets and configuration. Encrypted at rest with easy key-value management.",
  },
  {
    icon: "🚀",
    title: "Auto Scaling",
    desc: "Your backend scales automatically based on traffic. Pay nothing — it's completely free.",
  },
];

const runtimes = [
  { name: "Node.js", icon: "🟢", versions: "18, 20, 22" },
  { name: "Python", icon: "🐍", versions: "3.9, 3.10, 3.11, 3.12" },
  { name: "Go", icon: "🔵", versions: "1.21, 1.22" },
  { name: "Ruby", icon: "💎", versions: "3.2, 3.3" },
  { name: "Rust", icon: "🦀", versions: "Latest stable" },
  { name: "Java", icon: "☕", versions: "17, 21" },
];

const detailsNeeded = [
  {
    category: "Account Details",
    icon: "👤",
    items: [
      { field: "Google / GitHub", desc: "Sign up instantly with your Google or GitHub account — no password needed!", required: false },
      { field: "Full Name", desc: "Your display name on the platform (auto-filled with OAuth)", required: true },
      { field: "Email Address", desc: "Used for login and notifications (auto-filled with OAuth)", required: true },
      { field: "Password", desc: "Minimum 6 characters — only needed for email sign-up, not for Google/GitHub", required: false },
    ],
  },
  {
    category: "Project Details",
    icon: "📦",
    items: [
      { field: "Project Name", desc: "A unique name for your backend project", required: true },
      { field: "GitHub Repository URL", desc: "Link to your source code (public or private)", required: false },
      { field: "Runtime", desc: "Node.js, Python, Go, Ruby, Rust, or Java", required: true },
      { field: "Branch", desc: "Git branch to deploy from (default: main)", required: false },
    ],
  },
  {
    category: "Build & Deploy Config",
    icon: "🔨",
    items: [
      { field: "Build Command", desc: 'e.g., "npm run build" or "pip install -r requirements.txt"', required: false },
      { field: "Start Command", desc: 'e.g., "npm start" or "python app.py"', required: false },
      { field: "Port", desc: "The port your app listens on (default: 3000)", required: false },
      { field: "Region", desc: "Deployment region (US East, EU West, Asia Pacific)", required: false },
    ],
  },
  {
    category: "Environment Variables",
    icon: "🔐",
    items: [
      { field: "Key", desc: "Variable name (e.g., DATABASE_URL, API_KEY)", required: true },
      { field: "Value", desc: "The secret value for the variable", required: true },
      { field: "Is Secret", desc: "Mark as secret to hide value in the UI", required: false },
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">
              C
            </div>
            <span className="text-lg font-bold">CloudDeploy</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-dark-300 hover:text-white transition-colors text-sm"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 text-primary-300 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-dot" />
            Now in public beta — 100% free
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-b from-white to-dark-400 bg-clip-text text-transparent">
            Deploy Your Backend
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h1>

          <p className="text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The simplest way to host your backend projects for free. Connect your repo,
            configure your settings, and deploy with a single click.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary-600/25"
            >
              Start Deploying — It&apos;s Free
            </Link>
            <a
              href="#details"
              className="w-full sm:w-auto border border-dark-700 hover:border-dark-500 text-dark-300 hover:text-white px-8 py-3.5 rounded-xl text-base font-medium transition-all"
            >
              What Details Are Needed?
            </a>
          </div>

          {/* Terminal Preview */}
          <div className="mt-16 bg-dark-900 rounded-2xl border border-dark-700 overflow-hidden shadow-2xl text-left max-w-2xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-3 bg-dark-800 border-b border-dark-700">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-dark-500 text-xs">terminal</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-1.5">
              <p className="text-dark-400">
                <span className="text-accent-400">$</span> clouddeploy init my-api
              </p>
              <p className="text-dark-500">✓ Project created</p>
              <p className="text-dark-400">
                <span className="text-accent-400">$</span> clouddeploy deploy
              </p>
              <p className="text-dark-500">⠋ Building from main branch...</p>
              <p className="text-dark-500">⠋ Installing dependencies...</p>
              <p className="text-dark-500">⠋ Running build command...</p>
              <p className="text-accent-400">
                ✓ Deployed to https://my-api.clouddeploy.app
              </p>
              <p className="text-dark-500">
                ✓ SSL certificate provisioned
              </p>
              <p className="text-primary-400">
                🚀 Your backend is live!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Ship
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              A complete hosting platform with all the features you&apos;d expect, completely free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-dark-900/50 border border-dark-800 rounded-2xl p-6 hover:border-dark-600 transition-colors group"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-dark-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Runtimes */}
      <section className="py-20 px-6 bg-dark-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Supported Runtimes
            </h2>
            <p className="text-dark-400 text-lg">
              Deploy backends written in your favorite language.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {runtimes.map((r) => (
              <div
                key={r.name}
                className="bg-dark-900 border border-dark-800 rounded-xl p-5 text-center hover:border-primary-500/50 transition-colors"
              >
                <div className="text-3xl mb-2">{r.icon}</div>
                <div className="font-semibold text-sm mb-1">{r.name}</div>
                <div className="text-dark-500 text-xs">{r.versions}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details Needed Section */}
      <section id="details" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Details Are Needed?
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Here&apos;s everything you&apos;ll need to get started. Most fields are optional — we&apos;ll
              auto-detect what we can.
            </p>
          </div>

          <div className="space-y-8">
            {detailsNeeded.map((section) => (
              <div
                key={section.category}
                className="bg-dark-900/50 border border-dark-800 rounded-2xl overflow-hidden"
              >
                <div className="px-6 py-4 bg-dark-800/50 border-b border-dark-700 flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <h3 className="text-lg font-semibold">{section.category}</h3>
                </div>
                <div className="divide-y divide-dark-800">
                  {section.items.map((item) => (
                    <div
                      key={item.field}
                      className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                    >
                      <div className="sm:w-48 flex items-center gap-2">
                        <span className="font-medium text-sm">{item.field}</span>
                        {item.required && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        )}
                        {!item.required && (
                          <span className="text-xs bg-dark-700 text-dark-400 px-1.5 py-0.5 rounded">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-dark-400 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary-900/50 to-dark-900 border border-primary-500/20 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Deploy?
            </h2>
            <p className="text-dark-400 text-lg mb-8 max-w-lg mx-auto">
              Create your free account and deploy your first backend project in under 2 minutes.
            </p>
            <Link
              href="/register"
              className="inline-flex bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary-600/25"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-dark-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded flex items-center justify-center text-xs font-bold">
              C
            </div>
            <span className="text-sm font-semibold">CloudDeploy</span>
          </div>
          <p className="text-dark-500 text-sm">
            © 2026 CloudDeploy. Free backend hosting for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}
