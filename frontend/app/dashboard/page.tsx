"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GitPullRequest, AlertCircle, CheckCircle2, TrendingUp, Eye, ArrowRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listReviews, type ReviewSummary } from "@/lib/api";

function SeverityBadge({ review }: { review: ReviewSummary }) {
  if (review.status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium badge-info">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        Pending
      </span>
    );
  }
  if (review.status === "error") {
    return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium badge-critical">Error</span>;
  }
  if (review.critical_count > 0) {
    return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium badge-critical">🔴 {review.critical_count} Critical</span>;
  }
  if (review.warning_count > 0) {
    return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium badge-warning">🟡 {review.warning_count} Warnings</span>;
  }
  return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium badge-clean">✅ Clean</span>;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardPage() {
  const [reviews, setReviews] = useState<ReviewSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalIssues = reviews.reduce((a, r) => a + r.issues_count, 0);
  const totalCritical = reviews.reduce((a, r) => a + r.critical_count, 0);
  const cleanReviews = reviews.filter((r) => r.issues_count === 0 && r.status === "reviewed").length;

  const stats = [
    { label: "Total Reviews", value: reviews.length, icon: Eye, color: "text-blue-400" },
    { label: "Issues Found", value: totalIssues, icon: AlertCircle, color: "text-red-400" },
    { label: "Critical Issues", value: totalCritical, icon: TrendingUp, color: "text-orange-400" },
    { label: "Clean Reviews", value: cleanReviews, icon: CheckCircle2, color: "text-green-400" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Your AI code review overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 glass border-border/50 hover:border-primary/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? "—" : s.value}
                </p>
              </div>
              <s.icon className={`h-5 w-5 ${s.color} mt-1`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Action */}
      <div className="mb-8">
        <Card className="glass border-primary/20 p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <GitPullRequest className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Review a Pull Request</p>
              <p className="text-sm text-muted-foreground">Pick a repo and PR to get an AI review instantly</p>
            </div>
          </div>
          <Link href="/dashboard/new-review">
            <Button className="bg-primary hover:bg-primary/90 gap-2 glow-primary">
              New Review <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Recent Reviews */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Reviews</h2>
          <Link href="/dashboard/reviews">
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card className="glass border-border/50 p-10 text-center">
            <GitPullRequest className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No reviews yet. Start by reviewing a PR.</p>
            <Link href="/dashboard/new-review">
              <Button className="bg-primary hover:bg-primary/90">Start First Review</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {reviews.slice(0, 5).map((review) => (
              <Link key={review.id} href={`/dashboard/review/${review.id}`}>
                <Card className="glass border-border/50 hover:border-primary/30 p-5 cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {review.pr_title}
                        </h3>
                        <SeverityBadge review={review} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-mono text-primary/70">{review.repo}#{review.pr_number}</span>
                        <span>·</span>
                        <span>by {review.pr_author}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(review.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground ml-4 shrink-0">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{review.lines_added + review.lines_deleted}</p>
                        <p>lines</p>
                      </div>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  {review.detected_languages?.length > 0 && (
                    <div className="flex gap-1.5 mt-3">
                      {review.detected_languages.slice(0, 4).map((lang) => (
                        <span key={lang} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
