import { ProductVariantBulkCreateInput } from "@dashboard/graphql";
import slugify from "slugify";

import {
  AttributeData,
  AttributeValue,
  ExistingVariantCombination,
  ExistingVariantData,
  GeneratedVariantPreview,
  GeneratorDefaults,
  SelectionState,
} from "./types";

// Safety limit to prevent browser freeze on huge combinations
export const MAX_COMBINATIONS = 1000;

export interface CartesianResult<T> {
  combinations: T[][];
  totalCount: number;
  isTruncated: boolean;
}

/**
 * Computes the Cartesian product of multiple arrays.
 * Example: cartesian([[a,b], [1,2]]) => [[a,1], [a,2], [b,1], [b,2]]
 * Stops early if result exceeds MAX_COMBINATIONS to prevent browser freeze.
 * Returns metadata about truncation so UI can inform users.
 */
export function cartesianProduct<T>(arrays: T[][]): CartesianResult<T> {
  if (arrays.length === 0) {
    return { combinations: [[]], totalCount: 1, isTruncated: false };
  }

  // Calculate total combinations upfront
  const totalCount = arrays.reduce((acc, arr) => acc * arr.length, 1);
  const isTruncated = totalCount > MAX_COMBINATIONS;

  if (isTruncated) {
    // Return truncated result - compute only up to limit
    let result: T[][] = [[]];

    for (const arr of arrays) {
      const newResult: T[][] = [];

      for (const combo of result) {
        for (const item of arr) {
          newResult.push([...combo, item]);

          if (newResult.length >= MAX_COMBINATIONS) {
            return { combinations: newResult, totalCount, isTruncated: true };
          }
        }
      }

      result = newResult;
    }

    return { combinations: result, totalCount, isTruncated: true };
  }

  const combinations = arrays.reduce<T[][]>(
    (acc, arr) => acc.flatMap(combo => arr.map(item => [...combo, item])),
    [[]],
  );

  return { combinations, totalCount, isTruncated: false };
}

/**
 * Gets selected values for each attribute based on selection state.
 */
function getSelectedValues(attributes: AttributeData[], selections: SelectionState) {
  return attributes.map(attr => ({
    attributeId: attr.id,
    attributeName: attr.name,
    values: attr.values.filter(v => selections[attr.id]?.has(v.id)),
  }));
}

/**
 * Checks if a combination of attribute values already exists as a variant.
 */
function isCombinationExisting(
  combo: AttributeValue[],
  selectedAttrs: Array<{ attributeId: string; values: AttributeValue[] }>,
  existingCombinations: ExistingVariantCombination[][],
): boolean {
  return existingCombinations.some(
    existing =>
      existing.length === combo.length &&
      combo.every((value, index) => {
        const attrId = selectedAttrs[index].attributeId;

        return existing.some(e => e.attributeId === attrId && e.valueSlug === value.slug);
      }),
  );
}

export interface VariantPreviewResult {
  previews: GeneratedVariantPreview[];
  totalCount: number;
  isTruncated: boolean;
}

/**
 * Generates a preview of all variant combinations that would be created.
 * Prioritizes new variants over existing ones when truncated.
 */
export function generateVariantPreviews(
  attributes: AttributeData[],
  selections: SelectionState,
  existingCombinations: ExistingVariantCombination[][],
): VariantPreviewResult {
  const selected = getSelectedValues(attributes, selections);

  // If any attribute has no selections, return empty
  const hasEmptySelection = selected.some(s => s.values.length === 0);

  if (hasEmptySelection) {
    return { previews: [], totalCount: 0, isTruncated: false };
  }

  const { combinations, totalCount, isTruncated } = cartesianProduct(selected.map(s => s.values));

  const previews = combinations.map(combo => {
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

  // Sort to show new variants first (more useful when truncated)
  const sortedPreviews = [...previews].sort((a, b) => {
    if (a.isExisting === b.isExisting) return 0;

    return a.isExisting ? 1 : -1; // New first
  });

  return { previews: sortedPreviews, totalCount, isTruncated };
}

/**
 * Converts existing variants to a format suitable for comparison.
 */
export function extractExistingCombinations(
  existingVariants: ExistingVariantData,
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
  attributes: AttributeData[],
  selections: SelectionState,
  defaults: GeneratorDefaults,
  warehouses: Array<{ id: string }>,
  existingCombinations: ExistingVariantCombination[][],
): ProductVariantBulkCreateInput[] {
  const selected = getSelectedValues(attributes, selections);

  // If any attribute has no selections, return empty
  if (selected.some(s => s.values.length === 0)) {
    return [];
  }

  const { combinations } = cartesianProduct(selected.map(s => s.values));

  // Filter out existing combinations
  const newCombinations = combinations.filter(
    combo => !isCombinationExisting(combo, selected, existingCombinations),
  );

  // Only create stocks if user provided a value
  const stockQuantity = defaults.stockQuantity.trim();
  const hasStockValue = stockQuantity !== "";
  const parsedStock = hasStockValue ? parseInt(stockQuantity, 10) : null;

  // Generate SKU from prefix + attribute slugs (only if enabled and prefix provided)
  const skuPrefix = defaults.skuPrefix.trim();
  const shouldGenerateSku = defaults.skuEnabled && skuPrefix !== "";

  return newCombinations.map(combo => {
    const variantName = combo.map(v => v.name ?? "").join(" / ");

    // SKU is optional - only generate if enabled and prefix provided
    let sku: string | undefined;

    if (shouldGenerateSku) {
      const skuParts = combo
        .map(v => v.slug ?? (v.name ? slugify(v.name).toLowerCase() : ""))
        .filter(Boolean);

      sku = [skuPrefix, ...skuParts].join("-");
    }

    const input: ProductVariantBulkCreateInput = {
      attributes: combo.map((value, attrIndex) => ({
        id: selected[attrIndex].attributeId,
        values: value.slug ? [value.slug] : [],
      })),
      name: variantName,
      // Only include SKU if enabled
      ...(sku && { sku }),
      // Only include stocks if enabled and user provided a valid non-negative value
      ...(defaults.stockEnabled &&
        hasStockValue &&
        parsedStock !== null &&
        !isNaN(parsedStock) &&
        parsedStock >= 0 && {
          stocks: warehouses.map(w => ({
            warehouse: w.id,
            quantity: parsedStock,
          })),
        }),
    };

    return input;
  });
}
