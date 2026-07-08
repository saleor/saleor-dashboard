import { type FilterContainer, FilterElement } from "./FilterElement";

export const hasGlobalConstraints = (filterValue: FilterContainer): boolean =>
  filterValue.some(
    (item): item is FilterElement =>
      FilterElement.isFilterElement(item) && Boolean(item.constraint?.isGlobal),
  );

/** Removes attribute-level reference restrictions from a filter container. */
export const stripGlobalConstraints = (filterValue: FilterContainer): FilterContainer => {
  const nonConstraintElements = filterValue.filter(
    item => !FilterElement.isFilterElement(item) || !item.constraint?.isGlobal,
  );

  if (nonConstraintElements[0] === "AND") {
    return nonConstraintElements.slice(1);
  }

  return nonConstraintElements;
};

/** Container baseline for the Conditions editor when restrictions live in microcopy only. */
export const getEditableFilterContainer = (filterValue: FilterContainer): FilterContainer =>
  hasGlobalConstraints(filterValue) ? stripGlobalConstraints(filterValue) : filterValue;
