import { type FilterContainer } from "../FilterElement";
import { type UrlEntry } from "./UrlToken";

type Structure = Array<string | UrlEntry | Structure>;

export const prepareStructure = (filterValue: FilterContainer): Structure =>
  filterValue.map(f => {
    if (typeof f === "string") {
      return f;
    }

    if (Array.isArray(f)) {
      return prepareStructure(f);
    }

    return f.asUrlEntry();
  });

export const getFilterContainerKey = (filterValue: FilterContainer): string =>
  JSON.stringify(prepareStructure(filterValue));

export const areFilterContainersEqual = (left: FilterContainer, right: FilterContainer): boolean =>
  getFilterContainerKey(left) === getFilterContainerKey(right);
