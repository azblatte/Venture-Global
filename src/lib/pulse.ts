import type { SpreadPoint } from "@/types/pricing";
import type { Vessel } from "@/types/vessel";

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export function computePulseScore(spreads: SpreadPoint[], vessels: Vessel[]) {
  const latest = spreads[spreads.length - 1];
  const delivered = vessels.filter((vessel) => vessel.isDelivered);
  const active = delivered.filter((vessel) =>
    ["AT_SEA", "AT_TERMINAL_LOADING"].includes(vessel.status)
  );
  const fleetUtilization = delivered.length ? active.length / delivered.length : 0;

  const spreadScore = latest
    ? clamp(((latest.ttfHhSpread + latest.jkmHhSpread) / 2) * 5)
    : 50;
  const fleetScore = clamp(fleetUtilization * 100);
  const terminalScore = 62;
  const newsScore = 58;
  const stockScore = 55;

  const overall =
    spreadScore * 0.3 + fleetScore * 0.25 + terminalScore * 0.2 + newsScore * 0.15 + stockScore * 0.1;

  return {
    overall: clamp(Number(overall.toFixed(1))),
    breakdown: {
      spreadScore: clamp(Number(spreadScore.toFixed(1))),
      fleetScore: clamp(Number(fleetScore.toFixed(1))),
      terminalScore,
      newsScore,
      stockScore,
    },
  };
}
