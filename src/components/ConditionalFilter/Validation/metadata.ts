import { FilterElement } from "../FilterElement";

export const validateMetadataFilterElement = (element: FilterElement, row: number) => {
  const { value } = element.condition.selected;

  // Metadata value should be a tuple [key, value]
  if (!Array.isArray(value) || value.length !== 2) {
    return {
      row,
      rightText: "Invalid metadata format",
    };
  }

  const [key] = value as [string, string];

  // Key is always required
  if (!key || key.trim() === "") {
    return {
      row,
      rightText: "Metadata key is required",
    };
  }

  return false;
};
