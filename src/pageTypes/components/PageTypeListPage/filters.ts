import { IFilter } from "@saleor/components/Filter";

export enum PageTypeFilterKeys {
  configurable = "configurable",
  type = "type"
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PageTypeListFilterOpts {}

export function createFilterStructure(): IFilter<PageTypeFilterKeys> {
  return [];
}
