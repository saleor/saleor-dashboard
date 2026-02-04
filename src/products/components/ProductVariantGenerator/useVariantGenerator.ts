import { VariantAttributeFragment } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useMemo, useState } from "react";

import {
  AttributeData,
  ExistingVariantCombination,
  ExistingVariantData,
  GeneratorDefaults,
  SelectionState,
} from "./types";
import { extractExistingCombinations, generateVariantPreviews } from "./utils";

interface UseVariantGeneratorProps {
  variantAttributes: VariantAttributeFragment[];
  existingVariants: ExistingVariantData;
  defaultSkuPrefix?: string;
}

export function useVariantGenerator({
  variantAttributes,
  existingVariants,
  defaultSkuPrefix = "",
}: UseVariantGeneratorProps) {
  // Static attribute data (doesn't change)
  const attributes: AttributeData[] = useMemo(
    () =>
      variantAttributes.map(attr => ({
        id: attr.id,
        name: attr.name,
        slug: attr.slug,
        inputType: attr.inputType,
        values: (mapEdgesToItems(attr.choices) || []).map(choice => ({
          id: choice.id,
          name: choice.name,
          slug: choice.slug,
          file: choice.file,
          value: choice.value,
        })),
      })),
    [variantAttributes],
  );

  // Selection state: attributeId -> Set of selected valueIds
  const [selections, setSelections] = useState<SelectionState>(() =>
    Object.fromEntries(variantAttributes.map(attr => [attr.id, new Set<string>()])),
  );

  const [defaults, setDefaults] = useState<GeneratorDefaults>({
    stockEnabled: false,
    stockQuantity: "",
    skuEnabled: false,
    skuPrefix: defaultSkuPrefix,
  });

  // Extract existing combinations for comparison
  const existingCombinations = useMemo<ExistingVariantCombination[][]>(
    () => extractExistingCombinations(existingVariants),
    [existingVariants],
  );

  // Toggle a single value selection
  const toggleValue = useCallback((attributeId: string, valueId: string) => {
    setSelections(prev => {
      const currentSet = prev[attributeId] ?? new Set();
      const newSet = new Set(currentSet);

      if (newSet.has(valueId)) {
        newSet.delete(valueId);
      } else {
        newSet.add(valueId);
      }

      return { ...prev, [attributeId]: newSet };
    });
  }, []);

  // Set all selected values for an attribute (used by multiselect)
  const setSelectedValues = useCallback((attributeId: string, valueIds: Set<string>) => {
    setSelections(prev => ({ ...prev, [attributeId]: valueIds }));
  }, []);

  // Select all values for an attribute
  const selectAllValues = useCallback(
    (attributeId: string) => {
      const attr = attributes.find(a => a.id === attributeId);

      if (attr) {
        setSelections(prev => ({
          ...prev,
          [attributeId]: new Set(attr.values.map(v => v.id)),
        }));
      }
    },
    [attributes],
  );

  // Deselect all values for an attribute
  const deselectAllValues = useCallback((attributeId: string) => {
    setSelections(prev => ({ ...prev, [attributeId]: new Set() }));
  }, []);

  // Generate previews
  const previewResult = useMemo(
    () => generateVariantPreviews(attributes, selections, existingCombinations),
    [attributes, selections, existingCombinations],
  );

  const { previews, totalCount, isTruncated } = previewResult;

  const newVariantsCount = useMemo(() => previews.filter(p => !p.isExisting).length, [previews]);

  const existingCount = useMemo(() => previews.filter(p => p.isExisting).length, [previews]);

  // Validation: every attribute must have at least one selection
  const hasSelectionPerAttribute = useMemo(
    () => attributes.every(attr => (selections[attr.id]?.size ?? 0) > 0),
    [attributes, selections],
  );

  // canGenerate: true when there are new variants to create and all attributes have selections
  const canGenerate = newVariantsCount > 0 && hasSelectionPerAttribute;

  // Matrix view requires exactly 2 attributes with selections
  const canShowMatrix = useMemo(() => {
    const attrsWithSelections = attributes.filter(attr => (selections[attr.id]?.size ?? 0) > 0);

    return attrsWithSelections.length === 2;
  }, [attributes, selections]);

  // Reset state (useful when modal reopens)
  const reset = useCallback(() => {
    setSelections(Object.fromEntries(variantAttributes.map(attr => [attr.id, new Set<string>()])));
    setDefaults({
      stockEnabled: false,
      stockQuantity: "",
      skuEnabled: false,
      skuPrefix: defaultSkuPrefix,
    });
  }, [variantAttributes, defaultSkuPrefix]);

  return {
    attributes,
    selections,
    defaults,
    setDefaults,
    toggleValue,
    setSelectedValues,
    selectAllValues,
    deselectAllValues,
    previews,
    newVariantsCount,
    existingCount,
    totalCount,
    isTruncated,
    existingCombinations,
    canGenerate,
    hasSelectionPerAttribute,
    canShowMatrix,
    reset,
  };
}
