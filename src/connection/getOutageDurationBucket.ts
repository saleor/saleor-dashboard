/** Outage lengths grouped for analytics. */
export const getOutageDurationBucket = (
  durationMs: number,
): "0-10s" | "10-60s" | "1-5m" | "5m+" => {
  if (durationMs < 10_000) {
    return "0-10s";
  }

  if (durationMs < 60_000) {
    return "10-60s";
  }

  return durationMs < 300_000 ? "1-5m" : "5m+";
};
