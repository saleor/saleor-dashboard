// @ts-strict-ignore
import { getAttributesAfterFileAttributesUpdate } from "@dashboard/attributes/utils/data";
import {
  handleUploadMultipleFiles,
  prepareAttributesInput,
} from "@dashboard/attributes/utils/handlers";
import { AttributeInput } from "@dashboard/components/Attributes";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  useFileUploadMutation,
  useProductVariantChannelListingUpdateMutation,
  useProductVariantCreateDataQuery,
  useProductVariantReorderMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
  useVariantCreateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import {
  useReferencePageSearch,
  useReferenceProductSearch,
} from "@dashboard/searches/useReferenceSearch";
import useWarehouseSearch from "@dashboard/searches/useWarehouseSearch";
import useAttributeValueSearchHandler from "@dashboard/utils/handlers/attributeValueSearchHandler";
import createMetadataCreateHandler from "@dashboard/utils/handlers/metadataCreateHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { warehouseAddPath } from "@dashboard/warehouses/urls";
import { useIntl } from "react-intl";

import { getMutationErrors, weight } from "../../misc";
import { ProductVariantCreateData } from "../components/ProductVariantCreatePage/form";
import { ProductVariantCreatePage } from "../components/ProductVariantCreatePage/ProductVariantCreatePage";
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

const ProductVariant = ({ productId, params }: ProductVariantCreateProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();

  const {
    loadMore: fetchMoreWarehouses,
    search: searchWarehouses,
    result: searchWarehousesResult,
  } = useWarehouseSearch({
    variables: {
      first: 100,
      channnelsId: [],
      query: "",
    },
    skip: true,
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

      if (!variantId) {
        notify({
          status: "error",
          text: intl.formatMessage(messages.variantCreatedError),
        });

        return;
      }

      notify({
        status: "success",
        text: intl.formatMessage(messages.variantCreatedSuccess),
      });
      navigate(productVariantEditUrl(variantId), {
        resetScroll: true,
      });
    },
  });
  const [updateChannels] = useProductVariantChannelListingUpdateMutation({});
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [reorderProductVariants, reorderProductVariantsOpts] = useProductVariantReorderMutation({});
  const handleVariantReorder = createVariantReorderHandler(product, reorderProductVariants);
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
          name: formData.variantName,
          stocks: formData.stocks.map(stock => ({
            quantity: parseInt(stock.value, 10) || 0,
            warehouse: stock.id,
          })),
          trackInventory: true,
          weight: weight(formData.weight),
          quantityLimitPerCustomer: Number(formData.quantityLimitPerCustomer) || null,
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

    const id = variantCreateResult.data?.productVariantCreate?.productVariant?.id;

    if (!id) {
      return { id: null, errors: [] };
    }

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
  const handleVariantClick = (id: string) => navigate(productVariantEditUrl(id));
  const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
    navigate(
      productVariantAddUrl(productId, {
        ...params,
        action: "assign-attribute-value",
        id: attribute.id,
      }),
    );
  const refAttr =
    params.action === "assign-attribute-value" && params.id
      ? product?.productType.nonSelectionVariantAttributes?.find(a => a.id === params.id)
      : undefined;
  const {
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts,
  } = useReferenceProductSearch(refAttr);
  const {
    loadMore: loadMorePages,
    search: searchPages,
    result: searchPagesOpts,
  } = useReferencePageSearch(refAttr);
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts,
  } = useCollectionSearch({
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
  const fetchMoreReferenceCategories = {
    hasMore: searchCategoriesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchCategoriesOpts.loading,
    onFetchMore: loadMoreCategories,
  };
  const fetchMoreReferenceCollections = {
    hasMore: searchCollectionsOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchCollectionsOpts.loading,
    onFetchMore: loadMoreCollections,
  };
  const fetchMoreAttributeValues = {
    hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo?.hasNextPage,
    loading: !!searchAttributeValuesOpts.loading,
    onFetchMore: loadMoreAttributeValues,
  };
  const attributeValues = mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];
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
        searchWarehouses={searchWarehouses}
        errors={variantCreateResult.data?.productVariantCreate.errors || []}
        header={intl.formatMessage({
          id: "T6dXGG",
          defaultMessage: "Create Variant",
          description: "header",
        })}
        fetchMoreWarehouses={fetchMoreWarehouses}
        searchWarehousesResult={searchWarehousesResult}
        product={data?.product}
        attributeValues={attributeValues}
        onSubmit={handleSubmit}
        onVariantClick={handleVariantClick}
        onWarehouseConfigure={() => navigate(warehouseAddPath)}
        onVariantReorder={handleVariantReorder}
        saveButtonBarState={variantCreateResult.status}
        weightUnit={shop?.defaultWeightUnit}
        assignReferencesAttributeId={params.action === "assign-attribute-value" && params.id}
        onAssignReferencesClick={handleAssignAttributeReferenceClick}
        referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
        referenceProducts={mapEdgesToItems(searchProductsOpts?.data?.search) || []}
        referenceCategories={mapEdgesToItems(searchCategoriesOpts?.data?.search) || []}
        referenceCollections={mapEdgesToItems(searchCollectionsOpts?.data?.search) || []}
        fetchReferencePages={searchPages}
        fetchMoreReferencePages={fetchMoreReferencePages}
        fetchReferenceProducts={searchProducts}
        fetchMoreReferenceProducts={fetchMoreReferenceProducts}
        fetchReferenceCategories={searchCategories}
        fetchMoreReferenceCategories={fetchMoreReferenceCategories}
        fetchReferenceCollections={searchCollections}
        fetchMoreReferenceCollections={fetchMoreReferenceCollections}
        fetchAttributeValues={searchAttributeValues}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onCloseDialog={() => navigate(productVariantAddUrl(productId))}
        onAttributeSelectBlur={searchAttributeReset}
      />
    </>
  );
};

export default ProductVariant;
