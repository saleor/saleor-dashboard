import { type CollectionListQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

export type Collections = RelayToFlat<NonNullable<CollectionListQuery["collections"]>>;
export type Collection = Collections[number];
