// @ts-strict-ignore
import { type FetchResult, type MutationFunctionOptions } from "@apollo/client";
import {
  type Node,
  type ProductFragment,
  type ProductMediaCreateMutation,
  type ProductMediaCreateMutationVariables,
  type ProductMediaReorderMutation,
  type ProductMediaReorderMutationVariables,
  type ProductVariantReorderMutationFn,
} from "@dashboard/graphql";
import { getMutationErrors } from "@dashboard/misc";
import { type ReorderEvent } from "@dashboard/types";
import { move } from "@dashboard/utils/lists";
import { arrayMove } from "react-sortable-hoc";

export function createImageUploadHandler(
  id: string,
  createProductImage: (
    variables: ProductMediaCreateMutationVariables,
  ) => Promise<FetchResult<ProductMediaCreateMutation>>,
) {
  return async (file: File) => {
    const result = await createProductImage({
      alt: "",
      image: file,
      product: id,
    });
    const errors = getMutationErrors(result);

    if (errors.length > 0 || !result.data?.productMediaCreate?.product) {
      throw new Error("Failed to upload product media");
    }

    return result;
  };
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
