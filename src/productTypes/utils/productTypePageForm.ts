import { type ProductTypeForm } from "@dashboard/productTypes/components/ProductTypeDetailsPage/ProductTypeDetailsPage";
import {
  buildProductTypeSaveComposition,
  hasProductTypeSaveComposition,
} from "@dashboard/productTypes/components/ProductTypeDetailsPage/saveComposition";

interface AssignedVariantAttribute {
  variantSelection: boolean;
  attribute: {
    id: string;
  };
}

export function getVariantSelectionFromAssigned(
  assignedVariantAttributes: AssignedVariantAttribute[] | undefined | null,
): string[] {
  return (assignedVariantAttributes ?? [])
    .filter(item => item.variantSelection)
    .map(item => item.attribute.id)
    .sort();
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
