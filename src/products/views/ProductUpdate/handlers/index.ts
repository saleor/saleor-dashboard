// @ts-strict-ignore
import { type MutationFunctionOptions } from "@apollo/client";
import {
  type ProductFragment,
  type ProductMediaCreateMutationVariables,
  type ProductMediaReorderMutation,
  type ProductMediaReorderMutationVariables,
  type ProductVariantReorderMutationFn,
} from "@dashboard/graphql";
import { type ReorderEvent } from "@dashboard/types";
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

type ProductMediaReorderOptions = Pick<
  MutationFunctionOptions<ProductMediaReorderMutation, ProductMediaReorderMutationVariables>,
  "variables" | "optimisticResponse"
>;

/** @deprecated This component should use @dnd-kit instead of react-sortable-hoc */
export function createImageReorderHandler(
  product: ProductFragment | undefined,
  reorderProductImages: (options: ProductMediaReorderOptions) => void,
) {
  return ({ newIndex, oldIndex }: ReorderEvent) => {
    const media = product?.media;

    if (!product || !media?.length) {
      return;
    }

    const mediaIds = arrayMove(
      media.map(image => image.id),
      oldIndex,
      newIndex,
    );
    const reorderedMedia = arrayMove([...media], oldIndex, newIndex);

    reorderProductImages({
      variables: {
        mediaIds,
        productId: product.id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        productMediaReorder: {
          __typename: "ProductMediaReorder",
          errors: [],
          product: {
            __typename: "Product",
            id: product.id,
            media: reorderedMedia,
          },
        },
      },
    });
  };
}

export function createVariantReorderHandler(
  productId: string | undefined,
  reorderProductVariants: ProductVariantReorderMutationFn,
) {
  return ({ id, sortOrder }: { id: string; sortOrder: number }) => {
    if (!productId) {
      return;
    }

    reorderProductVariants({
      variables: {
        move: {
          id,
          sortOrder,
        },
        productId,
      },
      refetchQueries: ["ProductVariantSiblings"],
    });
  };
}
