import Link from "next/link";
import {
  GitPullRequest,
  ShieldCheck,
  Zap,
  Bug,
  BarChart3,
  MessageSquareCode,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";



const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const features = [
  {
    icon: Bug,
    title: "Bug Detection",
    description:
      "Catches logic errors, null dereferences, off-by-one bugs, and incorrect API usage before they reach production.",
    color: "text-orange-400",
  },
  {
    icon: ShieldCheck,
    title: "Security Scanning",
    description:
      "Finds SQL injection, XSS, hardcoded secrets, path traversal, and OWASP Top 10 vulnerabilities automatically.",
    color: "text-red-400",
  },
  {
    icon: Zap,
    title: "Performance Analysis",
    description:
      "Identifies N+1 queries, memory leaks, blocking calls in async code, and algorithm complexity issues.",
    color: "text-yellow-400",
  },
  {
    icon: MessageSquareCode,
    title: "Code Smell Detection",
    description:
      "Surfaces dead code, duplicated logic, long functions, and missing error handling — keeping your codebase clean.",
    color: "text-purple-400",
  },
  {
    icon: GitPullRequest,
    title: "GitHub Native",
    description:
      "Connect with GitHub OAuth. PRism reviews any PR in any repo you have access to, with inline comments posted automatically.",
    color: "text-blue-400",
  },
  {
    icon: BarChart3,
    title: "Actionable Insights",
    description:
      "Every issue comes with a severity level, exact file and line, detailed explanation, and a concrete fix suggestion.",
    color: "text-green-400",
  },
];

const stats = [
  { value: "< 30s", label: "Average Review Time" },
  { value: "6", label: "Issue Categories" },
  { value: "15+", label: "Languages Supported" },
];

const howItWorks = [
  {
    step: "01",
    title: "Connect GitHub",
    description: "OAuth with GitHub — PRism gets read access to your repos and PRs.",
  },
  {
    step: "02",
    title: "Select a PR",
    description: "Choose any open pull request from your repositories to review.",
  },
  {
    step: "03",
    title: "AI Reviews Instantly",
    description: "Our Llama 3.3 70B AI analyzes the diff and generates structured findings.",
  },
  {
    step: "04",
    title: "Get Results",
    description: "View results on your dashboard and automatically get comments posted on the PR.",
  },
];

export default function LandingPage() {
  const loginUrl = `${API}/auth/login`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 glass">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
                <GitPullRequest className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">PRism</span>
              <Badge className="badge-info ml-1 text-[10px] px-1.5 py-0">Beta</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Link href="#features">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Features
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  How it works
                </Button>
              </Link>
              <a href={loginUrl}>
                <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2 glow-primary">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Connect GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-mesh relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 sm:py-36 text-center relative z-10">
          <Badge className="badge-info mb-6 px-3 py-1 text-sm inline-flex gap-2 items-center">
            <Star className="h-3 w-3" />
            AI-Powered Code Review — For Real Teams
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Stop missing bugs
            <br />
            <span className="text-primary">in pull requests.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            PRism is an AI agent that reviews your PRs in seconds — detecting bugs, security
            vulnerabilities, performance bottlenecks, and code smells automatically, then posting
            actionable comments directly on GitHub.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={loginUrl}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 gap-2 px-8 text-base glow-primary"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Start Free with GitHub
              </Button>
            </a>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-8 text-base border-border/60 hover:border-primary/50"
              >
                See How It Works
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground/70">
            No credit card required · GitHub OAuth · Works with any repo
          </p>
        </div>

        {/* Floating PR Review Card mockup */}
        <div className="mx-auto max-w-3xl px-4 pb-16 relative z-10">
          <div className="glass rounded-2xl p-5 border border-primary/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">PRism — AI Review</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <span className="text-base mt-0.5">🔴</span>
                <div>
                  <p className="text-sm font-semibold text-red-300">SQL Injection Vulnerability</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <code className="text-primary/80">src/db/queries.py:42</code> — Unsanitized user
                    input passed directly to query
                  </p>
                  <p className="text-xs text-green-400/80 mt-1">
                    💡 Use parameterized queries or an ORM to prevent injection.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <span className="text-base mt-0.5">🟡</span>
                <div>
                  <p className="text-sm font-semibold text-yellow-300">N+1 Query Detected</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <code className="text-primary/80">src/api/users.py:87</code> — Fetching users
                    inside a loop
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <span className="text-base mt-0.5">🔵</span>
                <div>
                  <p className="text-sm font-semibold text-blue-300">Missing Type Hints</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <code className="text-primary/80">utils/helpers.py:12-28</code> — 4 functions
                    lack return type annotations
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Quality Score: <strong className="text-primary">72/100</strong></span>
              <span>Reviewed in <strong className="text-green-400">18s</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-border/50 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{s.value}</div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <Badge className="badge-info mb-4">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything your team needs
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            PRism covers the full spectrum of code quality — from critical security flaws to subtle
            style inconsistencies.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-6 hover:border-primary/30 group cursor-default"
            >
              <div
                className={`h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
              >
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-muted/20 border-y border-border/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <Badge className="badge-info mb-4">Process</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Up and running in minutes
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-border/50 -translate-y-1/2 z-0" />
                )}
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold text-sm">{step.step}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="glass rounded-3xl p-10 sm:p-16 text-center border border-primary/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Start reviewing smarter today
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Connect your GitHub account and get your first AI-powered PR review in under 30 seconds.
            </p>
            <a href={loginUrl}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 gap-2 px-10 text-base glow-primary"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Connect GitHub — It&apos;s Free
              </Button>
            </a>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground/70">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> OAuth only
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Works with any repo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                <GitPullRequest className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm text-foreground">PRism</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 PRism · AI-Powered Code Review
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
