import Link from "next/link";
import {
  LogoIcon, BoltIcon, ShieldIcon, GlobeIcon, TerminalIcon, KeyIcon, ScaleIcon,
  UserIcon, BoxIcon, WrenchIcon, LockIcon, ArrowRightIcon,
} from "@/components/icons";

const features = [
  { Icon: BoltIcon, title: "Instant Deployments", desc: "Push your code and watch it go live in seconds. Automatic builds from your Git repository.", color: "text-brand-500 bg-brand-50" },
  { Icon: ShieldIcon, title: "Free SSL / HTTPS", desc: "Every deployment gets automatic HTTPS with free SSL certificates. Zero configuration.", color: "text-mint-600 bg-mint-50" },
  { Icon: GlobeIcon, title: "Global Edge Network", desc: "Deploy to multiple regions. Your backend runs close to your users for low latency.", color: "text-brand-600 bg-brand-50" },
  { Icon: TerminalIcon, title: "Real-time Logs", desc: "Monitor your deployments with real-time build logs, error tracking, and metrics.", color: "text-slate-700 bg-slate-100" },
  { Icon: KeyIcon, title: "Environment Variables", desc: "Securely manage secrets and configuration. Encrypted at rest with easy management.", color: "text-sun-500 bg-sun-50" },
  { Icon: ScaleIcon, title: "Auto Scaling", desc: "Your backend scales automatically based on traffic. Completely free.", color: "text-rose-500 bg-rose-50" },
];

const runtimes = [
  { name: "Node.js", color: "bg-green-100 text-green-700" },
  { name: "Python", color: "bg-blue-100 text-blue-700" },
  { name: "Go", color: "bg-cyan-100 text-cyan-700" },
  { name: "Ruby", color: "bg-red-100 text-red-700" },
  { name: "Rust", color: "bg-orange-100 text-orange-700" },
  { name: "Java", color: "bg-amber-100 text-amber-700" },
];

const detailsSections = [
  {
    category: "Account",
    Icon: UserIcon,
    items: [
      { field: "Google / GitHub", desc: "Sign up instantly with OAuth — no password needed", required: false },
      { field: "Full Name", desc: "Your display name (auto-filled with OAuth)", required: true },
      { field: "Email Address", desc: "Used for login and notifications", required: true },
      { field: "Password", desc: "Min 6 chars — only for email sign-up", required: false },
    ],
  },
  {
    category: "Project",
    Icon: BoxIcon,
    items: [
      { field: "Project Name", desc: "A unique name for your backend", required: true },
      { field: "Repository URL", desc: "Link to your source code", required: false },
      { field: "Runtime", desc: "Node.js, Python, Go, Ruby, Rust, or Java", required: true },
      { field: "Branch", desc: "Git branch to deploy from", required: false },
    ],
  },
  {
    category: "Build Config",
    Icon: WrenchIcon,
    items: [
      { field: "Build Command", desc: "e.g. npm run build", required: false },
      { field: "Start Command", desc: "e.g. npm start", required: false },
      { field: "Port", desc: "Default: 3000", required: false },
      { field: "Region", desc: "US, EU, or Asia Pacific", required: false },
    ],
  },
  {
    category: "Env Variables",
    Icon: LockIcon,
    items: [
      { field: "Key", desc: "e.g. DATABASE_URL", required: true },
      { field: "Value", desc: "The secret value", required: true },
      { field: "Is Secret", desc: "Hide value in UI", required: false },
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-mint-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rose-200/15 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon className="w-8 h-8" />
            <span className="text-base font-bold text-slate-800 tracking-tight">CloudDeploy</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
              Sign In
            </Link>
            <Link href="/register" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-brand-600 font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse-soft" />
            Public beta — free forever
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight text-slate-900">
            Ship your backend
            <br />
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              effortlessly
            </span>
          </h1>

          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Connect your repository, pick your runtime, and deploy in one click. No credit card, no complexity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-7 py-3 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              Start Deploying
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <a href="#details" className="w-full sm:w-auto glass hover:bg-white/80 text-slate-600 px-7 py-3 rounded-xl text-sm font-medium transition-all">
              Learn More
            </a>
          </div>

          {/* Terminal */}
          <div className="mt-16 glass-dark rounded-2xl overflow-hidden shadow-2xl text-left max-w-xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="ml-2 text-white/30 text-xs font-mono">terminal</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-1">
              <p className="text-white/50"><span className="text-brand-300">$</span> clouddeploy init my-api</p>
              <p className="text-white/30">Project created</p>
              <p className="text-white/50"><span className="text-brand-300">$</span> clouddeploy deploy</p>
              <p className="text-white/30">Building from main...</p>
              <p className="text-white/30">Installing dependencies...</p>
              <p className="text-mint-400">Deployed to https://my-api.clouddeploy.app</p>
              <p className="text-white/30">SSL provisioned</p>
              <p className="text-brand-300">Your backend is live</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Everything you need</h2>
            <p className="text-slate-500 text-base max-w-lg mx-auto">A complete hosting platform, completely free.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 hover:bg-white/70 transition-all group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1.5 text-[15px]">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Runtimes */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Supported runtimes</h2>
            <p className="text-slate-500">Deploy in your favorite language.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {runtimes.map((r) => (
              <div key={r.name} className={`glass rounded-xl px-5 py-3 text-sm font-medium hover:scale-105 transition-transform ${r.color}`}>
                {r.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details */}
      <section id="details" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">What you&apos;ll need</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Most fields are optional. We auto-detect what we can.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {detailsSections.map((section) => (
              <div key={section.category} className="glass rounded-2xl overflow-hidden">
                <div className="px-5 py-4 flex items-center gap-3 border-b border-white/20">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center">
                    <section.Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm">{section.category}</h3>
                </div>
                <div className="p-4 space-y-2.5">
                  {section.items.map((item) => (
                    <div key={item.field} className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-sm font-medium text-slate-700">{item.field}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                      {item.required ? (
                        <span className="text-[10px] font-medium bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded shrink-0 mt-0.5">Required</span>
                      ) : (
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded shrink-0 mt-0.5">Optional</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Ready to deploy?</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">Create your free account and ship your first backend in under 2 minutes.</p>
            <Link href="/register" className="inline-flex bg-brand-600 hover:bg-brand-700 text-white px-7 py-3 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg items-center gap-2">
              Create Free Account
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200/60">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-5 h-5" />
            <span className="text-xs font-semibold text-slate-600">CloudDeploy</span>
          </div>
          <p className="text-slate-400 text-xs">© 2026 CloudDeploy. Free backend hosting for everyone.</p>
        </div>
      </footer>
    </div>
  );
}
