import { FetchResult } from "@apollo/client";
import {
  getAttributesAfterFileAttributesUpdate,
  mergeAttributeValueDeleteErrors,
  mergeFileUploadErrors,
} from "@saleor/attributes/utils/data";
import {
  handleDeleteMultipleAttributeValues,
  handleUploadMultipleFiles,
  prepareAttributesInput,
} from "@saleor/attributes/utils/handlers";
import { ChannelData } from "@saleor/channels/utils";
import { VALUES_PAGINATE_BY } from "@saleor/config";
import {
  AttributeErrorFragment,
  AttributeValueDeleteMutation,
  AttributeValueDeleteMutationVariables,
  BulkStockErrorFragment,
  FileUploadMutation,
  FileUploadMutationVariables,
  Node,
  ProductChannelListingErrorFragment,
  ProductChannelListingUpdateMutation,
  ProductChannelListingUpdateMutationVariables,
  ProductErrorFragment,
  ProductFragment,
  ProductMediaCreateMutationVariables,
  ProductMediaReorderMutationVariables,
  ProductUpdateMutation,
  ProductUpdateMutationVariables,
  ProductVariantChannelListingUpdateMutation,
  ProductVariantChannelListingUpdateMutationVariables,
  ProductVariantReorderMutationVariables,
  SimpleProductUpdateMutation,
  SimpleProductUpdateMutationVariables,
  StockErrorFragment,
  UploadErrorFragment,
  VariantCreateMutation,
  VariantCreateMutationVariables,
} from "@saleor/graphql";
import { ProductUpdatePageSubmitData } from "@saleor/products/components/ProductUpdatePage";
import {
  getAttributeInputFromProduct,
  mapFormsetStockToStockInput,
} from "@saleor/products/utils/data";
import { ReorderEvent } from "@saleor/types";
import { move } from "@saleor/utils/lists";
import { getParsedDataForJsonStringField } from "@saleor/utils/richText/misc";
import { arrayMove } from "react-sortable-hoc";

import {
  getChannelsVariables,
  getSimpleChannelsVariables,
  getSimpleProductErrors,
  getSimpleProductVariables,
  getVariantChannelsInput,
} from "./utils";

type SubmitErrors = Array<
  | ProductErrorFragment
  | StockErrorFragment
  | BulkStockErrorFragment
  | AttributeErrorFragment
  | UploadErrorFragment
  | ProductChannelListingErrorFragment
>;

