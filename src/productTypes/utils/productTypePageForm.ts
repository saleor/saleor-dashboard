import { type ProductTypeKindEnum } from "@dashboard/graphql";
import { type ProductTypeForm } from "@dashboard/productTypes/components/ProductTypeDetailsPage/ProductTypeDetailsPage";
import isEqual from "lodash/isEqual";

export interface ProductTypeUpdateComparableData {
  name: string;
  kind: ProductTypeKindEnum;
  isShippingRequired: boolean;
  taxClassId: string;
  weight: number | undefined;
  variantSelection: string[];
}

interface AssignedVariantAttribute {
  variantSelection: boolean;
  attribute: {
    id: string;
  };
}

export function getVariantSelectionIds(selectedVariantAttributes: string[]): string[] {
  return [...selectedVariantAttributes].sort();
}

export function getVariantSelectionFromAssigned(
  assignedVariantAttributes: AssignedVariantAttribute[] | undefined | null,
): string[] {
  return (assignedVariantAttributes ?? [])
    .filter(item => item.variantSelection)
    .map(item => item.attribute.id)
    .sort();
}

export function getProductTypeUpdateComparableData(
  data: ProductTypeForm,
  selectedVariantAttributes: string[],
): ProductTypeUpdateComparableData {
  return {
    name: data.name,
    kind: data.kind,
    isShippingRequired: data.isShippingRequired,
    taxClassId: data.taxClassId,
    weight: data.weight,
    variantSelection: getVariantSelectionIds(selectedVariantAttributes),
  };
}

export function isProductTypeUpdateFormPristine(
  data: ProductTypeForm,
  initialData: ProductTypeForm,
  selectedVariantAttributes: string[],
  initialVariantSelection: string[],
): boolean {
  return isEqual(
    getProductTypeUpdateComparableData(data, selectedVariantAttributes),
    getProductTypeUpdateComparableData(initialData, initialVariantSelection),
  );
}
