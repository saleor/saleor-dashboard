// @ts-strict-ignore
import {
  mergeAttributeValueDeleteErrors,
  mergeFileUploadErrors,
} from "@dashboard/attributes/utils/data";
import {
  handleDeleteMultipleAttributeValues,
  handleUploadMultipleFiles,
} from "@dashboard/attributes/utils/handlers";
import {
  type AttributeErrorFragment,
  ErrorPolicyEnum,
  type ProductChannelListingErrorFragment,
  type ProductDetailsVariantFragment,
  type ProductErrorFragment,
  type ProductErrorWithAttributesFragment,
  type ProductFragment,
  type UploadErrorFragment,
  useAttributeValueDeleteMutation,
  useFileUploadMutation,
  useProductChannelListingUpdateMutation,
  useProductUpdateMutation,
  useProductVariantBulkCreateMutation,
  useProductVariantBulkDeleteMutation,
  useProductVariantBulkUpdateMutation,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { type ProductUpdateSubmitData } from "@dashboard/products/components/ProductUpdatePage/types";
import {
  getProductSubmitErrorNotificationMessages,
  splitProductSubmitErrors,
} from "@dashboard/products/utils/splitSubmitErrors";
import { useState } from "react";
import { useIntl } from "react-intl";

import {
  getCreateVariantMutationError,
  getVariantUpdateMutationErrors,
  type ProductVariantListError,
} from "./errors";
import {
  getBulkVariantUpdateInputs,
  getCreateVariantInput,
  getProductChannelsUpdateVariables,
  getProductUpdateVariables,
  hasProductChannelsUpdate,
} from "./utils";

export type UseProductUpdateHandlerError =
  | ProductErrorWithAttributesFragment
  | ProductErrorFragment
  | AttributeErrorFragment
  | UploadErrorFragment
  | ProductChannelListingErrorFragment
  | ProductVariantListError;

type UseProductUpdateHandler = (
  data: ProductUpdateSubmitData,
) => Promise<Array<UseProductUpdateHandlerError>>;

interface UseProductUpdateHandlerOpts {
  called: boolean;
  loading: boolean;
  errors: ProductErrorWithAttributesFragment[];
  variantListErrors: ProductVariantListError[];
  channelsErrors: ProductChannelListingErrorFragment[];
}

export function useProductUpdateHandler(
  product: ProductFragment | undefined,
  variants: ProductDetailsVariantFragment[] = [],
): [UseProductUpdateHandler, UseProductUpdateHandlerOpts] {
  const intl = useIntl();
  const notify = useNotifier();
  const [variantListErrors, setVariantListErrors] = useState<ProductVariantListError[]>([]);
  const [submitErrors, setSubmitErrors] = useState<ProductErrorWithAttributesFragment[]>([]);
  const [submitChannelsErrors, setSubmitChannelsErrors] = useState<
    ProductChannelListingErrorFragment[]
  >([]);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateVariants] = useProductVariantBulkUpdateMutation();
  const [createVariants] = useProductVariantBulkCreateMutation();
  const [deleteVariants] = useProductVariantBulkDeleteMutation();
  const [uploadFile] = useFileUploadMutation();
  const [updateProduct] = useProductUpdateMutation();
  const [updateChannels] = useProductChannelListingUpdateMutation();
  const [deleteAttributeValue] = useAttributeValueDeleteMutation();
  const sendMutations = async (
    data: ProductUpdateSubmitData,
  ): Promise<UseProductUpdateHandlerError[]> => {
    if (!product) {
      return [];
    }

    let errors: UseProductUpdateHandlerError[] = [];
    const variantErrors: ProductVariantListError[] = [];
    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      variables => uploadFile({ variables }),
    );
    const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
      data.attributesWithNewFileValue,
      product?.attributes,
      variables => deleteAttributeValue({ variables }),
    );
    const updateProductChannelsData = getProductChannelsUpdateVariables(product, data);

    // Persist product fields (including category) before channel listing updates so
    // publish validation sees the latest saved product state in the same submit.
    const updateProductResult = await updateProduct({
      variables: getProductUpdateVariables(product, data, uploadFilesResult),
    });
    const productUpdateErrors = updateProductResult?.data?.productUpdate?.errors ?? [];

    errors = [...errors, ...productUpdateErrors];

    if (
      productUpdateErrors.length === 0 &&
      hasProductChannelsUpdate(updateProductChannelsData.input)
    ) {
      const updateChannelsResult = await updateChannels({
        variables: updateProductChannelsData,
      });

      if (updateChannelsResult.data) {
        errors = [...errors, ...updateChannelsResult.data.productChannelListingUpdate.errors];
      }
    }

    if (data.variants.removedVariantIds?.length || data.variants.removed.length > 0) {
      const idsFromIndexes = data.variants.removed
        .map(index => variants[index]?.id)
        .filter((id): id is string => Boolean(id));
      // Prefer staged cross-page ids; fall back / union with page-local indexes.
      const ids = Array.from(
        new Set([...(data.variants.removedVariantIds ?? []), ...idsFromIndexes]),
      );

      if (ids.length > 0) {
        const deleteVaraintsResult = await deleteVariants({
          variables: { ids },
        });

        errors = [...errors, ...deleteVaraintsResult.data.productVariantBulkDelete.errors];
      }
    }

    if (data.variants.added.length > 0) {
      const createVariantsResults = await createVariants({
        variables: {
          id: product.id,
          inputs: data.variants.added.map(index => ({
            ...getCreateVariantInput(
              data.variants,
              index,
              product?.productType?.variantAttributes ?? [],
            ),
          })),
        },
      });
      const createVariantsErrors = getCreateVariantMutationError(createVariantsResults);

      errors.push(...createVariantsErrors);
      variantErrors.push(...createVariantsErrors);
    }

    const updateChanges = data.variants.stagedUpdateChanges ?? data.variants;
    const variantsForBulkUpdate = data.variants.stagedUpdateVariants ?? variants;

    if (updateChanges.updates.length > 0) {
      const updateInputdData = getBulkVariantUpdateInputs(
        variantsForBulkUpdate,
        updateChanges,
        product?.productType?.variantAttributes ?? [],
      );

      if (updateInputdData.length) {
        // Chunk to stay within API comfort zone for large catalogs.
        const CHUNK_SIZE = 100;

        for (let offset = 0; offset < updateInputdData.length; offset += CHUNK_SIZE) {
          const chunk = updateInputdData.slice(offset, offset + CHUNK_SIZE);
          const updateVariantsResults = await updateVariants({
            variables: {
              product: product.id,
              input: chunk,
              errorPolicy: ErrorPolicyEnum.REJECT_FAILED_ROWS,
            },
          });
          const updateVariantsErrors = getVariantUpdateMutationErrors(
            updateVariantsResults,
            chunk.map(row => row.id),
          );

          variantErrors.push(...updateVariantsErrors);
          errors.push(...updateVariantsErrors);
        }
      }
    }

    errors = [
      ...errors,
      ...mergeFileUploadErrors(uploadFilesResult),
      ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
    ];
    setVariantListErrors(variantErrors);

    return errors;
  };
  const submit = async (data: ProductUpdateSubmitData) => {
    if (!product) {
      return [];
    }

    setCalled(true);
    setLoading(true);
    setSubmitErrors([]);
    setSubmitChannelsErrors([]);

    const errors = await sendMutations(data);

    setLoading(false);

    if (errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "Ad9EZ1",
          defaultMessage: "Product updated",
        }),
      });
    } else {
      getProductSubmitErrorNotificationMessages(errors, intl).forEach(text =>
        notify({
          status: "error",
          text,
        }),
      );

      const { productErrors, channelsErrors } = splitProductSubmitErrors(errors);

      setSubmitErrors(productErrors);
      setSubmitChannelsErrors(channelsErrors);
    }

    return errors;
  };

  return [
    submit,
    {
      called,
      loading,
      channelsErrors: submitChannelsErrors,
      errors: submitErrors,
      variantListErrors,
    },
  ];
}
