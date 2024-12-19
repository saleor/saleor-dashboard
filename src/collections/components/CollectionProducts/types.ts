import { CollectionDetailsQuery } from "@dashboard/graphql";

export type Product = NonNullable<
  NonNullable<NonNullable<CollectionDetailsQuery["collection"]>["products"]>["edges"]
>[number]["node"];
