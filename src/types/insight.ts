export type InsightCategory = "PRICING" | "FLEET" | "TERMINAL" | "LEGAL" | "NEWS" | "MARKET" | "SYSTEM" | "SHIPPING";
export type Severity = "INFO" | "WARNING" | "CRITICAL";

export interface Insight {
  date: string;
  title: string;
  body: string;
  category: InsightCategory;
  severity: Severity;
}
