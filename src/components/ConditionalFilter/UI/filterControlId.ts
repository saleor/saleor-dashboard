export const FILTER_CONTROL_ID_PREFIX = "conditional-filter";

export type FilterControlField = "left" | "attribute" | "condition" | "right";

export const getFilterControlId = (field: FilterControlField, index: number) =>
  `${FILTER_CONTROL_ID_PREFIX}-${field}-${index}`;
