import { FetchResult } from "@apollo/client";
import {
  mergeAttributeValueDeleteErrors,
  mergeFileUploadErrors,
} from "@saleor/attributes/utils/data";
import {
  handleDeleteMultipleAttributeValues,
  handleUploadMultipleFiles,
} from "@saleor/attributes/utils/handlers";
import {
  AttributeErrorFragment,
  BulkProductErrorFragment,
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
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
  useVariantDatagridChannelListingUpdateMutation,
  useVariantDatagridStockUpdateMutation,
  useVariantDatagridUpdateMutation,
} from "@saleor/graphql";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/types";
import { getVariantChannelsInputs } from "@saleor/products/components/ProductVariants/datagrid/getVariantChannelsInputs";
import {
  getStockInputs,
  getStocks,
  getVariantChannels,
  getVariantInput,
  getVariantInputs,
} from "@saleor/products/components/ProductVariants/utils";
import { getProductErrorMessage } from "@saleor/utils/errors";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import { useState } from "react";
import { useIntl } from "react-intl";

import { getProductVariantListErrors, ProductVariantListError } from "./errors";
import {
  getProductChannelsUpdateVariables,
  getProductUpdateVariables,
} from "./utils";

export type UseProductUpdateHandlerError =
  | ProductErrorWithAttributesFragment
  | ProductErrorFragment
  | BulkProductErrorFragment
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
  const [variantListErrors, setVariantListErrors] = useState<
    ProductVariantListError[]
  >([]);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [updateStocks] = useVariantDatagridStockUpdateMutation({});
  const [updateVariant] = useVariantDatagridUpdateMutation();
  const [createVariants] = useProductVariantBulkCreateMutation();
  const [deleteVariants] = useProductVariantBulkDeleteMutation();

  const [uploadFile] = useFileUploadMutation();

  const [updateProduct, updateProductOpts] = useProductUpdateMutation();
  const [
    updateChannels,
    updateChannelsOpts,
  ] = useProductChannelListingUpdateMutation({
    onCompleted: data => {
      if (!!data.productChannelListingUpdate.errors.length) {
        data.productChannelListingUpdate.errors.forEach(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl),
          }),
        );
      }
    },
  });

  const [
    updateVariantChannels,
  ] = useVariantDatagridChannelListingUpdateMutation();

  const [deleteAttributeValue] = useAttributeValueDeleteMutation();

  const sendMutations = async (
    data: ProductUpdateSubmitData,
  ): Promise<UseProductUpdateHandlerError[]> => {
    let errors: UseProductUpdateHandlerError[] = [];
    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      variables => uploadFile({ variables }),
    );

    const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
      data.attributesWithNewFileValue,
      product?.attributes,
      variables => deleteAttributeValue({ variables }),
    );

    errors = [
      ...errors,
      ...mergeFileUploadErrors(uploadFilesResult),
      ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
    ];

    if (data.variants.removed.length > 0) {
      errors.push(
        ...(
          await deleteVariants({
            variables: {
              ids: data.variants.removed.map(
                index => product.variants[index].id,
              ),
            },
          })
        ).data.productVariantBulkDelete.errors,
      );
    }

    const result = await updateProduct({
      variables: getProductUpdateVariables(product, data, uploadFilesResult),
    });
    errors = [...errors, ...result.data.productUpdate.errors];

    const productChannelsUpdateResult = await updateChannels({
      variables: getProductChannelsUpdateVariables(product, data),
    });

    const mutations: Array<Promise<FetchResult>> = [
      ...getStocks(product.variants, data.variants).map(variables =>
        updateStocks({ variables }),
      ),
      ...getVariantInputs(product.variants, data.variants).map(variables =>
        updateVariant({ variables }),
      ),
      ...getVariantChannels(product.variants, data.variants).map(variables =>
        updateVariantChannels({
          variables,
        }),
      ),
    ];

    if (data.variants.added.length > 0) {
      mutations.push(
        createVariants({
          variables: {
            id: product.id,
            inputs: data.variants.added.map(index => ({
              ...getVariantInput(data.variants, index),
              channelListings: getVariantChannelsInputs(data.variants, index),
              stocks: getStockInputs(data.variants, index).stocks,
            })),
          },
        }),
      );
    }

    const variantMutationResults = await Promise.all<FetchResult>(mutations);

    const variantErrors = getProductVariantListErrors(
      productChannelsUpdateResult,
      variantMutationResults,
    );

    errors = [...errors, ...variantErrors];

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

  const errors = updateProductOpts.data?.productUpdate.errors ?? [];

  const channelsErrors =
    updateChannelsOpts?.data?.productChannelListingUpdate?.errors ?? [];

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
