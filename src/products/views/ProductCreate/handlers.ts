import {
  getAttributesAfterFileAttributesUpdate,
  mergeFileUploadErrors
} from "@saleor/attributes/utils/data";
import {
  handleUploadMultipleFiles,
  prepareAttributesInput
} from "@saleor/attributes/utils/handlers";
import { ChannelData } from "@saleor/channels/utils";
import {
  FileUpload,
  FileUploadVariables
} from "@saleor/files/types/FileUpload";
import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import { UploadErrorFragment } from "@saleor/fragments/types/UploadErrorFragment";
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
  ProductDelete,
  ProductDeleteVariables
} from "@saleor/products/types/ProductDelete";
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
  formData: ProductCreateData,
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
  uploadFile: (
    variables: FileUploadVariables
  ) => Promise<MutationFetchResult<FileUpload>>,
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
  }) => Promise<MutationFetchResult<ProductVariantChannelListingUpdate>>,
  productDelete: (options: {
    variables: ProductDeleteVariables;
  }) => Promise<MutationFetchResult<ProductDelete>>
) {
  return async (formData: ProductCreateData) => {
    let errors: Array<AttributeErrorFragment | UploadErrorFragment> = [];

    const uploadFilesResult = await handleUploadMultipleFiles(
      formData.attributesWithNewFileValue,
      uploadFile
    );

    errors = [...errors, ...mergeFileUploadErrors(uploadFilesResult)];
    const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
      formData.attributesWithNewFileValue,
      uploadFilesResult
    );

    const productVariables: ProductCreateVariables = {
      input: {
        attributes: prepareAttributesInput({
          attributes: formData.attributes,
          updatedFileAttributes
        }),
        category: formData.category,
        chargeTaxes: formData.chargeTaxes,
        collections: formData.collections,
        descriptionJson: JSON.stringify(formData.description),
        name: formData.name,
        productType: formData.productType?.id,
        rating: formData.rating,
        seo: {
          description: formData.seoDescription,
          title: formData.seoTitle
        },
        slug: formData.slug,
        taxCode: formData.changeTaxCode ? formData.taxCode : undefined,
        weight: weight(formData.weight)
      }
    };

    const result = await productCreate(productVariables);
    let hasErrors = errors.length > 0;

    const hasVariants = productTypes.find(
      product => product.id === formData.productType.id
    ).hasVariants;
    const productId = result.data.productCreate.product?.id;

    if (!productId) {
      return null;
    }

    if (!hasVariants) {
      const result = await Promise.all([
        updateChannels(
          getChannelsVariables(productId, formData.channelListings)
        ),
        productVariantCreate(getSimpleProductVariables(formData, productId))
      ]);
      const channelErrors = result[0].data?.productChannelListingUpdate?.errors;
      const variantErrors = result[1].data?.productVariantCreate?.errors;

      if ([...(channelErrors || []), ...(variantErrors || [])].length > 0) {
        hasErrors = true;
      }

      const variantId = result[1].data.productVariantCreate.productVariant?.id;
      if (variantErrors.length === 0 && variantId) {
        updateVariantChannels({
          variables: {
            id: variantId,
            input: formData.channelListings.map(listing => ({
              channelId: listing.id,
              costPrice: listing.costPrice || null,
              price: listing.price
            }))
          }
        });
      }
    } else {
      const result = await updateChannels(
        getChannelsVariables(productId, formData.channelListings)
      );

      if (result.data?.productChannelListingUpdate?.errors.length > 0) {
        hasErrors = true;
      }
    }

    /*
     INFO: This is a stop-gap solution, where we delete products that didn't meet all required data in the create form
     A more robust solution would require merging create and update form into one to persist form state across redirects
    */
    if (productId && hasErrors) {
      await productDelete({ variables: { id: productId } });

      return null;
    }
    return productId || null;
  };
}
