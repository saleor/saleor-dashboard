import { type ProductListQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

type ProductListItems = NonNullable<RelayToFlat<ProductListQuery["products"]>>;
type AssignedAttributeItem = ProductListItems[number]["assignedAttributes"][number];

export function getDisplayValueFromAssignedAttribute(attr: AssignedAttributeItem): string {
  switch (attr.__typename) {
    case "AssignedSingleChoiceAttribute":
      return attr.singleChoiceValue?.name ?? "";
    case "AssignedMultiChoiceAttribute":
      return attr.multiChoiceValue.map((v: { name: string | null }) => v.name).join(", ");
    case "AssignedNumericAttribute":
      return attr.numericValue != null ? String(attr.numericValue) : "";
    case "AssignedPlainTextAttribute":
      return attr.plainTextValue ?? "";
    case "AssignedBooleanAttribute":
      return attr.booleanValue != null ? String(attr.booleanValue) : "";
    case "AssignedDateAttribute":
      return attr.dateValue ?? "";
    case "AssignedDateTimeAttribute":
      return attr.dateTimeValue ?? "";
    case "AssignedSwatchAttribute":
      return attr.swatchValue?.name ?? "";
    case "AssignedSinglePageReferenceAttribute":
      return attr.pageReferenceValue?.title ?? "";
    case "AssignedSingleProductReferenceAttribute":
      return attr.productReferenceValue?.name ?? "";
    case "AssignedSingleProductVariantReferenceAttribute":
      return attr.variantReferenceValue?.name ?? "";
    case "AssignedSingleCategoryReferenceAttribute":
      return attr.categoryReferenceValue?.name ?? "";
    case "AssignedSingleCollectionReferenceAttribute":
      return attr.collectionReferenceValue?.name ?? "";
    case "AssignedMultiPageReferenceAttribute":
      return attr.multiPageReferenceValue.map((v: { title: string }) => v.title).join(", ");
    case "AssignedMultiProductReferenceAttribute":
      return attr.multiProductReferenceValue.map((v: { name: string }) => v.name).join(", ");
    case "AssignedMultiProductVariantReferenceAttribute":
      return attr.multiVariantReferenceValue.map((v: { name: string }) => v.name).join(", ");
    case "AssignedMultiCategoryReferenceAttribute":
      return attr.multiCategoryReferenceValue.map((v: { name: string }) => v.name).join(", ");
    case "AssignedMultiCollectionReferenceAttribute":
      return attr.multiCollectionReferenceValue.map((v: { name: string }) => v.name).join(", ");
    default:
      return "";
  }
}
