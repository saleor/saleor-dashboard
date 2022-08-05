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
  AttributeValueDeleteMutation,
  BulkStockErrorFragment,
  FileUploadMutation,
  MetadataErrorFragment,
  ProductChannelListingErrorFragment,
  ProductChannelListingUpdateMutation,
  ProductErrorCode,
  ProductErrorWithAttributesFragment,
  ProductFragment,
  ProductUpdateMutation,
  ProductVariantChannelListingUpdateMutation,
  ProductVariantChannelListingUpdateMutationVariables,
  StockErrorFragment,
  StockInput,
  UploadErrorFragment,
  useAttributeValueDeleteMutation,
  useFileUploadMutation,
  useProductChannelListingUpdateMutation,
  useProductUpdateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
  useVariantDatagridChannelListingUpdateMutation,
  useVariantDatagridStockUpdateMutation,
  useVariantDatagridUpdateMutation,
  VariantDatagridChannelListingUpdateMutation,
  VariantDatagridStockUpdateMutation,
  VariantDatagridStockUpdateMutationVariables,
  VariantDatagridUpdateMutation,
  VariantDatagridUpdateMutationVariables,
} from "@saleor/graphql";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { getMutationErrors, hasMutationErrors } from "@saleor/misc";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/form";
import {
  getStocks,
  getVariantChannels,
  getVariantInputs,
} from "@saleor/products/components/ProductVariants/utils";
import { getProductErrorMessage } from "@saleor/utils/errors";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import { useState } from "react";
import { useIntl } from "react-intl";

import {
  getProductChannelsUpdateVariables,
  getProductUpdateVariables,
} from "./utils";

export type UseProductUpdateHandlerError =
  | ProductErrorWithAttributesFragment
  | AttributeErrorFragment
  | UploadErrorFragment
  | StockErrorFragment
  | BulkStockErrorFragment
  | ProductChannelListingErrorFragment;

type DatagridError =
  | {
      attributes: string[] | null;
      error: ProductErrorCode;
      variantId: string;
      type: "variantData";
    }
  | {
      variantId: string;
      warehouseId: string;
      type: "stock";
    }
  | {
      error: ProductErrorCode;
      variantId: string;
      channelIds: string[];
      type: "channel";
    };

type UseProductUpdateHandler = (
  data: ProductUpdateSubmitData,
) => Promise<Array<UseProductUpdateHandlerError | MetadataErrorFragment>>;
interface UseProductUpdateHandlerOpts {
  called: boolean;
  loading: boolean;
  errors: ProductErrorWithAttributesFragment[];
  datagridErrors: DatagridError[];
  channelsErrors: ProductChannelListingErrorFragment[];
}

