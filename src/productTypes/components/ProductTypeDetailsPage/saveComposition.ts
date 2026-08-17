import { type ProductTypeKindEnum } from "@dashboard/graphql";

export interface ProductTypeSaveComposition {
  hasGeneral: boolean;
  hasShipping: boolean;
  hasTaxes: boolean;
  hasVariantSelection: boolean;
}

interface ProductTypeSaveCompositionInput {
  name: string;
  kind: ProductTypeKindEnum;
  isShippingRequired: boolean;
  taxClassId: string;
  weight: number | undefined;
}

const sortedIds = (ids: string[]): string => [...ids].sort().join();

/**
 * Save persists general, shipping, taxes, and variant-selection checkboxes.
 * Attribute assign/reorder and the options toggle are live mutations.
 */
export const buildProductTypeSaveComposition = (
  data: ProductTypeSaveCompositionInput,
  initialData: ProductTypeSaveCompositionInput,
  selectedVariantAttributes: string[],
  initialVariantSelection: string[],
): ProductTypeSaveComposition => ({
  hasGeneral: data.name !== initialData.name || data.kind !== initialData.kind,
  hasShipping:
    data.isShippingRequired !== initialData.isShippingRequired ||
    data.weight !== initialData.weight,
  hasTaxes: data.taxClassId !== initialData.taxClassId,
  hasVariantSelection: sortedIds(selectedVariantAttributes) !== sortedIds(initialVariantSelection),
});

export const hasProductTypeSaveComposition = (composition: ProductTypeSaveComposition): boolean =>
  composition.hasGeneral ||
  composition.hasShipping ||
  composition.hasTaxes ||
  composition.hasVariantSelection;

export const EMPTY_PRODUCT_TYPE_SAVE_COMPOSITION: ProductTypeSaveComposition = {
  hasGeneral: false,
  hasShipping: false,
  hasTaxes: false,
  hasVariantSelection: false,
};
