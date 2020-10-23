import { createChannelsDataFromProduct } from "@saleor/channels/utils";
import { BulkStockErrorFragment } from "@saleor/fragments/types/BulkStockErrorFragment";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { StockErrorFragment } from "@saleor/fragments/types/StockErrorFragment";
import { weight } from "@saleor/misc";
import { ProductUpdatePageSubmitData } from "@saleor/products/components/ProductUpdatePage";
import {
  ProductChannelListingUpdate,
  ProductChannelListingUpdateVariables
} from "@saleor/products/types/ProductChannelListingUpdate";
import { ProductDetails_product } from "@saleor/products/types/ProductDetails";
import { ProductImageCreateVariables } from "@saleor/products/types/ProductImageCreate";
import { ProductImageReorderVariables } from "@saleor/products/types/ProductImageReorder";
import {
  ProductUpdate,
  ProductUpdateVariables
} from "@saleor/products/types/ProductUpdate";
import {
  ProductVariantChannelListingUpdate,
  ProductVariantChannelListingUpdateVariables
} from "@saleor/products/types/ProductVariantChannelListingUpdate";
import { ProductVariantCreateData_product } from "@saleor/products/types/ProductVariantCreateData";
import { ProductVariantDetails_productVariant_product } from "@saleor/products/types/ProductVariantDetails";
import { ProductVariantReorderVariables } from "@saleor/products/types/ProductVariantReorder";
import {
  SimpleProductUpdate,
  SimpleProductUpdateVariables
} from "@saleor/products/types/SimpleProductUpdate";
import {
  VariantCreate,
  VariantCreateVariables
} from "@saleor/products/types/VariantCreate";
import { mapFormsetStockToStockInput } from "@saleor/products/utils/data";
import { getAvailabilityVariables } from "@saleor/products/utils/handlers";
import { ReorderEvent } from "@saleor/types";
import { diff } from "fast-array-diff";
import { MutationFetchResult } from "react-apollo";
import { arrayMove } from "react-sortable-hoc";

const getSimpleProductVariables = (
  productVariables: ProductUpdateVariables,
  data: ProductUpdatePageSubmitData,
  productId: string
) => ({
  ...productVariables,
  addStocks: data.addStocks.map(mapFormsetStockToStockInput),
  deleteStocks: data.removeStocks,
  input: {
    ...productVariables.input,
    weight: weight(data.weight)
  },
  productVariantId: productId,
  productVariantInput: {
    sku: data.sku,
    trackInventory: data.trackInventory
  },
  updateStocks: data.updateStocks.map(mapFormsetStockToStockInput)
});

const getSimpleProductErrors = (data: SimpleProductUpdate) => [
  ...data.productUpdate.errors,
  ...data.productVariantStocksCreate.errors,
  ...data.productVariantStocksDelete.errors,
  ...data.productVariantStocksUpdate.errors
];

const getChannelsVariables = (
  data: ProductUpdatePageSubmitData,
  product: ProductDetails_product
) => {
  const productChannels = createChannelsDataFromProduct(product);
  const diffChannels = diff(
    productChannels,
    data.channelListing,
    (a, b) => a.id === b.id
  );

  return {
    id: product.id,
    input: {
      addChannels: getAvailabilityVariables(data.channelListing),
      removeChannels: diffChannels.removed?.map(
        removedChannel => removedChannel.id
      )
    }
  };
};

const getVariantChannelsInput = (data: ProductUpdatePageSubmitData) =>
  data.channelListing.map(listing => ({
    channelId: listing.id,
    costPrice: listing.costPrice || null,
    price: listing.price
  }));

