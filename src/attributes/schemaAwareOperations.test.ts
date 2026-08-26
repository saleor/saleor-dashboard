import {
  AttributeDetailsDocument,
  AttributeListDocument,
  AttributeUpdateDocument,
  PageTypeAssignedAttributesForListDocument,
  ProductTypeAssignedAttributesForListDocument,
} from "@dashboard/graphql";
import {
  AttributeDetailsStaging,
  AttributeListStaging,
  AttributeUpdateStaging,
  PageTypeAssignedAttributesForListStaging,
  ProductTypeAssignedAttributesForListStaging,
} from "@dashboard/graphql/staging";
import { type DocumentNode, print } from "graphql";

// Removed from the `Attribute` type in 3.24.
const FACETED_NAVIGATION_FIELDS = [
  "availableInGrid",
  "filterableInStorefront",
  "storefrontSearchPosition",
];

const selectsFacetedNavigation = (document: DocumentNode): boolean =>
  FACETED_NAVIGATION_FIELDS.some(field => print(document).includes(field));

describe("attribute documents split by schema version", () => {
  it.each([
    ["AttributeDetails", AttributeDetailsDocument],
    ["AttributeList", AttributeListDocument],
    ["AttributeUpdate", AttributeUpdateDocument],
    ["PageTypeAssignedAttributesForList", PageTypeAssignedAttributesForListDocument],
    ["ProductTypeAssignedAttributesForList", ProductTypeAssignedAttributesForListDocument],
  ])("main %s keeps the faceted navigation settings 3.23 still renders", (_name, document) => {
    // Arrange & Act & Assert
    expect(selectsFacetedNavigation(document)).toBe(true);
  });

  it.each([
    ["AttributeDetails", AttributeDetailsStaging],
    ["AttributeList", AttributeListStaging],
    ["AttributeUpdate", AttributeUpdateStaging],
    ["PageTypeAssignedAttributesForList", PageTypeAssignedAttributesForListStaging],
    ["ProductTypeAssignedAttributesForList", ProductTypeAssignedAttributesForListStaging],
  ])("staging %s drops fields the 3.24 API no longer has", (_name, document) => {
    // Arrange & Act & Assert
    expect(selectsFacetedNavigation(document)).toBe(false);
  });
});
