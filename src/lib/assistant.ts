export interface AssistantResponse {
  answer: string;
  sources?: string[];
}

const RULES: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ["what is vg", "venture global", "company"],
    answer:
      "Venture Global (NYSE: VG) is a U.S. LNG exporter that builds and operates liquefaction terminals on the Gulf Coast. It sells LNG under long-term contracts (SPAs) and spot cargoes, aiming to scale capacity quickly using modular trains.",
  },
  {
    keywords: ["business model", "make money", "revenue"],
    answer:
      "VG earns revenue from long-term liquefaction fees in SPAs, plus upside from spot sales during commissioning. It also captures shipping margins via owned/chartered LNG carriers.",
  },
  {
    keywords: ["calcasieu"],
    answer:
      "Calcasieu Pass is VG’s first LNG export facility in Cameron Parish, Louisiana. It has ~10 MTPA capacity and has been operational since 2022.",
  },
  {
    keywords: ["plaquemines"],
    answer:
      "Plaquemines LNG is VG’s larger brownfield expansion in Plaquemines Parish, Louisiana. It targets ~20 MTPA and began commissioning with first cargoes in late 2025.",
  },
  {
    keywords: ["cp2"],
    answer:
      "CP2 LNG is a 20 MTPA project near Calcasieu Pass. Final investment decision (FID) occurred in mid‑2025 and Phase 1 construction is underway.",
  },
  {
    keywords: ["cp3", "delta"],
    answer:
      "CP3 LNG (sometimes referenced as Delta LNG) is a pre‑FID development option at ~30 MTPA for post‑2028 growth.",
  },
  {
    keywords: ["fleet", "ships", "vessels"],
    answer:
      "VG operates a mix of owned and chartered LNG carriers. Fleet utilization (at sea or loading) is a key signal for cargo flow and terminal throughput.",
  },
  {
    keywords: ["pricing", "spread", "ttf", "jkm", "henry hub"],
    answer:
      "The spread between TTF/JKM and Henry Hub drives spot LNG profitability. Wider spreads typically mean better margins for US LNG exporters like VG.",
  },
  {
    keywords: ["how to use", "dashboard"],
    answer:
      "Start with the Overview for spreads and the VG Pulse Score. Use Fleet Tracker for vessel movements, Terminals for loading cadence, and Pricing Lab for netback economics.",
  },
];

export function answerQuestion(message: string): AssistantResponse {
  const normalized = message.trim().toLowerCase();
  if (!normalized) {
    return { answer: "Ask me about VG, its projects, fleet, or LNG pricing." };
  }

  for (const rule of RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return { answer: rule.answer, sources: ["VG Deep Dive (local)"] };
    }
  }

  return {
    answer:
      "I’m a local, rules-based assistant. Try asking about: VG overview, business model, Calcasieu Pass, Plaquemines, CP2/CP3, fleet utilization, or pricing spreads.",
  };
}
