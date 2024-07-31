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
  AttributeErrorFragment,
  ErrorPolicyEnum,
  MetadataErrorFragment,
  ProductChannelListingErrorFragment,
  ProductErrorFragment,
  ProductErrorWithAttributesFragment,
  ProductFragment,
  UploadErrorFragment,
  useAttributeValueDeleteMutation,
  useFileUploadMutation,
  useProductChannelListingUpdateMutation,
  useProductUpdateMutation,
  useProductVariantBulkCreateMutation,
  useProductVariantBulkDeleteMutation,
  useProductVariantBulkUpdateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { getMutationErrors } from "@dashboard/misc";
import { ProductUpdateSubmitData } from "@dashboard/products/components/ProductUpdatePage/types";
import { getProductErrorMessage } from "@dashboard/utils/errors";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useState } from "react";
import { useIntl } from "react-intl";

import {
  getCreateVariantMutationError,
  getVariantUpdateMutationErrors,
  ProductVariantListError,
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
) => Promise<Array<UseProductUpdateHandlerError | MetadataErrorFragment>>;

interface UseProductUpdateHandlerOpts {
  called: boolean;
  loading: boolean;
  errors: ProductErrorWithAttributesFragment[];
  variantListErrors: ProductVariantListError[];
  channelsErrors: ProductChannelListingErrorFragment[];
}

export function useProductUpdateHandler(
  product: ProductFragment,
): [UseProductUpdateHandler, UseProductUpdateHandlerOpts] {
  const intl = useIntl();
  const notify = useNotifier();
  const [variantListErrors, setVariantListErrors] = useState<ProductVariantListError[]>([]);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [updateVariants] = useProductVariantBulkUpdateMutation();
  const [createVariants] = useProductVariantBulkCreateMutation();
  const [deleteVariants] = useProductVariantBulkDeleteMutation();
  const [uploadFile] = useFileUploadMutation();
  const [updateProduct, updateProductOpts] = useProductUpdateMutation();
  const [updateChannels, updateChannelsOpts] = useProductChannelListingUpdateMutation({
    onCompleted: data => {
      if (data.productChannelListingUpdate.errors.length) {
        data.productChannelListingUpdate.errors.forEach(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl),
          }),
        );
      }
    },
  });
  const [deleteAttributeValue] = useAttributeValueDeleteMutation();
  const sendMutations = async (
    data: ProductUpdateSubmitData,
  ): Promise<UseProductUpdateHandlerError[]> => {
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

    if (hasProductChannelsUpdate(updateProductChannelsData.input)) {
      const updateChannelsResult = await updateChannels({
        variables: updateProductChannelsData,
      });

      if (updateChannelsResult.data) {
        errors = [...errors, ...updateChannelsResult.data.productChannelListingUpdate.errors];
      }
    }

    if (data.variants.removed.length > 0) {
      const deleteVaraintsResult = await deleteVariants({
        variables: {
          ids: data.variants.removed.map(index => product.variants[index].id),
        },
      });

      errors = [...errors, ...deleteVaraintsResult.data.productVariantBulkDelete.errors];
    }

    const updateProductResult = await updateProduct({
      variables: getProductUpdateVariables(product, data, uploadFilesResult),
    });

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

    if (data.variants.updates.length > 0) {
      const updateInputdData = getBulkVariantUpdateInputs(
        product.variants,
        data.variants,
        product?.productType?.variantAttributes ?? [],
      );

      if (updateInputdData.length) {
        const updateVariantsResults = await updateVariants({
          variables: {
            product: product.id,
            input: updateInputdData,
            errorPolicy: ErrorPolicyEnum.REJECT_FAILED_ROWS,
          },
        });
        const updateVariantsErrors = getVariantUpdateMutationErrors(
          updateVariantsResults,
          updateInputdData.map(data => data.id),
        );

        variantErrors.push(...updateVariantsErrors);
        errors.push(...updateVariantsErrors);
      }
    }

    errors = [
      ...errors,
      ...mergeFileUploadErrors(uploadFilesResult),
      ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
      ...(updateProductResult?.data?.productUpdate?.errors ?? []),
    ];
    setVariantListErrors(variantErrors);

    return errors;
  };
  const submit = async (data: ProductUpdateSubmitData) => {
    setCalled(true);
    setLoading(true);

    const errors = await createMetadataUpdateHandler(
      product,
      sendMutations,
      variables => updateMetadata({ variables }),
      variables => updatePrivateMetadata({ variables }),
    )(data);

    setLoading(false);

    if (errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
    }

    return errors;
  };
  const errors = getMutationErrors(updateProductOpts) as ProductErrorWithAttributesFragment[];
  const channelsErrors = updateChannelsOpts?.data?.productChannelListingUpdate?.errors ?? [];

  return [
    submit,
    {
      called,
      loading,
      channelsErrors,
      errors,
      variantListErrors,
    },
  ];
}
