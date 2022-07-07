import { ChannelData } from "@saleor/channels/utils";
import {
  MetadataErrorFragment,
  ProductChannelListingErrorFragment,
  ProductErrorWithAttributesFragment,
  ProductFragment,
  ProductUpdateMutation,
  useAttributeValueDeleteMutation,
  useFileUploadMutation,
  useProductChannelListingUpdateMutation,
  useProductUpdateMutation,
  useProductVariantChannelListingUpdateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
  useVariantCreateMutation,
} from "@saleor/graphql";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { ProductUpdateSubmitData } from "@saleor/products/components/ProductUpdatePage/form";
import { getProductErrorMessage } from "@saleor/utils/errors";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import { useIntl } from "react-intl";

import {
  createSimpleProductUpdateHandler,
  SimpleProductUpdateError,
} from "./simple";
import {
  createProductWithVariantsUpdateHandler,
  ProductWithVariantsUpdateError,
} from "./withVariants";

export type UseProductUpdateHandlerError = ProductErrorWithAttributesFragment;

type UseProductUpdateHandler = (
  data: ProductUpdateSubmitData,
) => Promise<
  Array<
    | SimpleProductUpdateError
    | ProductWithVariantsUpdateError
    | MetadataErrorFragment
  >
>;
interface UseProductUpdateHandlerOpts {
  called: boolean;
  loading: boolean;
  errors: UseProductUpdateHandlerError[];
  channelsErrors: ProductChannelListingErrorFragment[];
}

export function useProductUpdateHandler(
  product: ProductFragment,
  allChannels: ChannelData[],
): [UseProductUpdateHandler, UseProductUpdateHandlerOpts] {
  const intl = useIntl();
  const notify = useNotifier();

  const [updateMetadata, updateMetadataOpts] = useUpdateMetadataMutation({});
  const [
    updatePrivateMetadata,
    updatePrivateMetadataOpts,
  ] = useUpdatePrivateMetadataMutation({});
  const [
    productVariantCreate,
    productVariantCreateOpts,
  ] = useVariantCreateMutation({});

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const handleUpdate = (data: ProductUpdateMutation) => {
    if (data.productUpdate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
    }
  };
  const [updateProduct, updateProductOpts] = useProductUpdateMutation({
    onCompleted: handleUpdate,
  });
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
  ] = useProductVariantChannelListingUpdateMutation({});

  const [
    deleteAttributeValue,
    deleteAttributeValueOpts,
  ] = useAttributeValueDeleteMutation({});

  const submit = createMetadataUpdateHandler(
    product,
    product?.productType.hasVariants
      ? createProductWithVariantsUpdateHandler(
          product,
          allChannels,
          uploadFile,
          updateProduct,
          updateChannels,
          variables => deleteAttributeValue({ variables }),
        )
      : createSimpleProductUpdateHandler(
          product,
          allChannels,
          variables => uploadFile({ variables }),
          updateProduct,
          updateChannels,
          updateVariantChannels,
          productVariantCreate,
          variables => deleteAttributeValue({ variables }),
        ),
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );

  const called =
    updateMetadataOpts.called ||
    updatePrivateMetadataOpts.called ||
    productVariantCreateOpts.called ||
    uploadFileOpts.called ||
    updateProductOpts.called ||
    updateChannelsOpts.called ||
    updateVariantChannelsOpts.called ||
    deleteAttributeValueOpts.called;
  const loading =
    updateMetadataOpts.loading ||
    updatePrivateMetadataOpts.loading ||
    productVariantCreateOpts.loading ||
    uploadFileOpts.loading ||
    updateProductOpts.loading ||
    updateChannelsOpts.loading ||
    updateVariantChannelsOpts.loading ||
    deleteAttributeValueOpts.loading;

  const errors = [
    ...(updateProductOpts.data?.productUpdate.errors ?? []),
    ...(productVariantCreateOpts.data?.productVariantCreate.errors ?? []),
  ];

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
    },
  ];
}
