import { type ReactNode } from "react";

export type SetupChecklistTaskStatus =
  | "pending"
  | "active"
  | "locked"
  | "completed"
  /** Guidance / outbound link — not a completable checklist item. */
  | "optional";

export interface SetupChecklistTask {
  id: string;
  title: ReactNode;
  description: ReactNode;
  status: SetupChecklistTaskStatus;
  /** Shown next to the title when the step depends on another step. */
  requirement?: ReactNode;
  /**
   * Longer merchant-facing explanation shown when the row is expanded.
   * When set, a chevron is shown. `action` always stays in the row header.
   */
  details?: ReactNode;
  /** Optional icon shown beside `details`. */
  detailsIcon?: ReactNode;
  action?: ReactNode;
}

export interface SetupChecklistProgress {
  done: number;
  total: number;
}

export interface SetupChecklistReviewItem {
  id: string;
  icon: ReactNode;
  /** Filled primary-style tile for the main CTA row (e.g. “Add products”). */
  iconVariant?: "default" | "accent";
  title: ReactNode;
  description: ReactNode;
  /** Short status on the right (e.g. “Flat rates”, “2 payment apps”). */
  status?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export interface SetupChecklistSectionHeader {
  title: ReactNode;
  subtitle?: ReactNode;
}

export interface SetupChecklistReviewSection extends SetupChecklistSectionHeader {
  items: SetupChecklistReviewItem[];
}

export interface SetupChecklistProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional status pill next to the title (e.g. Draft). */
  badge?: ReactNode;
  /**
   * Progress for the header counter/bar.
   * Defaults to completed tasks / all tasks when omitted.
   */
  progress?: SetupChecklistProgress;
  /** Label above required tasks, e.g. “Required by checkout”. */
  tasksSection?: SetupChecklistSectionHeader;
  tasks: SetupChecklistTask[];
  /** Secondary nav rows (taxes, payments, …) below required tasks. */
  reviewSection?: SetupChecklistReviewSection;
  /** Left-side footer hint, e.g. “Next up: …”. */
  nextUp?: ReactNode;
  /** Right-side footer actions (Skip, primary CTA, etc.). */
  footerActions?: ReactNode;
  className?: string;
  "data-test-id"?: string;
}
