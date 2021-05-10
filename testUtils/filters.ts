import { IFilter } from "@saleor/components/Filter";
import clone from "lodash/clone";

export function getExistingKeys(o: {}): string[] {
  return Object.keys(o).filter(key => o[key] !== undefined && o[key] !== null);
}

export function setFilterOptsStatus<T extends string>(
  opts: IFilter<T>,
  status: boolean
): IFilter<T> {
  const newOpts = clone(opts);
  for (const optName in opts) {
    if (Object.prototype.hasOwnProperty.call(newOpts, optName)) {
      newOpts[optName].active = status;
    }
  }

  return newOpts;
}
