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
import { errorMessages } from "@dashboard/intl";
import { getMutationErrors } from "@dashboard/misc";
import { type ReorderEvent } from "@dashboard/types";
import { move } from "@dashboard/utils/lists";
import { arrayMove } from "@dnd-kit/sortable";
import { type IntlShape } from "react-intl";

import { productUpdatePageMessages } from "../messages";

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

export interface ImagesUploadCompleteResult {
  successCount: number;
  failureCount: number;
}

export function createImagesUploadCompleteHandler(
  notify: (notification: {
    status: "success" | "error" | "warning";
    title?: string;
    text: string;
  }) => void,
  intl: Pick<IntlShape, "formatMessage">,
) {
  return ({ successCount, failureCount }: ImagesUploadCompleteResult) => {
    if (successCount === 0 && failureCount === 0) {
      return;
    }

    if (failureCount === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(productUpdatePageMessages.mediaUploadSuccessCount, {
          count: successCount,
        }),
      });

      return;
    }

    if (successCount === 0) {
      notify({
        status: "error",
        title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
        text: intl.formatMessage(productUpdatePageMessages.mediaUploadAllFailed, {
          count: failureCount,
        }),
      });

      return;
    }

    notify({
      status: "warning",
      text: intl.formatMessage(productUpdatePageMessages.mediaUploadPartial, {
        success: successCount,
        failed: failureCount,
      }),
    });
  };
}

type ProductMediaReorderOptions = Pick<
  MutationFunctionOptions<ProductMediaReorderMutation, ProductMediaReorderMutationVariables>,
  "variables" | "optimisticResponse"
>;

export function createImageReorderHandler(
  product: ProductFragment | undefined,
  reorderProductImages: (options: ProductMediaReorderOptions) => void,
) {
  return ({ newIndex, oldIndex }: ReorderEvent) => {
    const media = product?.media;

    if (!product || !media?.length) {
      return;
    }

    if (
      oldIndex < 0 ||
      newIndex < 0 ||
      oldIndex >= media.length ||
      newIndex >= media.length ||
      oldIndex === newIndex
    ) {
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
