// @ts-strict-ignore
import { type FetchResult, type MutationFunctionOptions } from "@apollo/client";
import {
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

export function createVariantReorderHandler(
  productId: string | undefined,
  reorderProductVariants: ProductVariantReorderMutationFn,
) {
  /**
   * Saves one move. Rejects when the move was not saved, so the list can put the variant
   * back; the mutation hook has shown the error by then. The list applies a saved move to
   * the pages it has loaded itself, so nothing is refetched here.
   */
  return async ({ id, sortOrder }: { id: string; sortOrder: number }): Promise<void> => {
    if (!productId) {
      throw new Error("Variant order was not saved: the product is not loaded yet");
    }

    const result = await reorderProductVariants({
      variables: {
        move: {
          id,
          sortOrder,
        },
        productId,
      },
    });
    const errors = result.data?.productVariantReorder?.errors ?? [];

    if (!result.data || result.errors?.length || errors.length) {
      throw new Error("Variant order was not saved");
    }
  };
}
