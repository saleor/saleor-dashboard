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

    if (data.variants.removed.length > 0) {
      const deleteVaraintsResult = await deleteVariants({
        variables: {
          ids: data.variants.removed.map(index => product.variants[index].id),
        },
      });

      errors = [...errors, ...deleteVaraintsResult.data.productVariantBulkDelete.errors];
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
