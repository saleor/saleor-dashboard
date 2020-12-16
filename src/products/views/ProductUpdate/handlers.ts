import {
  AttributeValueDelete,
  AttributeValueDeleteVariables
} from "@saleor/attributes/types/AttributeValueDelete";
import {
  getAttributesAfterFileAttributesUpdate,
  mergeAttributeValueDeleteErrors,
  mergeFileUploadErrors
} from "@saleor/attributes/utils/data";
import {
  handleDeleteMultipleAttributeValues,
  handleUploadMultipleFiles,
  prepareAttributesInput
} from "@saleor/attributes/utils/handlers";
import { createSortedChannelsDataFromProduct } from "@saleor/channels/utils";
import {
  FileUpload,
  FileUploadVariables
} from "@saleor/files/types/FileUpload";
import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import { BulkStockErrorFragment } from "@saleor/fragments/types/BulkStockErrorFragment";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { StockErrorFragment } from "@saleor/fragments/types/StockErrorFragment";
import { UploadErrorFragment } from "@saleor/fragments/types/UploadErrorFragment";
import { weight } from "@saleor/misc";
import { ProductUpdatePageSubmitData } from "@saleor/products/components/ProductUpdatePage";
import {
  ProductChannelListingUpdate,
  ProductChannelListingUpdateVariables
} from "@saleor/products/types/ProductChannelListingUpdate";
import {
  ProductDetails_product,
  ProductDetails_product_variants
} from "@saleor/products/types/ProductDetails";
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
import { move } from "@saleor/utils/lists";
import { diff } from "fast-array-diff";
import { MutationFetchResult } from "react-apollo";
import { arrayMove } from "react-sortable-hoc";

type SubmitErrors = Array<
  | ProductErrorFragment
  | StockErrorFragment
  | BulkStockErrorFragment
  | AttributeErrorFragment
  | UploadErrorFragment
  | ProductChannelListingErrorFragment
>;

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
  const productChannels = createSortedChannelsDataFromProduct(product);
  const diffChannels = diff(
    productChannels,
    data.channelListings,
    (a, b) => a.id === b.id
  );

  return {
    id: product.id,
    input: {
      addChannels: getAvailabilityVariables(data.channelListings),
      removeChannels: diffChannels.removed?.map(
        removedChannel => removedChannel.id
      )
    }
  };
};

const getVariantChannelsInput = (data: ProductUpdatePageSubmitData) =>
  data.channelListings.map(listing => ({
    channelId: listing.id,
    costPrice: listing.costPrice || null,
    price: listing.price
  }));

export function createUpdateHandler(
  product: ProductDetails_product,
  uploadFile: (
    variables: FileUploadVariables
  ) => Promise<MutationFetchResult<FileUpload>>,
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
  }) => Promise<MutationFetchResult<VariantCreate>>,
  deleteAttributeValue: (
    variables: AttributeValueDeleteVariables
  ) => Promise<MutationFetchResult<AttributeValueDelete>>
) {
  return async (data: ProductUpdatePageSubmitData) => {
    let errors: SubmitErrors = [];

    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      uploadFile
    );

    const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
      data.attributesWithNewFileValue,
      product?.attributes,
      deleteAttributeValue
    );

    errors = [
      ...errors,
      ...mergeFileUploadErrors(uploadFilesResult),
      ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult)
    ];
    const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
      data.attributesWithNewFileValue,
      uploadFilesResult
    );

    const productVariables: ProductUpdateVariables = {
      id: product.id,
      input: {
        attributes: prepareAttributesInput({
          attributes: data.attributes,
          updatedFileAttributes
        }),
        category: data.category,
        chargeTaxes: data.chargeTaxes,
        collections: data.collections,
        descriptionJson: JSON.stringify(data.description),
        name: data.name,
        rating: data.rating,
        seo: {
          description: data.seoDescription,
          title: data.seoTitle
        },
        slug: data.slug,
        taxCode: data.changeTaxCode ? data.taxCode : null
      }
    };

    if (product.productType.hasVariants) {
      const result = await updateProduct(productVariables);
      errors = [...errors, ...result.data.productUpdate.errors];

      await updateChannels({
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
        errors = [
          ...errors,
          ...productVariantResult.data.productVariantCreate.errors
        ];

        const variantId =
          productVariantResult.data.productVariantCreate?.productVariant?.id;
        if (variantId) {
          updateVariantChannels({
            variables: {
              id: variantId,
              input: getVariantChannelsInput(data)
            }
          });
          await updateChannels({
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
        errors = [...errors, ...getSimpleProductErrors(result.data)];

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

function areVariantsEqual(
  a: ProductDetails_product_variants,
  b: ProductDetails_product_variants
) {
  return a.id === b.id;
}

export function createVariantReorderHandler(
  product:
    | ProductDetails_product
    | ProductVariantDetails_productVariant_product
    | ProductVariantCreateData_product,
  reorderProductVariants: (variables: ProductVariantReorderVariables) => void
) {
  return ({ newIndex, oldIndex }: ReorderEvent) => {
    const oldVariantOrder = [...product.variants];

    product.variants = [
      ...(move(
        product.variants[oldIndex],
        product!.variants,
        areVariantsEqual,
        newIndex
      ) as ProductDetails_product_variants[])
    ];

    reorderProductVariants({
      move: {
        id: oldVariantOrder[oldIndex].id,
        sortOrder: newIndex - oldIndex
      },
      productId: product.id
    });
  };
}
