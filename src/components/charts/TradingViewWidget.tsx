"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  height?: number;
  interval?: string;
  theme?: "light" | "dark";
  allowSymbolChange?: boolean;
  hideTopToolbar?: boolean;
  hideSideToolbar?: boolean;
}

function TradingViewWidgetInner({
  symbol,
  height = 400,
  interval = "D",
  theme = "light",
  allowSymbolChange = true,
  hideTopToolbar = false,
  hideSideToolbar = true,
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = "";

    // Create container for widget
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = `calc(100% - 32px)`;
    widgetDiv.style.width = "100%";

    const copyright = document.createElement("div");
    copyright.className = "tradingview-widget-copyright";
    copyright.innerHTML = `<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="text-[10px] text-slate-400">TradingView</span></a>`;

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(copyright);
    containerRef.current.appendChild(widgetContainer);

    // Create and inject the script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: "America/New_York",
      theme: theme,
      style: "1",
      locale: "en",
      allow_symbol_change: allowSymbolChange,
      hide_top_toolbar: hideTopToolbar,
      hide_side_toolbar: hideSideToolbar,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    widgetDiv.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, interval, theme, allowSymbolChange, hideTopToolbar, hideSideToolbar]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${height}px`, width: "100%" }}
      className="overflow-hidden rounded-lg"
    />
  );
}

export const TradingViewWidget = memo(TradingViewWidgetInner);

// Mini widget variant for smaller displays
interface MiniWidgetProps {
  symbol: string;
  height?: number;
}

function TradingViewMiniWidgetInner({ symbol, height = 220 }: MiniWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = "100%";
    widgetDiv.style.width = "100%";

    widgetContainer.appendChild(widgetDiv);
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: "12M",
      colorTheme: "light",
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
    });

    widgetDiv.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${height}px`, width: "100%" }}
      className="overflow-hidden"
    />
  );
}

export const TradingViewMiniWidget = memo(TradingViewMiniWidgetInner);

export default TradingViewWidget;
