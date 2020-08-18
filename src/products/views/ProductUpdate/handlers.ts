import { createChannelsDataFromProduct } from "@saleor/channels/utils";
import { BulkStockErrorFragment } from "@saleor/fragments/types/BulkStockErrorFragment";
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
import { ProductVariantCreateData_product } from "@saleor/products/types/ProductVariantCreateData";
import { ProductVariantDetails_productVariant_product } from "@saleor/products/types/ProductVariantDetails";
import { ProductVariantReorderVariables } from "@saleor/products/types/ProductVariantReorder";
import {
  SimpleProductUpdate,
  SimpleProductUpdateVariables
} from "@saleor/products/types/SimpleProductUpdate";
import { mapFormsetStockToStockInput } from "@saleor/products/utils/data";
import { ReorderEvent } from "@saleor/types";
import { diff } from "fast-array-diff";
import { MutationFetchResult } from "react-apollo";
import { arrayMove } from "react-sortable-hoc";

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
  }) => Promise<MutationFetchResult<ProductChannelListingUpdate>>
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
        publicationDate:
          data.publicationDate !== "" ? data.publicationDate : null,
        seo: {
          description: data.seoDescription,
          title: data.seoTitle
        },
        slug: data.slug,
        taxCode: data.changeTaxCode ? data.taxCode : null
      }
    };

    let errors: Array<
      ProductErrorFragment | StockErrorFragment | BulkStockErrorFragment
    >;

    if (product.productType.hasVariants) {
      const result = await updateProduct(productVariables);
      errors = result.data.productUpdate.errors;
    } else {
      const result = await updateSimpleProduct({
        ...productVariables,
        addStocks: data.addStocks.map(mapFormsetStockToStockInput),
        deleteStocks: data.removeStocks,
        input: {
          ...productVariables.input,
          weight: weight(data.weight)
        },
        productVariantId: product.variants[0].id,
        productVariantInput: {
          sku: data.sku,
          trackInventory: data.trackInventory
        },
        updateStocks: data.updateStocks.map(mapFormsetStockToStockInput)
      });
      errors = [
        ...result.data.productUpdate.errors,
        ...result.data.productVariantStocksCreate.errors,
        ...result.data.productVariantStocksDelete.errors,
        ...result.data.productVariantStocksUpdate.errors,
        ...result.data.productVariantUpdate.errors
      ];
    }
    const productChannels = createChannelsDataFromProduct(
      product.channelListing
    );
    const diffChannels = diff(
      productChannels,
      data.channelListing,
      (a, b) => a.id === b.id
    );
    updateChannels({
      variables: {
        id: product.id,
        input: {
          addChannels: data.channelListing.map(channel => ({
            channelId: channel.id,
            isPublished: channel.isPublished,
            publicationDate: channel.publicationDate
          })),
          removeChannels: diffChannels.removed?.map(
            removedChannel => removedChannel.id
          )
        }
      }
    });
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
