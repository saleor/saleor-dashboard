import { type CollectionProductFragment, type CollectionProductsQuery } from "@dashboard/graphql";

export type Edges = NonNullable<
  NonNullable<NonNullable<CollectionProductsQuery["collection"]>["products"]>["edges"]
>;

export type Product = CollectionProductFragment;
