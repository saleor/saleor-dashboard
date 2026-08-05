import { iconSize } from "@dashboard/components/icons";

/** Matches `DetailSettingsCard` `.headerWithEnd` right inset (Assign product button). */
export const COLLECTION_PRODUCT_TABLE_ACTION_INSET = 4;

/** Width of the drag column in `ProductsTable` colgroup. */
export const COLLECTION_PRODUCT_TABLE_DRAG_COLUMN_PX = 40;
export const COLLECTION_PRODUCT_TABLE_DRAG_COLUMN_WIDTH = "40px";

export const COLLECTION_PRODUCT_TABLE_CHECKBOX_COLUMN_PX = 20;
export const COLLECTION_PRODUCT_TABLE_CHECKBOX_COLUMN_WIDTH = "20px";

export const COLLECTION_PRODUCT_TABLE_NAME_COLUMN_WIDTH = "40%";

/** Product type names are short; keep this column tight for availability copy. */
export const COLLECTION_PRODUCT_TABLE_TYPE_COLUMN_WIDTH = "14%";

export const COLLECTION_PRODUCT_TABLE_AVAILABILITY_COLUMN_WIDTH = "30%";

export const COLLECTION_PRODUCT_TABLE_ACTIONS_COLUMN_WIDTH = "100px";

/**
 * Footer left inset — matches the drag grip (16px icon centered in the 40px column)
 * plus the same `spacing-2` inset used on the header's leading cells.
 */
export const COLLECTION_PRODUCT_TABLE_LEADING_INSET = `calc((${COLLECTION_PRODUCT_TABLE_DRAG_COLUMN_WIDTH} - ${iconSize.small}px) / 2 + var(--mu-spacing-2))`;
