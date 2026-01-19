import { VariantAttributeFragment } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useMemo, useState } from "react";

import { AttributeWithSelections, ExistingVariantCombination, GeneratorDefaults } from "./types";
import { extractExistingCombinations, generateVariantPreviews } from "./utils";

interface UseVariantGeneratorProps {
  variantAttributes: VariantAttributeFragment[];
  existingVariants: Array<{
    attributes: Array<{
      attribute: { id: string };
      values: Array<{ slug: string | null }>;
    }>;
  }>;
}

export function useVariantGenerator({
  variantAttributes,
  existingVariants,
}: UseVariantGeneratorProps) {
  // Initialize attributes with all values deselected by default (safety measure)
  const [attributes, setAttributes] = useState<AttributeWithSelections[]>(() =>
    variantAttributes.map(attr => ({
      id: attr.id,
      name: attr.name,
      slug: attr.slug,
      inputType: attr.inputType,
      values: (mapEdgesToItems(attr.choices) || []).map(choice => ({
        id: choice.id,
        name: choice.name,
        slug: choice.slug,
        selected: false,
        file: choice.file,
        value: choice.value,
      })),
    })),
  );

  const [defaults, setDefaults] = useState<GeneratorDefaults>({
    stockQuantity: "",
    priceAmount: "",
  });

  // Extract existing combinations for comparison
  const existingCombinations = useMemo<ExistingVariantCombination[][]>(
    () => extractExistingCombinations(existingVariants),
    [existingVariants],
  );

  // Toggle a single value selection
  const toggleValue = useCallback((attributeId: string, valueId: string) => {
    setAttributes(prev =>
      prev.map(attr =>
        attr.id === attributeId
          ? {
              ...attr,
              values: attr.values.map(v =>
                v.id === valueId ? { ...v, selected: !v.selected } : v,
              ),
            }
          : attr,
      ),
    );
  }, []);

  // Select all values for an attribute
  const selectAllValues = useCallback((attributeId: string) => {
    setAttributes(prev =>
      prev.map(attr =>
        attr.id === attributeId
          ? { ...attr, values: attr.values.map(v => ({ ...v, selected: true })) }
          : attr,
      ),
    );
  }, []);

  // Deselect all values for an attribute
  const deselectAllValues = useCallback((attributeId: string) => {
    setAttributes(prev =>
      prev.map(attr =>
        attr.id === attributeId
          ? { ...attr, values: attr.values.map(v => ({ ...v, selected: false })) }
          : attr,
      ),
    );
  }, []);

  // Generate previews
  const previews = useMemo(
    () => generateVariantPreviews(attributes, existingCombinations),
    [attributes, existingCombinations],
  );

  const newVariantsCount = useMemo(() => previews.filter(p => !p.isExisting).length, [previews]);

  const existingCount = useMemo(() => previews.filter(p => p.isExisting).length, [previews]);

  // Validation
  const hasSelectionPerAttribute = useMemo(
    () => attributes.every(attr => attr.values.some(v => v.selected)),
    [attributes],
  );

  const canGenerate = newVariantsCount > 0 && hasSelectionPerAttribute;

  // Reset state (useful when modal reopens)
  const reset = useCallback(() => {
    setAttributes(
      variantAttributes.map(attr => ({
        id: attr.id,
        name: attr.name,
        slug: attr.slug,
        inputType: attr.inputType,
        values: (mapEdgesToItems(attr.choices) || []).map(choice => ({
          id: choice.id,
          name: choice.name,
          slug: choice.slug,
          selected: false,
          file: choice.file,
          value: choice.value,
        })),
      })),
    );
    setDefaults({ stockQuantity: "", priceAmount: "" });
  }, [variantAttributes]);

  return {
    attributes,
    defaults,
    setDefaults,
    toggleValue,
    selectAllValues,
    deselectAllValues,
    previews,
    newVariantsCount,
    existingCount,
    existingCombinations,
    canGenerate,
    hasSelectionPerAttribute,
    reset,
  };
}
