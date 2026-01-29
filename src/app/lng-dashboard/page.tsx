// Revalidate every 24 hours (86400 seconds) - free on Vercel
export const revalidate = 86400;

import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import LNGDashboardClient from "@/components/charts/LNGDashboardClient";
import { getMeta, getPricingHistory } from "@/lib/seed";
import { buildLNGDashboardData } from "@/lib/lng-dashboard";

export default async function LngDashboardPage() {
  const [pricing, meta] = await Promise.all([getPricingHistory(), getMeta()]);
  const initialData = buildLNGDashboardData(pricing, meta);

  return (
    <PageShell>
      <Header
        title="Interactive LNG Export Dashboard"
        subtitle="Free-tier analytics using EIA Henry Hub pricing with estimated TTF/JKM spreads and modeled cargo flows."
      />
      <LNGDashboardClient initialData={initialData} />
    </PageShell>
  );
}
