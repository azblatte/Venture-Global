import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getNewsArticles } from "@/lib/seed";

const toneMap: Record<string, "emerald" | "amber" | "rose" | "slate"> = {
  POSITIVE: "emerald",
  NEGATIVE: "rose",
  NEUTRAL: "slate",
};

export default async function NewsPage() {
  const news = await getNewsArticles();
  const sorted = [...news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <PageShell>
      <Header title="News & Events" subtitle="Tracked headlines, regulatory notes, and contract milestones." />

      <section>
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Latest Timeline</h3>
          <div className="mt-4 space-y-4">
            {sorted.map((item) => (
              <div key={item.url} className="rounded-xl border border-slate-200/60 bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.source} · {item.publishedAt.slice(0, 10)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="slate">{item.category}</Badge>
                    {item.sentiment ? <Badge tone={toneMap[item.sentiment] ?? "slate"}>{item.sentiment}</Badge> : null}
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                <p className="mt-2 text-xs text-slate-400">{item.url}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
