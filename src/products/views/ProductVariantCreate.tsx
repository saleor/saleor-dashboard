import { ChannelPriceData } from "@saleor/channels/utils";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { useProductVariantChannelListingUpdate } from "@saleor/products/mutations";
import { ProductVariantChannelListingUpdate } from "@saleor/products/types/ProductVariantChannelListingUpdate";
import { useWarehouseList } from "@saleor/warehouses/queries";
import React from "react";
import { useIntl } from "react-intl";

import ProductVariantCreatePage, {
  ProductVariantCreatePageSubmitData
} from "../components/ProductVariantCreatePage";
import { useVariantCreateMutation } from "../mutations";
import { useProductVariantCreateQuery } from "../queries";
import { productListUrl, productUrl, productVariantEditUrl } from "../urls";

interface ProductVariantCreateProps {
  productId: string;
}

export const ProductVariant: React.FC<ProductVariantCreateProps> = ({
  productId
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const warehouses = useWarehouseList({
    displayLoader: true,
    variables: {
      first: 50
    }
  });
  const { data, loading: productLoading } = useProductVariantCreateQuery({
    displayLoader: true,
    variables: { id: productId }
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

  const [
    updateChannels,
    updateChannelsOpts
  ] = useProductVariantChannelListingUpdate({
    onCompleted: handleCreateSuccess
  });

  const product = data?.product;

  const channels: ChannelPriceData[] = product?.channelListing.map(listing => ({
    costPrice: null,
    currency: listing.channel.currencyCode,
    id: listing.channel.id,
    name: listing.channel.name,
    price: null
  }));

  const handleSubmitChannels = (
    data: ProductVariantCreatePageSubmitData,
    variantId: string
  ) =>
    updateChannels({
      variables: {
        id: variantId,
        input: data.channelListing.map(listing => ({
          channelId: listing.id,
          costPrice: listing.costPrice,
          price: listing.price
        }))
      }
    });

  const [variantCreate, variantCreateResult] = useVariantCreateMutation({});

  const handleBack = () => navigate(productUrl(productId));
  const handleSubmit = async (formData: ProductVariantCreatePageSubmitData) => {
    const result = await variantCreate({
      variables: {
        input: {
          attributes: formData.attributes
            .filter(attribute => attribute.value !== "")
            .map(attribute => ({
              id: attribute.id,
              values: [attribute.value]
            })),
          product: productId,
          sku: formData.sku,
          stocks: formData.stocks.map(stock => ({
            quantity: parseInt(stock.value, 0),
            warehouse: stock.id
          })),
          trackInventory: true
        }
      }
    });
    const id = result.data?.productVariantCreate?.productVariant?.id;
    if (id) {
      handleSubmitChannels(formData, id);
    }
  };
  const handleVariantClick = (id: string) =>
    navigate(productVariantEditUrl(productId, id));

  const disableForm = productLoading || variantCreateResult.loading;

  return product === null ? (
    <NotFoundPage onBack={() => navigate(productListUrl())} />
  ) : (
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
          updateChannelsOpts?.data?.productVariantChannelListingUpdate
            ?.errors || []
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
        saveButtonBarState={variantCreateResult.status}
        warehouses={
          warehouses.data?.warehouses.edges.map(edge => edge.node) || []
        }
      />
    </>
  );
};
export default ProductVariant;
