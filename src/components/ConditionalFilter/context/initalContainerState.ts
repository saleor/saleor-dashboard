import { FilterContainer, FilterElement } from "../FilterElement";

export const getInitialContainerState = (value: FilterContainer) =>
  value.length === 0 ? [FilterElement.createEmpty()] : value;
