import { ChannelData } from "@saleor/channels/utils";
import { BulkStockErrorFragment } from "@saleor/fragments/types/BulkStockErrorFragment";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { StockErrorFragment } from "@saleor/fragments/types/StockErrorFragment";
import { ProductCreatePageSubmitData } from "@saleor/products/components/ProductCreatePage";
import {
  ProductChannelListingUpdate,
  ProductChannelListingUpdate_productChannelListingUpdate_productChannelListingErrors,
  ProductChannelListingUpdateVariables
} from "@saleor/products/types/ProductChannelListingUpdate";
import {
  ProductCreate,
  ProductCreateVariables
} from "@saleor/products/types/ProductCreate";
import {
  ProductVariantChannelListingUpdate,
  ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_productChannelListingErrors,
  ProductVariantChannelListingUpdateVariables
} from "@saleor/products/types/ProductVariantChannelListingUpdate";
import {
  VariantCreate,
  VariantCreateVariables
} from "@saleor/products/types/VariantCreate";
import { SearchProductTypes_search_edges_node } from "@saleor/searches/types/SearchProductTypes";
import { compact } from "lodash";
import { MutationFetchResult } from "react-apollo";

const getChannelsVariables = (productId: string, channels: ChannelData[]) => ({
  variables: {
    id: productId,
    input: {
      addChannels: channels.map(channel => ({
        channelId: channel.id,
        isPublished: channel.isPublished,
        publicationDate: channel.publicationDate
      }))
    }
  }
});

const getSimpleProductVariables = (
  formData: ProductCreatePageSubmitData,
  productId: string
) => ({
  input: {
    attributes: [],
    costPrice: formData.basePrice,
    product: productId,
    sku: formData.sku,
    stocks: formData.stocks?.map(stock => ({
      quantity: parseInt(stock.value, 10),
      warehouse: stock.id
    })),
    trackInventory: formData.trackInventory
  }
});

export function createHandler(
  productTypes: SearchProductTypes_search_edges_node[],
  productCreate: (
    variables: ProductCreateVariables
  ) => Promise<MutationFetchResult<ProductCreate>>,
  productVariantCreate: (
    variables: VariantCreateVariables
  ) => Promise<MutationFetchResult<VariantCreate>>,
  updateChannels: (options: {
    variables: ProductChannelListingUpdateVariables;
  }) => Promise<MutationFetchResult<ProductChannelListingUpdate>>,
  updateVariantChannels: (options: {
    variables: ProductVariantChannelListingUpdateVariables;
  }) => Promise<MutationFetchResult<ProductVariantChannelListingUpdate>>
) {
  return async (formData: ProductCreatePageSubmitData) => {
    const productVariables: ProductCreateVariables = {
      attributes: formData.attributes.map(attribute => ({
        id: attribute.id,
        values: attribute.value
      })),
      category: formData.category,
      chargeTaxes: formData.chargeTaxes,
      collections: formData.collections,
      descriptionJson: JSON.stringify(formData.description),
      name: formData.name,
      productType: formData.productType,
      seo: {
        description: formData.seoDescription,
        title: formData.seoTitle
      }
    };

    let errors: Array<
      | ProductErrorFragment
      | StockErrorFragment
      | BulkStockErrorFragment
      | ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_productChannelListingErrors
      | ProductChannelListingUpdate_productChannelListingUpdate_productChannelListingErrors
    >;

    const result = await productCreate(productVariables);
    errors = [...result.data.productCreate.errors];

    const hasVariants = productTypes.find(
      product => product.id === formData.productType
    ).hasVariants;
    const productId = result.data.productCreate.product.id;

    if (!hasVariants) {
      const result = await Promise.all([
        updateChannels(
          getChannelsVariables(productId, formData.channelListing)
        ),
        productVariantCreate(getSimpleProductVariables(formData, productId))
      ]);
      const channelErrors =
        result[0].data.productChannelListingUpdate.productChannelListingErrors;
      const variantErrors = result[1].data.productVariantCreate.errors;

      errors = [...errors, ...channelErrors, ...variantErrors];

      if (channelErrors.length === 0 && variantErrors.length === 0) {
        const variantPrices = compact(
          formData.channelListing.map(
            listing =>
              listing.price !== null && {
                channelId: listing.id,
                price: listing.price
              }
          )
        );
        if (variantPrices.length) {
          const variantResult = await updateVariantChannels({
            variables: {
              id: result[1].data.productVariantCreate.productVariant.id,
              input: variantPrices
            }
          });
          errors = [
            ...errors,
            ...variantResult.data.productVariantChannelListingUpdate
              .productChannelListingErrors
          ];
        }
      }
    }

    const channelResponse = await updateChannels(
      getChannelsVariables(productId, formData.channelListing)
    );

    return [
      ...errors,
      ...channelResponse.data.productChannelListingUpdate
        .productChannelListingErrors
    ];
  };
}
