import { ChannelData } from "@saleor/channels/utils";
import { ProductCreatePageSubmitData } from "@saleor/products/components/ProductCreatePage";
import {
  ProductChannelListingUpdate,
  ProductChannelListingUpdateVariables
} from "@saleor/products/types/ProductChannelListingUpdate";
import {
  ProductCreate,
  ProductCreateVariables
} from "@saleor/products/types/ProductCreate";
import {
  ProductVariantChannelListingUpdate,
  ProductVariantChannelListingUpdateVariables
} from "@saleor/products/types/ProductVariantChannelListingUpdate";
import {
  VariantCreate,
  VariantCreateVariables
} from "@saleor/products/types/VariantCreate";
import { getAvailabilityVariables } from "@saleor/products/utils/handlers";
import { SearchProductTypes_search_edges_node } from "@saleor/searches/types/SearchProductTypes";
import { MutationFetchResult } from "react-apollo";

const getChannelsVariables = (productId: string, channels: ChannelData[]) => ({
  variables: {
    id: productId,
    input: {
      addChannels: getAvailabilityVariables(channels)
    }
  }
});

const getSimpleProductVariables = (
  formData: ProductCreatePageSubmitData,
  productId: string
) => ({
  input: {
    attributes: [],
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
      input: {
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
      }
    };

    const result = await productCreate(productVariables);

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
      const variantErrors = result[1].data.productVariantCreate.errors;
      const variantId = result[1].data.productVariantCreate.productVariant.id;
      if (variantErrors.length === 0 && variantId) {
        updateVariantChannels({
          variables: {
            id: variantId,
            input: formData.channelListing.map(listing => ({
              channelId: listing.id,
              costPrice: listing.costPrice || null,
              price: listing.price
            }))
          }
        });
      }
    } else {
      updateChannels(getChannelsVariables(productId, formData.channelListing));
    }
    return productId || null;
  };
}
