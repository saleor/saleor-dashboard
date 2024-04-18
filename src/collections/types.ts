import { CollectionListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type Collections = RelayToFlat<NonNullable<CollectionListQuery["collections"]>>;
export type Collection = Collections[number];
