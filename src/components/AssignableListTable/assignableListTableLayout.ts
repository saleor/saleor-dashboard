/** Matches product assign tables / DetailSettingsCard header action inset. */
export const ASSIGNABLE_LIST_TABLE_ACTION_INSET = 4;

/**
 * Standard left inset for nested/inset list cards (catalogue panels).
 * Matches Macaw `spacing-4`.
 */
export const ASSIGNABLE_LIST_TABLE_LEADING_INSET = 4;

/**
 * Left inset when the table is flush inside a `DetailSettingsCard` —
 * matches header/intro X padding (`spacing-6`) so checkboxes line up with the title.
 */
export const ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET = 6;

export type AssignableListTableLeadingInset =
  | typeof ASSIGNABLE_LIST_TABLE_LEADING_INSET
  | typeof ASSIGNABLE_LIST_TABLE_CARD_LEADING_INSET;

/** Checkbox control (~20px) plus the chosen left inset. */
export const getAssignableListCheckboxColumnWidth = (
  leadingInset: AssignableListTableLeadingInset,
): string => `calc(var(--mu-spacing-${leadingInset}) + 20px)`;

/**
 * Header actions when bulk toolbar is visible (e.g. Unassign).
 * Wider so the toolbar label is not clipped under `table-layout: fixed`.
 */
export const ASSIGNABLE_LIST_TABLE_ACTIONS_COLUMN_WIDTH = "100px";

/** Row delete icon + right inset when no bulk toolbar is shown. */
export const ASSIGNABLE_LIST_TABLE_ACTIONS_COLUMN_WIDTH_COMPACT = "48px";
