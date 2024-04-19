// @ts-strict-ignore
import {
  Node,
  ProductFragment,
  ProductMediaCreateMutationVariables,
  ProductMediaReorderMutationVariables,
  ProductVariantReorderMutationFn,
} from "@dashboard/graphql";
import { ReorderEvent } from "@dashboard/types";
import { move } from "@dashboard/utils/lists";
import { arrayMove } from "react-sortable-hoc";

export function createImageUploadHandler(
  id: string,
  createProductImage: (variables: ProductMediaCreateMutationVariables) => void,
) {
  return (file: File) =>
    createProductImage({
      alt: "",
      image: file,
      product: id,
    });
}

export function createImageReorderHandler(
  product: ProductFragment,
  reorderProductImages: (variables: ProductMediaReorderMutationVariables) => void,
) {
  return ({ newIndex, oldIndex }: ReorderEvent) => {
    let ids = product.media.map(image => image.id);

    ids = arrayMove(ids, oldIndex, newIndex);
    reorderProductImages({
      mediaIds: ids,
      productId: product.id,
    });
  };
}

function areVariantsEqual(a: Node, b: Node) {
  return a.id === b.id;
}

export function createVariantReorderHandler<T extends { id: string; variants: any[] }>(
  product: T,
  reorderProductVariants: ProductVariantReorderMutationFn,
) {
  return ({ newIndex, oldIndex }: ReorderEvent) => {
    const oldVariantOrder = [...product.variants];

    reorderProductVariants({
      variables: {
        move: {
          id: oldVariantOrder[oldIndex].id,
          sortOrder: newIndex - oldIndex,
        },
        productId: product.id,
      },
      optimisticResponse: () => ({
        __typename: "Mutation",
        productVariantReorder: {
          __typename: "ProductVariantReorder",
          errors: [],
          product: {
            __typename: "Product",
            id: product.id,
            variants: [
              ...move<T["variants"][0]>(
                product.variants[oldIndex],
                product!.variants,
                areVariantsEqual,
                newIndex,
              ),
            ],
          },
        },
      }),
    });
  };
}
