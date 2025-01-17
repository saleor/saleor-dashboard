import { CollectionDetailsQuery } from "@dashboard/graphql";

export type Edges = NonNullable<
  NonNullable<NonNullable<CollectionDetailsQuery["collection"]>["products"]>["edges"]
>;

export type Product = Edges[number]["node"];
