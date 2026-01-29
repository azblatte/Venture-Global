import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import AssistantPanel from "@/components/assistant/AssistantPanel";
import { Card } from "@/components/ui/Card";

export default function AssistantPage() {
  return (
    <PageShell>
      <Header
        title="VG AI Analyst"
        subtitle="Ask questions about Venture Global, its assets, and LNG pricing signals."
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <AssistantPanel />
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Suggested Questions</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>• What is Venture Global and how does it make money?</p>
            <p>• What is Calcasieu Pass and why is it important?</p>
            <p>• What’s the difference between TTF and JKM?</p>
            <p>• How does fleet utilization affect VG?</p>
            <p>• What is CP2 and when does it come online?</p>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
