import { ProductVariantBulkCreateInput } from "@dashboard/graphql";

import {
  AttributeValueSelection,
  AttributeWithSelections,
  ExistingVariantCombination,
  GeneratedVariantPreview,
  GeneratorDefaults,
} from "./types";

/**
 * Computes the Cartesian product of multiple arrays.
 * Example: cartesian([[a,b], [1,2]]) => [[a,1], [a,2], [b,1], [b,2]]
 */
export function cartesianProduct<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) {
    return [[]];
  }

  return arrays.reduce<T[][]>(
    (acc, arr) => acc.flatMap(combo => arr.map(item => [...combo, item])),
    [[]],
  );
}

/**
 * Extracts selected values from each attribute.
 */
export function getSelectedValues(attributes: AttributeWithSelections[]) {
  return attributes.map(attr => ({
    attributeId: attr.id,
    attributeName: attr.name,
    values: attr.values.filter(v => v.selected),
  }));
}

/**
 * Checks if a combination of attribute values already exists as a variant.
 */
function isCombinationExisting(
  combo: AttributeValueSelection[],
  selectedAttrs: Array<{ attributeId: string; values: AttributeValueSelection[] }>,
  existingCombinations: ExistingVariantCombination[][],
): boolean {
  return existingCombinations.some(existing =>
    combo.every((value, index) => {
      const attrId = selectedAttrs[index].attributeId;

      return existing.some(e => e.attributeId === attrId && e.valueSlug === value.slug);
    }),
  );
}

/**
 * Generates a preview of all variant combinations that would be created.
 */
export function generateVariantPreviews(
  attributes: AttributeWithSelections[],
  existingCombinations: ExistingVariantCombination[][],
): GeneratedVariantPreview[] {
  const selected = getSelectedValues(attributes);

  // If any attribute has no selections, return empty
  const hasEmptySelection = selected.some(s => s.values.length === 0);

  if (hasEmptySelection) {
    return [];
  }

  const valueCombinations = cartesianProduct(selected.map(s => s.values));

  return valueCombinations.map(combo => {
    const attributeValues = combo.map((value, index) => ({
      attributeName: selected[index].attributeName ?? "",
      valueName: value.name ?? "",
    }));

    const isExisting = isCombinationExisting(combo, selected, existingCombinations);

    return {
      name: combo.map(v => v.name ?? "").join(" / "),
      attributes: attributeValues,
      isExisting,
    };
  });
}

/**
 * Converts existing variants to a format suitable for comparison.
 */
export function extractExistingCombinations(
  existingVariants: Array<{
    attributes: Array<{
      attribute: { id: string };
      values: Array<{ slug: string | null }>;
    }>;
  }>,
): ExistingVariantCombination[][] {
  return existingVariants.map(variant =>
    variant.attributes.flatMap(attr =>
      attr.values.map(value => ({
        attributeId: attr.attribute.id,
        valueSlug: value.slug,
      })),
    ),
  );
}

/**
 * Converts the selected attribute combinations into bulk create input format.
 */
export function toBulkCreateInputs(
  attributes: AttributeWithSelections[],
  defaults: GeneratorDefaults,
  warehouses: Array<{ id: string }>,
  existingCombinations: ExistingVariantCombination[][],
): ProductVariantBulkCreateInput[] {
  const selected = getSelectedValues(attributes);

  // If any attribute has no selections, return empty
  if (selected.some(s => s.values.length === 0)) {
    return [];
  }

  const valueCombinations = cartesianProduct(selected.map(s => s.values));

  // Filter out existing combinations
  const newCombinations = valueCombinations.filter(
    combo => !isCombinationExisting(combo, selected, existingCombinations),
  );

  // Only create stocks if user provided a value
  const stockQuantity = defaults.stockQuantity.trim();
  const hasStockValue = stockQuantity !== "";
  const parsedStock = hasStockValue ? parseInt(stockQuantity, 10) : null;

  return newCombinations.map(combo => {
    const variantName = combo.map(v => v.name ?? "").join(" / ");

    const input: ProductVariantBulkCreateInput = {
      attributes: combo.map((value, attrIndex) => ({
        id: selected[attrIndex].attributeId,
        values: value.slug ? [value.slug] : [],
      })),
      name: variantName,
      // Only include stocks if user provided a value (including 0)
      ...(hasStockValue &&
        parsedStock !== null &&
        !isNaN(parsedStock) && {
          stocks: warehouses.map(w => ({
            warehouse: w.id,
            quantity: parsedStock,
          })),
        }),
    };

    return input;
  });
}
