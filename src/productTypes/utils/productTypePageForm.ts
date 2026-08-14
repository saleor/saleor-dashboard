import { type ProductTypeKindEnum } from "@dashboard/graphql";
import { type ProductTypeForm } from "@dashboard/productTypes/components/ProductTypeDetailsPage/ProductTypeDetailsPage";
import {
  buildProductTypeSaveComposition,
  hasProductTypeSaveComposition,
} from "@dashboard/productTypes/components/ProductTypeDetailsPage/saveComposition";

interface AssignedVariantAttribute {
  variantSelection: boolean;
  attribute: {
    id: string;
    name?: string | null;
  };
}

interface ProductTypeAttributeNameSource {
  productAttributes?: Array<{ id: string; name?: string | null }> | null;
  variantAttributes?: Array<{ id: string; name?: string | null }> | null;
  assignedVariantAttributes?: AssignedVariantAttribute[] | null;
}

export interface ProductTypeSaveInput {
  isShippingRequired: boolean;
  name: string;
  kind: ProductTypeKindEnum;
  taxClass: string | null;
  weight: number | undefined;
}

export function getVariantSelectionFromAssigned(
  assignedVariantAttributes: AssignedVariantAttribute[] | undefined | null,
): string[] {
  return (assignedVariantAttributes ?? [])
    .filter(item => item.variantSelection)
    .map(item => item.attribute.id)
    .sort();
}

export function findProductTypeAttributeName(
  productType: ProductTypeAttributeNameSource | null | undefined,
  attributeId: string | null | undefined,
): string | undefined {
  if (!productType || !attributeId) {
    return undefined;
  }

  const productName = productType.productAttributes?.find(
    attribute => attribute.id === attributeId,
  )?.name;

  if (productName) {
    return productName;
  }

  const assignedName = productType.assignedVariantAttributes?.find(
    item => item.attribute.id === attributeId,
  )?.attribute.name;

  if (assignedName) {
    return assignedName;
  }

  return (
    productType.variantAttributes?.find(attribute => attribute.id === attributeId)?.name ??
    undefined
  );
}

/**
 * Save writes general / shipping / taxes only. Attribute membership and
 * `hasVariants` are live mutations — sending those lists from stale form
 * state re-assigns attributes the merchant just unassigned.
 */
export function buildProductTypeSaveInput(
  data: Pick<ProductTypeForm, "isShippingRequired" | "name" | "kind" | "taxClassId" | "weight">,
): ProductTypeSaveInput {
  return {
    isShippingRequired: data.isShippingRequired,
    name: data.name,
    kind: data.kind,
    taxClass: data.taxClassId || null,
    weight: data.weight,
  };
}

export function buildVariantSelectionOperations(
  assignedVariantAttributes: AssignedVariantAttribute[] | null | undefined,
  selectedVariantAttributes: string[],
): Array<{ id: string; variantSelection: boolean }> {
  return (assignedVariantAttributes ?? []).map(item => ({
    id: item.attribute.id,
    variantSelection: selectedVariantAttributes.includes(item.attribute.id),
  }));
}

export function isProductTypeUpdateFormPristine(
  data: ProductTypeForm,
  initialData: ProductTypeForm,
  selectedVariantAttributes: string[],
  initialVariantSelection: string[],
): boolean {
  return !hasProductTypeSaveComposition(
    buildProductTypeSaveComposition(
      data,
      initialData,
      selectedVariantAttributes,
      initialVariantSelection,
    ),
  );
}
