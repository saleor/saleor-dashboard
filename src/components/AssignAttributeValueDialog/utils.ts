import { AttributeEntityTypeEnum, AttributeInputTypeEnum } from "@dashboard/graphql";

import { type AttributeInput } from "../Attributes";

/**
 * Predicate for multi-reference attributes: hide values already on the attribute so the
 * picker can backfill instead of receiving a pre-filtered empty page.
 *
 * Returns `undefined` for single-reference (current selection must stay visible) and for
 * product variants (AssignVariantDialog keeps assigned rows and disables them via selectedIds).
 */
export const getExcludeAssignedAttributeValue = ({
  inputType,
  entityType,
  value,
}: {
  inputType: AttributeInput["data"]["inputType"];
  entityType: AttributeInput["data"]["entityType"];
  value: AttributeInput["value"] | undefined;
}): ((item: { id: string }) => boolean) | undefined => {
  if (inputType === AttributeInputTypeEnum.SINGLE_REFERENCE) {
    return undefined;
  }

  if (entityType === AttributeEntityTypeEnum.PRODUCT_VARIANT) {
    return undefined;
  }

  const assigned = new Set(value ?? []);

  if (assigned.size === 0) {
    return undefined;
  }

  return (item: { id: string }) => assigned.has(item.id);
};
