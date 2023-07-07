import { FilterContainer } from "./FilterElement";

type QueryVars =
  | {  OR: QueryVars, current?: FilterContainer[number] }
  | {  AND: QueryVars, current?: FilterContainer[number] }

export interface FilterValueProvider {
  value: FilterContainer;
  queryVars: QueryVars;
  loading: boolean;
  persist: (newValue: FilterContainer) => void;
}

const toNested = (p: QueryVars, current: FilterContainer[number]): QueryVars => {
  if (typeof current !== "string") {
    return { ...p, current }
  }

  if (current === "AND") {
    return { AND: p }
  }

  if (current === "OR") {
    return { OR: p }
  }

  return p
}

export const createVariables = (filter: FilterContainer) =>
  filter.reduceRight(toNested, {} as QueryVars)