export function useProductUpdateHandler(
  product: ProductFragment,
): [UseProductUpdateHandler, UseProductUpdateHandlerOpts] {
  const intl = useIntl();
  const notify = useNotifier();
  const [datagridErrors, setDatagridErrors] = useState<
    DatagridError[] | undefined
  >(undefined);

  const [updateMetadata, updateMetadataOpts] = useUpdateMetadataMutation({});
  const [
    updatePrivateMetadata,
    updatePrivateMetadataOpts,
  ] = useUpdatePrivateMetadataMutation({});
  const [
    updateStocks,
    updateStocksOpts,
  ] = useVariantDatagridStockUpdateMutation({});
  const [updateVariant, updateVariantOpts] = useVariantDatagridUpdateMutation();

  const [uploadFile, uploadFileOpts] = useFileUploadMutation();

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
    updateVariantChannelsOpts,
  ] = useVariantDatagridChannelListingUpdateMutation();

  const [
    deleteAttributeValue,
    deleteAttributeValueOpts,
  ] = useAttributeValueDeleteMutation();

  const sendMutations = createMetadataUpdateHandler(
    product,
    async (data: ProductUpdateSubmitData) => {
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

      const result = await updateProduct({
        variables: getProductUpdateVariables(product, data, uploadFilesResult),
      });
      errors = [...errors, ...result.data.productUpdate.errors];

      const productChannelsUpdateResult = await updateChannels({
        variables: getProductChannelsUpdateVariables(product, data),
      });

      const variantUpdateResult = await Promise.all<FetchResult>([
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
      ]);

      errors = [
        ...errors,
        ...(variantUpdateResult.flatMap(getMutationErrors) as Array<
          | StockErrorFragment
          | BulkStockErrorFragment
          | ProductChannelListingErrorFragment
        >),
      ];

      const datagridRelatedErrors: DatagridError[] = [
        productChannelsUpdateResult,
        ...variantUpdateResult,
      ]
        .filter(hasMutationErrors)
        .flatMap(result => {
          if (result.data.productVariantChannelListingUpdate) {
            const data = result.data as ProductVariantChannelListingUpdateMutation;
            return data.productVariantChannelListingUpdate.errors.map<
              DatagridError
            >(error => ({
              type: "channel",
              error: error.code,
              variantId: (result.extensions
                .variables as ProductVariantChannelListingUpdateMutationVariables)
                .id,
              channelIds: error.channels,
            }));
          }

          if (result.data.productVariantStocksUpdate) {
            const data = result.data as VariantDatagridStockUpdateMutation;
            const variables = result.extensions
              .variables as VariantDatagridStockUpdateMutationVariables;
            return [
              ...data.productVariantStocksUpdate.errors.map<DatagridError>(
                error => ({
                  type: "stock",
                  variantId: (variables as VariantDatagridStockUpdateMutationVariables)
                    .id,
                  warehouseId: (variables.stocks as StockInput[])[error.index]
                    .warehouse,
                }),
              ),
              ...data.productVariantStocksDelete.errors.map<DatagridError>(
                () => ({
                  type: "stock",
                  variantId: (variables as VariantDatagridStockUpdateMutationVariables)
                    .id,
                  warehouseId: null,
                }),
              ),
            ];
          }

          if (result.data.productVariantUpdate) {
            const data = result.data as VariantDatagridUpdateMutation;
            const variables = result.extensions
              .variables as VariantDatagridUpdateMutationVariables;
            return data.productVariantUpdate.errors.map<DatagridError>(
              error => ({
                type: "variantData",
                variantId: (variables as VariantDatagridUpdateMutationVariables)
                  .id,
                error: error.code,
                attributes: error.attributes,
              }),
            );
          }
        });
      setDatagridErrors(datagridRelatedErrors);

      return errors;
    },
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );

  const submit = async (data: ProductUpdateSubmitData) => {
    const errors = await sendMutations(data);

    if (errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
    }

    return errors;
  };

  const called =
    updateMetadataOpts.called ||
    updatePrivateMetadataOpts.called ||
    uploadFileOpts.called ||
    updateProductOpts.called ||
    updateChannelsOpts.called ||
    updateVariantChannelsOpts.called ||
    deleteAttributeValueOpts.called ||
    updateStocksOpts.called ||
    updateVariantOpts.called;
  const loading =
    updateMetadataOpts.loading ||
    updatePrivateMetadataOpts.loading ||
    uploadFileOpts.loading ||
    updateProductOpts.loading ||
    updateChannelsOpts.loading ||
    updateVariantChannelsOpts.loading ||
    deleteAttributeValueOpts.loading ||
    updateStocksOpts.loading ||
    updateVariantOpts.loading;

  const errors = updateProductOpts.data?.productUpdate.errors ?? [];

  const channelsErrors = [
    ...(updateChannelsOpts?.data?.productChannelListingUpdate?.errors ?? []),
    ...(updateVariantChannelsOpts?.data?.productVariantChannelListingUpdate
      ?.errors ?? []),
  ];

  return [
    submit,
    {
      called,
      loading,
      channelsErrors,
      errors,
      datagridErrors,
    },
  ];
}
