import { ChannelData } from "@saleor/channels/utils";
import { weight } from "@saleor/misc";
import { ProductCreateData } from "@saleor/products/components/ProductCreatePage/form";
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
import { SearchProductTypes_search_edges_node } from "@saleor/searches/types/SearchProductTypes";
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
  formData: ProductCreateData,
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
  return async (formData: ProductCreateData) => {
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
        productType: formData.productType?.id,
        seo: {
          description: formData.seoDescription,
          title: formData.seoTitle
        },
        sku: formData.sku,
        slug: formData.slug,
        stocks: formData.stocks.map(stock => ({
          quantity: parseInt(stock.value, 0),
          warehouse: stock.id
        })),
        taxCode: formData.changeTaxCode ? formData.taxCode : undefined,
        trackInventory: formData.trackInventory,
        weight: weight(formData.weight)
      }
    };

    const result = await productCreate(productVariables);

    const hasVariants = productTypes.find(
      product => product.id === formData.productType.id
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

      if (channelErrors.length === 0 && variantErrors.length === 0) {
        await updateVariantChannels({
          variables: {
            id: result[1].data.productVariantCreate.productVariant.id,
            input: formData.channelListing.map(listing => ({
              channelId: listing.id,
              price: listing.price
            }))
          }
        });
      }
    }

    await updateChannels(
      getChannelsVariables(productId, formData.channelListing)
    );

    return productId || null;
  };
}
