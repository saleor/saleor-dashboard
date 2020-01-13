import clone from "lodash-es/clone";

import { IFilter } from "@saleor/components/Filter";

export function getExistingKeys(o: object): string[] {
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
