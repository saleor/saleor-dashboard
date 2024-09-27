import { MetadataItemFragment } from "@dashboard/graphql";

import { asFlagValue, FlagList } from "../availableFlags";
import * as AvailableFlags from "../availableFlags";
import { Strategy } from "../Strategy";

const METADATA_KEY = "feature_flags";

export const flagListToMetadata = (
  list: FlagList,
): Array<Omit<MetadataItemFragment, "__typename">> => {
  return [{ key: METADATA_KEY, value: JSON.stringify(list) }];
};

const flagListFromMetadata = (
  metadata: Array<Omit<MetadataItemFragment, "__typename">>,
): FlagList => {
  const defaultsList = asFlagValue();
  const rawFlags = metadata.find(x => x.key === METADATA_KEY);
  const flagList = rawFlags ? JSON.parse(rawFlags.value) : (defaultsList as FlagList);

  return Object.keys(defaultsList).reduce((list: FlagList, key: string) => {
    list[key as AvailableFlags.Name] = defaultsList[key as AvailableFlags.Name];

    if (flagList[key]) {
      list[key as AvailableFlags.Name] = flagList[key];
    }

    return list;
  }, {} as FlagList);
};

export class MetadataStrategy implements Strategy {
  constructor(public metadata: MetadataItemFragment[]) {}

  fetchAll(): Promise<AvailableFlags.FlagList> {
    return Promise.resolve(flagListFromMetadata(this.metadata));
  }
}
