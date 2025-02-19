import { FilterContainer, FilterElement } from "../FilterElement";

export const getFilterElement = (value: FilterContainer, index: number): FilterElement => {
  const possibleFilterElement = value[index];

  if (
    !possibleFilterElement ||
    typeof possibleFilterElement === "string" ||
    Array.isArray(possibleFilterElement)
  ) {
    throw new Error("Unknown filter element used to create API handler");
  }

  return possibleFilterElement;
};
