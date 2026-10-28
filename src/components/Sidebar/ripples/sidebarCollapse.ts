import { type Ripple } from "@dashboard/ripples/types";

export const rippleSidebarCollapse: Ripple = {
  type: "feature",
  ID: "sidebar-collapse",
  TTL_seconds: 60 * 60 * 24 * 7, // 7 days
  dateAdded: new Date(2026, 9, 27),
  content: {
    oneLiner: "Collapsible navigation",
    contextual: "Shrink the navigation to icons to give your pages more room.",
    global:
      "Collapse the navigation to a slim icon rail to give lists and editors more room. Hover an icon to see its name, and click a section to open its pages. Expand it again with the same button or the keyboard shortcut.",
  },
};
