import { type AvailabilityIssue } from "./types";

/**
 * The "blocking" severity types that drive the channel issue badge —
 * informational advisories are intentionally excluded so that purely
 * advisory hints (e.g. "stock is in warehouses not assigned to this
 * channel") do not flip a channel into a "has issues" visual state.
 */
export type BlockingIssueType = "error" | "warning";

export interface IssueBadgeProps {
  count: number;
  type: BlockingIssueType;
}

/**
 * Compute the props that the channel header IssueBadge should render for a
 * given list of per-channel availability issues.
 *
 * Rules:
 *  - Only `error` and `warning` issues count toward the badge ("blocking"
 *    issues). `info` advisories are surfaced inside the channel body but do
 *    not promote the channel into the "has issues" header state.
 *  - When there are no blocking issues, returns `null` and the caller should
 *    not render a badge at all.
 *  - When at least one blocking issue is an error, the badge type is escalated
 *    to `"error"` so the icon and color reflect the most severe state.
 *
 * Pure function — no React, no intl. Intended for direct unit-testing of the
 * calculation logic separately from the rendered UI.
 */
export function getBlockingIssueBadgeProps(
  issues: readonly AvailabilityIssue[],
): IssueBadgeProps | null {
  let count = 0;
  let hasError = false;

  for (const issue of issues) {
    if (issue.severity === "error") {
      count += 1;
      hasError = true;
    } else if (issue.severity === "warning") {
      count += 1;
    }
  }

  if (count === 0) {
    return null;
  }

  return {
    count,
    type: hasError ? "error" : "warning",
  };
}
