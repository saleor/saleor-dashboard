import { iconSize } from "@dashboard/components/icons";

/**
 * Visual contract for in-card assignable lists (collection products, attribute
 * values, product-type attributes, voucher codes, discount assign tables).
 *
 * Views pass content (columns, rows, assign action). Chrome — card header,
 * search band, table heading, hover-reveal delete, pagination — is owned here
 * and by `AssignableListCard` / `AssignableListPagination` / `AssignableListTable`.
 * Do not copy these numbers into feature CSS.
 */

/** Matches `DetailSettingsCard` `.headerWithEnd` right inset. */
export const ASSIGNABLE_LIST_TABLE_ACTION_INSET = 4;

/**
 * Left inset for nested/inset list cards (catalogue panels).
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

/** Locked table-heading row. Collection products, GridTable, and MUI assignableTable. */
export const ASSIGNABLE_LIST_TABLE_HEADER_HEIGHT_PX = 40;

/** Drag-handle column. Grip is centered; no extra left inset on the first cell. */
export const ASSIGNABLE_LIST_TABLE_DRAG_COLUMN_PX = 40;

/** Checkbox control width (the column is this plus the chosen leading inset). */
export const ASSIGNABLE_LIST_TABLE_CHECKBOX_CONTROL_PX = 20;

/** Thumbnail / media rows (collection products, discount products & variants). */
export const ASSIGNABLE_LIST_TABLE_MEDIA_ROW_HEIGHT = "50px";

/** Cell padding on header and body (`spacing-2`). */
export const ASSIGNABLE_LIST_TABLE_CELL_PADDING = 2;

/** Pagination band vertical padding. */
export const ASSIGNABLE_LIST_TABLE_PAGINATION_PADDING_Y = 2;

/** Search band inside `AssignableListCard`. */
export const ASSIGNABLE_LIST_TABLE_SEARCH_PADDING_Y = 3;
export const ASSIGNABLE_LIST_TABLE_SEARCH_PADDING_X = 6;

/** Empty-state padding inside a flush card. */
export const ASSIGNABLE_LIST_TABLE_EMPTY_PADDING = 4;

/**
 * Footer left inset when the table has a 40px drag column — grip icon centered
 * in that column, plus the same `spacing-2` used on leading header cells.
 */
export const ASSIGNABLE_LIST_TABLE_DRAG_ALIGNED_LEADING_INSET = `calc((${ASSIGNABLE_LIST_TABLE_DRAG_COLUMN_PX}px - ${iconSize.small}px) / 2 + var(--mu-spacing-${ASSIGNABLE_LIST_TABLE_CELL_PADDING}))`;

/** Checkbox control (~20px) plus the chosen left inset. */
export const getAssignableListCheckboxColumnWidth = (
  leadingInset: AssignableListTableLeadingInset,
): string =>
  `calc(var(--mu-spacing-${leadingInset}) + ${ASSIGNABLE_LIST_TABLE_CHECKBOX_CONTROL_PX}px)`;

/**
 * Header actions when bulk toolbar is visible (e.g. Unassign).
 * Wider so the toolbar label is not clipped under `table-layout: fixed`.
 */
export const ASSIGNABLE_LIST_TABLE_ACTIONS_COLUMN_WIDTH = "100px";

/** Row delete icon + right inset when no bulk toolbar is shown. */
export const ASSIGNABLE_LIST_TABLE_ACTIONS_COLUMN_WIDTH_COMPACT = "48px";
