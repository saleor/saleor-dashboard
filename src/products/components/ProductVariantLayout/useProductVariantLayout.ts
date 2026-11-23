import { useMediaQuery } from "@dashboard/hooks/useMediaQuery";

/**
 * - `columns`: the variant list sits beside the form and stays in view while the form scrolls.
 * - `stacked`: the form takes the whole row; the variant list folds into a switcher above it.
 */
export type ProductVariantLayoutMode = "columns" | "stacked";

/** Below this width the form no longer fits beside a readable list. */
const STACKED_QUERY = "(max-width: 1279px)";

export const useProductVariantLayout = (): ProductVariantLayoutMode =>
  useMediaQuery(STACKED_QUERY) ? "stacked" : "columns";
