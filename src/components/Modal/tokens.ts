/**
 * Macaw spacing tokens for modal layout. Keep in sync with CSS variables on
 * `.contentShell` in `DashboardModal.module.css`.
 */
export const MODAL_PADDING_SPACING = 6 as const;

/** Vertical padding for inset modal body content (forms, metadata, etc.). */
export const MODAL_BODY_INSET_PADDING_BLOCK_SPACING = MODAL_PADDING_SPACING;

/** Space between the header row and the divider on form/picker modals. */
export const MODAL_HEADER_DIVIDER_GAP_SPACING = 4 as const;
