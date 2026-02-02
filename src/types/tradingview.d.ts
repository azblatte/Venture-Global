declare global {
  interface Window {
    TradingView: {
      widget: new (config: TradingViewWidgetConfig) => TradingViewWidgetInstance;
    };
  }
}

export interface TradingViewWidgetConfig {
  symbol: string;
  interval?: string;
  container_id?: string;
  container?: HTMLElement;
  width?: string | number;
  height?: string | number;
  autosize?: boolean;
  theme?: "light" | "dark";
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  hide_side_toolbar?: boolean;
  hide_top_toolbar?: boolean;
  hide_legend?: boolean;
  save_image?: boolean;
  studies?: string[];
  show_popup_button?: boolean;
  popup_width?: string | number;
  popup_height?: string | number;
  withdateranges?: boolean;
  details?: boolean;
  hotlist?: boolean;
  calendar?: boolean;
  timezone?: string;
}

export interface TradingViewWidgetInstance {
  remove: () => void;
}

export {};
