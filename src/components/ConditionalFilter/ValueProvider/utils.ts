import { type FilterContainer } from "../FilterElement/FilterElement";
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

/**
 * Working rows and the URL provider share FilterElement instances.
 * In-place edits (setValue on the selected condition) therefore change both
 * sides of `areFilterContainersEqual` and Save never enables. Compare against
 * a serialized snapshot taken when the editor opened / last confirmed.
 */
export const hasUnsavedFilterChanges = (current: FilterContainer, committedKey: string): boolean =>
  getFilterContainerKey(current) !== committedKey;
