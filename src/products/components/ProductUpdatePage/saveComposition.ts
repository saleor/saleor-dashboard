import { type ProductUpdateFormData } from "./types";

/** Scalar / org fields that map to `productUpdate` on Save. */
export const PRODUCT_DETAILS_SAVE_FIELDS: ReadonlyArray<keyof ProductUpdateFormData> = [
  "name",
  "slug",
  "seoTitle",
  "seoDescription",
  "rating",
  "weight",
  "taxClassId",
  "category",
  "collections",
];

export interface ProductSaveComposition {
  hasDetails: boolean;
  dirtyChannelCount: number;
  variantEditCount: number;
  variantCreateCount: number;
  variantDeleteCount: number;
}

export interface BuildProductSaveCompositionInput {
  changedFieldNames: ReadonlyArray<string>;
  descriptionDirty: boolean;
  attributesDirty: boolean;
  dirtyChannelCount: number;
  variantEditCount: number;
  variantCreateCount: number;
  variantDeleteCount: number;
}

export const buildProductSaveComposition = ({
  changedFieldNames,
  descriptionDirty,
  attributesDirty,
  dirtyChannelCount,
  variantEditCount,
  variantCreateCount,
  variantDeleteCount,
}: BuildProductSaveCompositionInput): ProductSaveComposition => {
  const hasDetails =
    descriptionDirty ||
    attributesDirty ||
    PRODUCT_DETAILS_SAVE_FIELDS.some(field => changedFieldNames.includes(field));

  return {
    hasDetails,
    dirtyChannelCount: Math.max(0, dirtyChannelCount),
    variantEditCount: Math.max(0, variantEditCount),
    variantCreateCount: Math.max(0, variantCreateCount),
    variantDeleteCount: Math.max(0, variantDeleteCount),
  };
};

export const hasProductSaveComposition = (composition: ProductSaveComposition): boolean =>
  composition.hasDetails ||
  composition.dirtyChannelCount > 0 ||
  composition.variantEditCount > 0 ||
  composition.variantCreateCount > 0 ||
  composition.variantDeleteCount > 0;
