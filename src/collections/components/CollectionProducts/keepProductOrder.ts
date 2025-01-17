import { CollectionDetailsQuery } from "@dashboard/graphql";

export type CollectionProducts = NonNullable<
  NonNullable<CollectionDetailsQuery["collection"]>["products"]
>;

/*
  The API needs to take items in the same order as they came, and the reversed one when we move items down (negative position).
  This function is designed to keep that order.
*/
export const keepProductOrder =
  (listElements: string[], products: CollectionProducts) => (position: number) => {
    const orderedProducts = products.edges
      .map(edge => edge.node.id)
      .map(nodeId => listElements.find(id => nodeId == id))
      .filter(Boolean);

    if (position < 0) {
      return orderedProducts.reverse();
    }

    return orderedProducts;
  };
