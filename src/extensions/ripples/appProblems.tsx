import { type Ripple } from "@dashboard/ripples/types";

export const rippleAppProblems: Ripple = {
  type: "feature",
  ID: "app-problems",
  TTL_seconds: 60 * 60 * 24 * 2, // 2 days
  content: {
    oneLiner: "App problems visibility",
    contextual: "You can now see issues with apps directly in the extensions list.",
    global:
      "App problems are now visible in the installed extensions page. When an app has issues, you will see a badge indicating the number of problems and their severity.",
  },
  dateAdded: new Date(2026, 1),
};
