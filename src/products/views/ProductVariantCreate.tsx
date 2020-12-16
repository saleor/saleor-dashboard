import { getAttributesAfterFileAttributesUpdate } from "@saleor/attributes/utils/data";
import {
  handleUploadMultipleFiles,
  prepareAttributesInput
} from "@saleor/attributes/utils/handlers";
import { ChannelPriceData } from "@saleor/channels/utils";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { useFileUploadMutation } from "@saleor/files/mutations";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { useProductVariantChannelListingUpdate } from "@saleor/products/mutations";
import { ProductVariantChannelListingUpdate } from "@saleor/products/types/ProductVariantChannelListingUpdate";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import { useWarehouseList } from "@saleor/warehouses/queries";
import { warehouseAddPath } from "@saleor/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

import { weight } from "../../misc";
import ProductVariantCreatePage from "../components/ProductVariantCreatePage";
import { ProductVariantCreateData } from "../components/ProductVariantCreatePage/form";
import {
  useProductVariantReorderMutation,
  useVariantCreateMutation
} from "../mutations";
import { useProductVariantCreateQuery } from "../queries";
import { productListUrl, productUrl, productVariantEditUrl } from "../urls";
import { createVariantReorderHandler } from "./ProductUpdate/handlers";

interface ProductVariantCreateProps {
  productId: string;
}

export const ProductVariant: React.FC<ProductVariantCreateProps> = ({
  productId
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const warehouses = useWarehouseList({
    displayLoader: true,
    variables: {
      first: 50
    }
  });
  const handleCreateSuccess = (data: ProductVariantChannelListingUpdate) => {
    if (data.productVariantChannelListingUpdate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(
        productVariantEditUrl(
          productId,
          data.productVariantChannelListingUpdate.variant.id
        )
      );
    }
  };

  const { data, loading: productLoading } = useProductVariantCreateQuery({
    displayLoader: true,
    variables: { id: productId }
  });

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const [
    updateChannels,
    updateChannelsOpts
  ] = useProductVariantChannelListingUpdate({
    onCompleted: handleCreateSuccess
  });

  const product = data?.product;

  const channels: ChannelPriceData[] = product?.channelListings.map(
    listing => ({
      costPrice: null,
      currency: listing.channel.currencyCode,
      id: listing.channel.id,
      name: listing.channel.name,
      price: null
    })
  );

  const handleSubmitChannels = (
    data: ProductVariantCreateData,
    variantId: string
  ) =>
    updateChannels({
      variables: {
        id: variantId,
        input: data.channelListings.map(listing => ({
          channelId: listing.id,
          costPrice: listing.value.costPrice || null,
          price: listing.value.price
        }))
      }
    });

  const [variantCreate, variantCreateResult] = useVariantCreateMutation({});

  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  if (product === null) {
    return <NotFoundPage onBack={() => navigate(productListUrl())} />;
  }

  const [
    reorderProductVariants,
    reorderProductVariantsOpts
  ] = useProductVariantReorderMutation({});

  const handleVariantReorder = createVariantReorderHandler(product, variables =>
    reorderProductVariants({ variables })
  );

  const handleBack = () => navigate(productUrl(productId));
  const handleCreate = async (formData: ProductVariantCreateData) => {
    const uploadFilesResult = await handleUploadMultipleFiles(
      formData.attributesWithNewFileValue,
      variables => uploadFile({ variables })
    );

    const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
      formData.attributesWithNewFileValue,
      uploadFilesResult
    );

    const result = await variantCreate({
      variables: {
        input: {
          attributes: prepareAttributesInput({
            attributes: formData.attributes.filter(
              attribute => attribute.value?.length && attribute.value[0] !== ""
            ),
            updatedFileAttributes
          }),
          product: productId,
          sku: formData.sku,
          stocks: formData.stocks.map(stock => ({
            quantity: parseInt(stock.value, 0) || 0,
            warehouse: stock.id
          })),
          trackInventory: true,
          weight: weight(formData.weight)
        }
      }
    });
    const id = result.data?.productVariantCreate?.productVariant?.id;
    if (id) {
      await handleSubmitChannels(formData, id);
    }

    return id || null;
  };
  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata
  );
  const handleVariantClick = (id: string) =>
    navigate(productVariantEditUrl(productId, id));

  const disableForm =
    productLoading ||
    uploadFileOpts.loading ||
    variantCreateResult.loading ||
    reorderProductVariantsOpts.loading;

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          defaultMessage: "Create variant",
          description: "window title"
        })}
      />
      <ProductVariantCreatePage
        channels={channels}
        channelErrors={
          updateChannelsOpts?.data?.productVariantChannelListingUpdate?.errors
        }
        disabled={disableForm}
        errors={variantCreateResult.data?.productVariantCreate.errors || []}
        header={intl.formatMessage({
          defaultMessage: "Create Variant",
          description: "header"
        })}
        product={data?.product}
        onBack={handleBack}
        onSubmit={handleSubmit}
        onVariantClick={handleVariantClick}
        onWarehouseConfigure={() => navigate(warehouseAddPath)}
        onVariantReorder={handleVariantReorder}
        saveButtonBarState={variantCreateResult.status}
        warehouses={
          warehouses.data?.warehouses.edges.map(edge => edge.node) || []
        }
        weightUnit={shop?.defaultWeightUnit}
      />
    </>
  );
};
export default ProductVariant;
