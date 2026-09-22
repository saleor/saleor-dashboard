import { getVariantSelectionFromAssigned } from "@dashboard/productTypes/utils/productTypePageForm";
import { useCallback, useMemo, useState } from "react";

interface AssignedVariantAttribute {
  variantSelection: boolean;
  attribute: {
    id: string;
  };
}

interface VariantSelectionDraft {
  typeId: string;
  ids: string[];
}

/**
 * Variant-selection checkboxes are staged until Save. Follow the server list
 * until the merchant edits, so cache→network details loads stay pristine.
 * Keep the draft across assigned-list identity changes (refetch after assign).
 */
export const useProductTypeVariantSelection = (
  productTypeId: string | undefined,
  assignedVariantAttributes: AssignedVariantAttribute[] | undefined | null,
): {
  selectedVariantAttributes: string[];
  setSelectedVariantAttributes: (ids: string[]) => void;
} => {
  const serverSelection = useMemo(
    () => getVariantSelectionFromAssigned(assignedVariantAttributes),
    [assignedVariantAttributes],
  );
  const assignedIds = useMemo(
    () => new Set((assignedVariantAttributes ?? []).map(item => item.attribute.id)),
    [assignedVariantAttributes],
  );
  const [draft, setDraft] = useState<VariantSelectionDraft | null>(null);
  const selectedVariantAttributes = useMemo(() => {
    if (!productTypeId || draft?.typeId !== productTypeId) {
      return serverSelection;
    }

    // Live unassign removes membership immediately. Drop those ids from the
    // staged selection so Save does not send operations for them.
    if (assignedVariantAttributes == null) {
      return draft.ids;
    }

    return draft.ids.filter(attributeId => assignedIds.has(attributeId));
  }, [assignedIds, assignedVariantAttributes, draft, productTypeId, serverSelection]);
  const setSelectedVariantAttributes = useCallback(
    (ids: string[]) => {
      if (!productTypeId) {
        return;
      }

      setDraft({ typeId: productTypeId, ids });
    },
    [productTypeId],
  );

  return {
    selectedVariantAttributes,
    setSelectedVariantAttributes,
  };
};
