import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getInsights } from "@/lib/seed";

const severityTone: Record<string, "emerald" | "amber" | "rose" | "slate"> = {
  INFO: "emerald",
  WARNING: "amber",
  CRITICAL: "rose",
};

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <PageShell>
      <Header title="Insights & Alerts" subtitle="Daily bullet points derived from seeded signals." />

      <section>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Daily Insights</h3>
          <div className="mt-4 space-y-4">
            {insights.map((insight) => (
              <div key={`${insight.title}-${insight.date}`} className="rounded-xl border border-slate-200/60 bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                    <p className="text-xs text-slate-500">{insight.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="slate">{insight.category}</Badge>
                    <Badge tone={severityTone[insight.severity] ?? "slate"}>{insight.severity}</Badge>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600">{insight.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
