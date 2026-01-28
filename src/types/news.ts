export type NewsCategory =
  | "GENERAL"
  | "LNG_MARKET"
  | "REGULATORY"
  | "LEGAL"
  | "CORPORATE"
  | "INFRASTRUCTURE"
  | "SHIPPING"
  | "ENVIRONMENT";

export type Sentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export interface NewsArticle {
  title: string;
  description?: string;
  url: string;
  source: string;
  author?: string;
  publishedAt: string;
  category: NewsCategory;
  sentiment?: Sentiment;
  isVgRelated?: boolean;
  tags?: string[];
}
