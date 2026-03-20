import { type MetadataItemFragment } from "@dashboard/graphql";

import { asFlagValue, type FlagList, type Name } from "../availableFlags";
import { type Strategy } from "../Strategy";

const METADATA_KEY = "feature_flags";

export const flagListToMetadata = (
  list: FlagList,
): Array<Omit<MetadataItemFragment, "__typename">> => {
  return [{ key: METADATA_KEY, value: JSON.stringify(list) }];
};

// TODO: Typescript will fail if there are *no* flags on the array. We need to fix that
const flagListFromMetadata = (
  metadata: Array<Omit<MetadataItemFragment, "__typename">>,
): FlagList => {
  const defaultsList = asFlagValue();
  const rawFlags = metadata.find(x => x.key === METADATA_KEY);
  const flagList = rawFlags ? JSON.parse(rawFlags.value) : (defaultsList as FlagList);

  return Object.keys(defaultsList).reduce((list: FlagList, key: string) => {
    list[key as Name] = defaultsList[key as Name];

    if (flagList[key]) {
      list[key as Name] = flagList[key];
    }

    return list;
  }, {} as FlagList);
};

export class MetadataStrategy implements Strategy {
  constructor(public metadata: MetadataItemFragment[]) {}

  fetchAll(): Promise<FlagList> {
    return Promise.resolve(flagListFromMetadata(this.metadata));
  }
}
