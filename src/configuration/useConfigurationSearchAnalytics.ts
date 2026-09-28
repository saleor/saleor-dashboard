import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { useEffect } from "react";

const NO_RESULTS_DEBOUNCE_MS = 500;

export const getConfigurationSearchQueryLength = (query: string): "1-3" | "4-10" | "11+" => {
  const length = query.trim().length;

  if (length <= 3) {
    return "1-3";
  }

  return length <= 10 ? "4-10" : "11+";
};

export const useConfigurationSearchAnalytics = (query: string, resultCount: number): void => {
  const { trackEvent } = useAnalytics();
  const normalizedQuery = query.trim();

  useEffect(
    function trackConfigurationSearchWithoutResults() {
      if (!normalizedQuery || resultCount > 0) {
        return;
      }

      const timeout = window.setTimeout(() => {
        trackEvent("configuration_search_no_results", {
          query_length: getConfigurationSearchQueryLength(normalizedQuery),
        });
      }, NO_RESULTS_DEBOUNCE_MS);

      return () => window.clearTimeout(timeout);
    },
    [normalizedQuery, resultCount, trackEvent],
  );
};
