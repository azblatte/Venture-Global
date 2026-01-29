"use client";

import { useState } from "react";

interface RefreshButtonProps {
  lastUpdated: string;
  source: string;
}

export function RefreshButton({ lastUpdated, source }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setMessage(null);

    try {
      // First, trigger price update from EIA
      const updateRes = await fetch("/api/cron/update-prices?manual=1");
      const updateData = await updateRes.json();

      if (updateData.success) {
        // Then revalidate pages
        await fetch("/api/refresh", { method: "POST" });
        setMessage(`Updated! Latest HH: $${updateData.latestHH?.toFixed(2)}`);
        // Reload after a short delay to show new data
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage(updateData.error || "Update failed");
      }
    } catch (error) {
      setMessage("Refresh failed");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-xs text-slate-500">
        <span>Last updated: {formatDate(lastUpdated)}</span>
        <span className="ml-2 text-slate-400">({source})</span>
      </div>
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        {isRefreshing ? (
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Updating...
          </span>
        ) : (
          "Refresh Prices"
        )}
      </button>
      {message && (
        <span className="text-xs text-emerald-600">{message}</span>
      )}
    </div>
  );
}
