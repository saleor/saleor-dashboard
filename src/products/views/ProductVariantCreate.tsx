import { getAttributesAfterFileAttributesUpdate } from "@saleor/attributes/utils/data";
import {
  handleUploadMultipleFiles,
  prepareAttributesInput,
} from "@saleor/attributes/utils/handlers";
import { AttributeInput } from "@saleor/components/Attributes";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import {
  useFileUploadMutation,
  useProductVariantChannelListingUpdateMutation,
  useProductVariantCreateDataQuery,
  useProductVariantReorderMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
  useVariantCreateMutation,
  useWarehouseListQuery,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import usePageSearch from "@saleor/searches/usePageSearch";
import useProductSearch from "@saleor/searches/useProductSearch";
import useAttributeValueSearchHandler from "@saleor/utils/handlers/attributeValueSearchHandler";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { warehouseAddPath } from "@saleor/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

import { getMutationErrors, weight } from "../../misc";
import ProductVariantCreatePage from "../components/ProductVariantCreatePage";
import { ProductVariantCreateData } from "../components/ProductVariantCreatePage/form";
import {
  productListUrl,
  productVariantAddUrl,
  ProductVariantAddUrlQueryParams,
  productVariantEditUrl,
} from "../urls";
import { variantCreateMessages as messages } from "./messages";
import { createVariantReorderHandler } from "./ProductUpdate/handlers";

interface ProductVariantCreateProps {
  productId: string;
  params: ProductVariantAddUrlQueryParams;
}

export const ProductVariant: React.FC<ProductVariantCreateProps> = ({
  productId,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();

  const shop = useShop();
  const intl = useIntl();
  const warehouses = useWarehouseListQuery({
    displayLoader: true,
    variables: {
      first: 50,
    },
  });

  const { data, loading: productLoading } = useProductVariantCreateDataQuery({
    displayLoader: true,
    variables: {
      id: productId,
      firstValues: 10,
    },
  });

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const product = data?.product;

  const [variantCreate, variantCreateResult] = useVariantCreateMutation({
    onCompleted: data => {
      const variantId = data.productVariantCreate.productVariant.id;

      notify({
        status: "success",
        text: intl.formatMessage(messages.variantCreatedSuccess),
      });
      navigate(productVariantEditUrl(productId, variantId), {
        resetScroll: true,
      });
    },
  });
  const [updateChannels] = useProductVariantChannelListingUpdateMutation({});
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  const [
    reorderProductVariants,
    reorderProductVariantsOpts,
  ] = useProductVariantReorderMutation({});

  const handleVariantReorder = createVariantReorderHandler(product, variables =>
    reorderProductVariants({ variables }),
  );

  const handleCreate = async (formData: ProductVariantCreateData) => {
    const uploadFilesResult = await handleUploadMultipleFiles(
      formData.attributesWithNewFileValue,
      variables => uploadFile({ variables }),
    );

    const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
      formData.attributesWithNewFileValue,
      uploadFilesResult,
    );

    const variantCreateResult = await variantCreate({
      variables: {
        input: {
          attributes: prepareAttributesInput({
            attributes: formData.attributes.filter(
              attribute => attribute.value?.length && attribute.value[0] !== "",
            ),
            prevAttributes: null,
            updatedFileAttributes,
          }),
          product: productId,
          sku: formData.sku,
          stocks: formData.stocks.map(stock => ({
            quantity: parseInt(stock.value, 10) || 0,
            warehouse: stock.id,
          })),
          trackInventory: true,
          weight: weight(formData.weight),
          quantityLimitPerCustomer:
            Number(formData.quantityLimitPerCustomer) || null,
          preorder: formData.isPreorder
            ? {
                globalThreshold: formData.globalThreshold
                  ? parseInt(formData.globalThreshold, 10)
                  : null,
                endDate: formData.preorderEndDateTime || null,
              }
            : undefined,
        },
        firstValues: 10,
      },
    });

    const variantCreateResultErrors = getMutationErrors(variantCreateResult);

    if (variantCreateResultErrors.length > 0) {
      return { id: null, errors: variantCreateResultErrors };
    }

    const id = variantCreateResult.data.productVariantCreate.productVariant.id;

    const updateChannelsResult = await updateChannels({
      variables: {
        id,
        input: formData.channelListings.map(listing => ({
          channelId: listing.id,
          costPrice: listing.value.costPrice || null,
          price: listing.value.price,
          preorderThreshold: listing.value.preorderThreshold,
        })),
      },
    });

    const updateChannelsErrors = getMutationErrors(updateChannelsResult);

    return { id, errors: updateChannelsErrors };
  };

  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata,
  );
  const handleVariantClick = (id: string) =>
    navigate(productVariantEditUrl(productId, id));

  const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
    navigate(
      productVariantAddUrl(productId, {
        action: "assign-attribute-value",
        id: attribute.id,
      }),
    );

  const {
    loadMore: loadMorePages,
    search: searchPages,
    result: searchPagesOpts,
  } = usePageSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts,
  } = useProductSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreAttributeValues,
    search: searchAttributeValues,
    result: searchAttributeValuesOpts,
    reset: searchAttributeReset,
  } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);

  const fetchMoreReferencePages = {
    hasMore: searchPagesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchPagesOpts.loading,
    onFetchMore: loadMorePages,
  };
  const fetchMoreReferenceProducts = {
    hasMore: searchProductsOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchProductsOpts.loading,
    onFetchMore: loadMoreProducts,
  };
  const fetchMoreAttributeValues = {
    hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo
      ?.hasNextPage,
    loading: !!searchAttributeValuesOpts.loading,
    onFetchMore: loadMoreAttributeValues,
  };

  const attributeValues =
    mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];

  const disableForm =
    productLoading ||
    uploadFileOpts.loading ||
    variantCreateResult.loading ||
    reorderProductVariantsOpts.loading;

  if (product === null) {
    return <NotFoundPage onBack={() => navigate(productListUrl())} />;
  }

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "MyM2oR",
          defaultMessage: "Create variant",
          description: "window title",
        })}
      />
      <ProductVariantCreatePage
        productId={productId}
        defaultVariantId={data?.product.defaultVariant?.id}
        disabled={disableForm}
        errors={variantCreateResult.data?.productVariantCreate.errors || []}
        header={intl.formatMessage({
          id: "T6dXGG",
          defaultMessage: "Create Variant",
          description: "header",
        })}
        product={data?.product}
        attributeValues={attributeValues}
        onSubmit={handleSubmit}
        onVariantClick={handleVariantClick}
        onWarehouseConfigure={() => navigate(warehouseAddPath)}
        onVariantReorder={handleVariantReorder}
        saveButtonBarState={variantCreateResult.status}
        warehouses={mapEdgesToItems(warehouses?.data?.warehouses) || []}
        weightUnit={shop?.defaultWeightUnit}
        assignReferencesAttributeId={
          params.action === "assign-attribute-value" && params.id
        }
        onAssignReferencesClick={handleAssignAttributeReferenceClick}
        referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
        referenceProducts={
          mapEdgesToItems(searchProductsOpts?.data?.search) || []
        }
        fetchReferencePages={searchPages}
        fetchMoreReferencePages={fetchMoreReferencePages}
        fetchReferenceProducts={searchProducts}
        fetchMoreReferenceProducts={fetchMoreReferenceProducts}
        fetchAttributeValues={searchAttributeValues}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onCloseDialog={() => navigate(productVariantAddUrl(productId))}
        onAttributeSelectBlur={searchAttributeReset}
      />
    </>
  );
};
export default ProductVariant;