export function createUpdateHandler(
  product: ProductFragment,
  allChannels: ChannelData[],
  uploadFile: (
    variables: FileUploadMutationVariables,
  ) => Promise<FetchResult<FileUploadMutation>>,
  updateProduct: (
    variables: ProductUpdateMutationVariables,
  ) => Promise<FetchResult<ProductUpdateMutation>>,
  updateSimpleProduct: (
    variables: SimpleProductUpdateMutationVariables,
  ) => Promise<FetchResult<SimpleProductUpdateMutation>>,
  updateChannels: (options: {
    variables: ProductChannelListingUpdateMutationVariables;
  }) => Promise<FetchResult<ProductChannelListingUpdateMutation>>,
  updateVariantChannels: (options: {
    variables: ProductVariantChannelListingUpdateMutationVariables;
  }) => Promise<FetchResult<ProductVariantChannelListingUpdateMutation>>,
  productVariantCreate: (options: {
    variables: VariantCreateMutationVariables;
  }) => Promise<FetchResult<VariantCreateMutation>>,
  deleteAttributeValue: (
    variables: AttributeValueDeleteMutationVariables,
  ) => Promise<FetchResult<AttributeValueDeleteMutation>>,
) {
  return async (data: ProductUpdatePageSubmitData) => {
    let errors: SubmitErrors = [];

    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      uploadFile,
    );

    const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
      data.attributesWithNewFileValue,
      product?.attributes,
      deleteAttributeValue,
    );

    errors = [
      ...errors,
      ...mergeFileUploadErrors(uploadFilesResult),
      ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
    ];
    const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
      data.attributesWithNewFileValue,
      uploadFilesResult,
    );

    const productVariables: ProductUpdateMutationVariables = {
      id: product.id,
      input: {
        attributes: prepareAttributesInput({
          attributes: data.attributes,
          prevAttributes: getAttributeInputFromProduct(product),
          updatedFileAttributes,
        }),
        category: data.category,
        chargeTaxes: data.chargeTaxes,
        collections: data.collections,
        description: getParsedDataForJsonStringField(data.description),
        name: data.name,
        rating: data.rating,
        seo: {
          description: data.seoDescription,
          title: data.seoTitle,
        },
        slug: data.slug,
        taxCode: data.changeTaxCode ? data.taxCode : null,
      },
      firstValues: VALUES_PAGINATE_BY,
    };

    if (product.productType.hasVariants) {
      const result = await updateProduct(productVariables);
      errors = [...errors, ...result.data.productUpdate.errors];

      if (product.variants.length === 0) {
        await updateChannels(getSimpleChannelsVariables(data, product));
      } else {
        await updateChannels(getChannelsVariables(product, allChannels, data));
      }
    } else {
      if (!product.variants.length) {
        const productVariantResult = await productVariantCreate({
          variables: {
            input: {
              attributes:
                product.productType.variantAttributes?.map(attribute => ({
                  id: attribute.id,
                  values: attribute.choices.edges.map(value => value.node.slug),
                })) || [],
              product: product.id,
              sku: data.sku,
              stocks: data.updateStocks.map(mapFormsetStockToStockInput),
            },
          },
        });
        errors = [
          ...errors,
          ...productVariantResult.data.productVariantCreate.errors,
        ];

        const variantId =
          productVariantResult.data.productVariantCreate?.productVariant?.id;

        if (variantId) {
          updateVariantChannels({
            variables: {
              id: variantId,
              input: getVariantChannelsInput(data),
            },
          });

          await updateChannels(
            getChannelsVariables(product, allChannels, data),
          );

          const result = await updateSimpleProduct(
            getSimpleProductVariables(productVariables, data, variantId),
          );
          errors = [...errors, ...getSimpleProductErrors(result.data)];
        }
      } else {
        const result = await updateSimpleProduct(
          getSimpleProductVariables(
            productVariables,
            data,
            product.variants[0].id,
          ),
        );
        errors = [...errors, ...getSimpleProductErrors(result.data)];

        await updateChannels(getSimpleChannelsVariables(data, product));

        updateVariantChannels({
          variables: {
            id: product.variants[0].id,
            input: getVariantChannelsInput(data),
          },
        });
      }
    }

    return errors;
  };
}

export function createImageUploadHandler(
  id: string,
  createProductImage: (variables: ProductMediaCreateMutationVariables) => void,
) {
  return (file: File) =>
    createProductImage({
      alt: "",
      image: file,
      product: id,
    });
}

export function createImageReorderHandler(
  product: ProductFragment,
  reorderProductImages: (
    variables: ProductMediaReorderMutationVariables,
  ) => void,
) {
  return ({ newIndex, oldIndex }: ReorderEvent) => {
    let ids = product.media.map(image => image.id);
    ids = arrayMove(ids, oldIndex, newIndex);
    reorderProductImages({
      mediaIds: ids,
      productId: product.id,
    });
  };
}

function areVariantsEqual(a: Node, b: Node) {
  return a.id === b.id;
}

export function createVariantReorderHandler<
  T extends { id: string; variants: any[] }
>(
  product: T,
  reorderProductVariants: (
    variables: ProductVariantReorderMutationVariables,
  ) => void,
) {
  return ({ newIndex, oldIndex }: ReorderEvent) => {
    const oldVariantOrder = [...product.variants];

    product.variants = [
      ...move<T["variants"][0]>(
        product.variants[oldIndex],
        product!.variants,
        areVariantsEqual,
        newIndex,
      ),
    ];

    reorderProductVariants({
      move: {
        id: oldVariantOrder[oldIndex].id,
        sortOrder: newIndex - oldIndex,
      },
      productId: product.id,
    });
  };
}
