import { type AvailabilityIssue } from "./types";

/**
 * Severities that get promoted into the channel header badge.
 *
 * Note: in plain English a "warning" is *not* blocking — it advises caution
 * but does not stop the user. Both `error` and `warning` are surfaced in the
 * header here because they are non-advisory, action-worthy signals; `info`
 * advisories stay inside the channel body. The shared header treatment is a
 * UX choice, not a claim that warnings block anything.
 */
export type HeaderIssueType = "error" | "warning";

export interface IssueBadgeProps {
  count: number;
  type: HeaderIssueType;
}

/**
 * Compute the props that the channel header `IssueBadge` should render for a
 * given list of per-channel availability issues.
 *
 * Rules:
 *  - Only `error` and `warning` issues count toward the badge. `info`
 *    advisories are surfaced inside the channel body but do not promote the
 *    channel into the "has issues" header state.
 *  - When there are no header-worthy issues, returns `null` and the caller
 *    should not render a badge at all.
 *  - When at least one header issue is an error, the badge type is escalated
 *    to `"error"` so the icon and color reflect the most severe state.
 *
 * Pure function — no React, no intl. Intended for direct unit-testing of the
 * calculation logic separately from the rendered UI.
 */
export function getHeaderIssueBadgeProps(
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
