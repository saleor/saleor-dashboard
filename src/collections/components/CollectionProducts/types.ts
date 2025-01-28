import { CollectionProductsQuery } from "@dashboard/graphql";

export type Edges = NonNullable<
  NonNullable<NonNullable<CollectionProductsQuery["collection"]>["products"]>["edges"]
>;

export type Product = Edges[number]["node"];
