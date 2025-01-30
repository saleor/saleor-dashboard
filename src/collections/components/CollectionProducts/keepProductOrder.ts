import { CollectionProductsQuery } from "@dashboard/graphql";

export type CollectionProducts = NonNullable<
  NonNullable<CollectionProductsQuery["collection"]>["products"]
>;

/*
  The API needs to take items in the same order as they came, and the reversed one when we move items down (negative position).
  This function is designed to keep that order.
  
  Example:
  list from the API: [1, 2, 3, 4, 5, 6]
  we change (in order):
    5 to position 4
    2 to position 0

    [1, 2, 3, 4, 5, 6]

  The array we get for update is: [{ id: 5, sortOrder: 1 }, { id: 2, sortOrder: 1 }]
  But instead we should send: [{ id: 2, sortOrder: 1 }, { id: 5, sortOrder: 1 }]
  2 is first because it came like this from the API
*/
export const keepProductOrder =
  (listElements: string[], products: CollectionProducts) => (position: number) => {
    const orderedProducts = products.edges
      .map(edge => edge.node.id)
      .map(nodeId => listElements.find(id => nodeId == id) || "")
      .filter(Boolean);

    if (position < 0) {
      return orderedProducts.reverse();
    }

    return orderedProducts;
  };