export function createUpdateHandler(
  product: ProductDetails_product,
  updateProduct: (
    variables: ProductUpdateVariables
  ) => Promise<MutationFetchResult<ProductUpdate>>,
  updateSimpleProduct: (
    variables: SimpleProductUpdateVariables
  ) => Promise<MutationFetchResult<SimpleProductUpdate>>,
  updateChannels: (options: {
    variables: ProductChannelListingUpdateVariables;
  }) => Promise<MutationFetchResult<ProductChannelListingUpdate>>,
  updateVariantChannels: (options: {
    variables: ProductVariantChannelListingUpdateVariables;
  }) => Promise<MutationFetchResult<ProductVariantChannelListingUpdate>>,
  productVariantCreate: (options: {
    variables: VariantCreateVariables;
  }) => Promise<MutationFetchResult<VariantCreate>>
) {
  return async (data: ProductUpdatePageSubmitData) => {
    const productVariables: ProductUpdateVariables = {
      id: product.id,
      input: {
        attributes: data.attributes.map(attribute => ({
          id: attribute.id,
          values: attribute.value[0] === "" ? [] : attribute.value
        })),
        category: data.category,
        chargeTaxes: data.chargeTaxes,
        collections: data.collections,
        descriptionJson: JSON.stringify(data.description),
        name: data.name,
        seo: {
          description: data.seoDescription,
          title: data.seoTitle
        },
        slug: data.slug,
        taxCode: data.changeTaxCode ? data.taxCode : null
      }
    };

    let errors: Array<
      | ProductErrorFragment
      | StockErrorFragment
      | BulkStockErrorFragment
      | ProductChannelListingErrorFragment
    >;

    if (product.productType.hasVariants) {
      const result = await updateProduct(productVariables);
      errors = result.data.productUpdate.errors;

      updateChannels({
        variables: getChannelsVariables(data, product)
      });
    } else {
      if (!product.variants.length) {
        const productVariantResult = await productVariantCreate({
          variables: {
            input: {
              attributes:
                product.productType.variantAttributes?.map(attribute => ({
                  id: attribute.id,
                  values: attribute.values.map(value => value.slug)
                })) || [],
              product: product.id,
              sku: data.sku,
              stocks: data.updateStocks.map(mapFormsetStockToStockInput)
            }
          }
        });
        errors = productVariantResult.data.productVariantCreate.errors;

        const variantId =
          productVariantResult.data.productVariantCreate?.productVariant?.id;
        if (variantId) {
          updateVariantChannels({
            variables: {
              id: variantId,
              input: getVariantChannelsInput(data)
            }
          });
          updateChannels({
            variables: getChannelsVariables(data, product)
          });
          const result = await updateSimpleProduct(
            getSimpleProductVariables(productVariables, data, variantId)
          );
          errors = [...errors, ...getSimpleProductErrors(result.data)];
        }
      } else {
        const result = await updateSimpleProduct(
          getSimpleProductVariables(
            productVariables,
            data,
            product.variants[0].id
          )
        );
        errors = getSimpleProductErrors(result.data);

        await updateChannels({
          variables: getChannelsVariables(data, product)
        });
        updateVariantChannels({
          variables: {
            id: product.variants[0].id,
            input: getVariantChannelsInput(data)
          }
        });
      }
    }

    return errors;
  };
}

export function createImageUploadHandler(
  id: string,
  createProductImage: (variables: ProductImageCreateVariables) => void
) {
  return (file: File) =>
    createProductImage({
      alt: "",
      image: file,
      product: id
    });
}

export function createImageReorderHandler(
  product: ProductDetails_product,
  reorderProductImages: (variables: ProductImageReorderVariables) => void
) {
  return ({ newIndex, oldIndex }: ReorderEvent) => {
    let ids = product.images.map(image => image.id);
    ids = arrayMove(ids, oldIndex, newIndex);
    reorderProductImages({
      imagesIds: ids,
      productId: product.id
    });
  };
}

export function createVariantReorderHandler(
  product:
    | ProductDetails_product
    | ProductVariantDetails_productVariant_product
    | ProductVariantCreateData_product,
  reorderProductVariants: (variables: ProductVariantReorderVariables) => void
) {
  return ({ newIndex, oldIndex }: ReorderEvent) => {
    reorderProductVariants({
      move: {
        id: product.variants[oldIndex].id,
        sortOrder: newIndex - oldIndex
      },
      productId: product.id
    });
  };
}
