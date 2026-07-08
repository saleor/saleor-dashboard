// @ts-strict-ignore
import { type ChannelData, createSortedChannelsData } from "@dashboard/channels/utils";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { getReferenceTypeConstraints } from "@dashboard/components/AssignAttributeValueDialog/getReferenceTypeConstraints";
import { getReferenceWhereConstraints } from "@dashboard/components/AssignAttributeValueDialog/mergeReferenceTypeWhereConstraints";
import { type AttributeInput } from "@dashboard/components/Attributes";
import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, VALUES_PAGINATE_BY } from "@dashboard/config";
import {
  type ProductChannelListingErrorFragment,
  type ProductErrorWithAttributesFragment,
  useFileUploadMutation,
  useProductChannelListingUpdateMutation,
  useProductCreateMutation,
  useProductDeleteMutation,
  useProductTypeQuery,
  useProductVariantChannelListingUpdateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
  useVariantCreateMutation,
} from "@dashboard/graphql";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useChannels from "@dashboard/hooks/useChannels";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import ProductCreatePage, {
  type ProductCreateData,
} from "@dashboard/products/components/ProductCreatePage";
import {
  productAddUrl,
  type ProductCreateUrlDialog,
  type ProductCreateUrlQueryParams,
  productUrl,
} from "@dashboard/products/urls";
import { splitProductSubmitErrors } from "@dashboard/products/utils/splitSubmitErrors";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import useProductTypeSearch from "@dashboard/searches/useProductTypeSearch";
import {
  useReferenceCategorySearch,
  useReferenceCollectionSearch,
  useReferencePageSearch,
  useReferenceProductSearch,
} from "@dashboard/searches/useReferenceSearch";
import useWarehouseSearch from "@dashboard/searches/useWarehouseSearch";
import { useTaxClassFetchMore } from "@dashboard/taxes/utils/useTaxClassFetchMore";
import { getProductErrorMessage } from "@dashboard/utils/errors";
import useAttributeValueSearchHandler from "@dashboard/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@dashboard/utils/handlers/metadataCreateHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { warehouseAddPath } from "@dashboard/warehouses/urls";
import { useOnboarding } from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { useAssignAttributeValueDialogFilterChangeHandlers } from "../../../components/AssignAttributeValueDialog/useAssignAttributeValueDialogFilterChangeHandlers";
import { PRODUCT_CREATE_FORM_ID } from "./consts";
import { createHandler } from "./handlers";

interface ProductCreateProps {
  params: ProductCreateUrlQueryParams;
}

const ProductCreateView = ({ params }: ProductCreateProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const { markOnboardingStepAsCompleted } = useOnboarding();
  const intl = useIntl();
  const [submitErrors, setSubmitErrors] = useState<ProductErrorWithAttributesFragment[]>([]);
  const [submitChannelsErrors, setSubmitChannelsErrors] = useState<
    ProductChannelListingErrorFragment[]
  >([]);
  const selectedProductTypeId = params["product-type-id"];
  const handleSelectProductType = (productTypeId: string) =>
    navigate(
      productAddUrl({
        ...params,
        "product-type-id": productTypeId,
      }),
    );
  const [openModal, closeModal] = createDialogActionHandlers<
    ProductCreateUrlDialog,
    ProductCreateUrlQueryParams
  >(navigate, params => productAddUrl(params), params);
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useCategorySearch({
    variables: {
      after: DEFAULT_INITIAL_SEARCH_DATA.after,
      first: DEFAULT_INITIAL_SEARCH_DATA.first,
      filter: undefined,
    },
  });
  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts,
  } = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreProductTypes,
    search: searchProductTypes,
    result: searchProductTypesOpts,
  } = useProductTypeSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreAttributeValues,
    search: searchAttributeValues,
    result: searchAttributeValuesOpts,
    reset: searchAttributeReset,
  } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const { taxClasses, fetchMoreTaxClasses } = useTaxClassFetchMore();
  const { data: selectedProductType } = useProductTypeQuery({
    variables: {
      id: selectedProductTypeId,
      firstValues: VALUES_PAGINATE_BY,
    },
    skip: !selectedProductTypeId,
  });
  const productTypes = mapEdgesToItems(searchProductTypesOpts?.data?.search) || [];
  const { availableChannels } = useAppChannel(false);
  const allChannels: ChannelData[] = createSortedChannelsData(availableChannels);
  const {
    channelListElements,
    channelsToggle,
    currentChannels,
    handleChannelsConfirm,
    handleChannelsModalClose,
    handleChannelsModalOpen,
    hasChannelSelectionChanged,
    isChannelSelected,
    isChannelsModalOpen,
    setCurrentChannels,
    toggleAllChannels,
  } = useChannels(
    allChannels,
    params?.action,
    {
      closeModal,
      openModal,
    },
    {
      formId: PRODUCT_CREATE_FORM_ID,
    },
  );

  const {
    loadMore: fetchMoreWarehouses,
    search: searchWarehouses,
    result: searchWarehousesResult,
  } = useWarehouseSearch({
    variables: {
      first: 50,
      channnelsId: [],
      query: "",
    },
    skip: !currentChannels.length,
  });

  const handleSuccess = (productId: string) => {
    notify({
      status: "success",
      text: intl.formatMessage({
        id: "DO8+uV",
        defaultMessage: "Product created",
      }),
    });
    navigate(productUrl(productId));
  };
  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});
  const [updateChannels, updateChannelsOpts] = useProductChannelListingUpdateMutation({});
  const [updateVariantChannels, updateVariantChannelsOpts] =
    useProductVariantChannelListingUpdateMutation({});
  const [productCreate, productCreateOpts] = useProductCreateMutation({});
  const [deleteProduct] = useProductDeleteMutation({});
  const [productVariantCreate, productVariantCreateOpts] = useVariantCreateMutation({
    onCompleted: data => {
      const errors = data.productVariantCreate.errors;

      if (errors.length) {
        errors.forEach(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl),
          }),
        );
      }
    },
  });
  const handleSubmit = async (data: ProductCreateData) => {
    setSubmitErrors([]);
    setSubmitChannelsErrors([]);

    const errors = await createMetadataCreateHandler(
      createHandler(
        selectedProductType?.productType,
        variables => uploadFile({ variables }),
        variables => productCreate({ variables }),
        variables => productVariantCreate({ variables }),
        updateChannels,
        updateVariantChannels,
        deleteProduct,
      ),
      updateMetadata,
      updatePrivateMetadata,
      productId => {
        markOnboardingStepAsCompleted("create-product");
        handleSuccess(productId);
      },
    )(data);

    if (errors?.length) {
      const { productErrors, channelsErrors } = splitProductSubmitErrors(errors);

      setSubmitErrors(productErrors);
      setSubmitChannelsErrors(channelsErrors);
    }

    return errors ?? [];
  };
  const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
    navigate(
      productAddUrl({
        ...params,
        action: "assign-attribute-value",
        id: attribute.id,
      }),
    );

  const refAttr =
    params.action === "assign-attribute-value" && params.id
      ? selectedProductType?.productType.productAttributes?.find(a => a.id === params.id)
      : undefined;

  // Extract productType and pageType constraints from reference attribute for modal filter
  const initialConstraints = useMemo(
    () => getReferenceTypeConstraints(refAttr?.referenceTypes),
    [refAttr?.referenceTypes],
  );
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
    loadMore: loadMoreReferenceCategories,
    search: searchReferenceCategories,
    result: searchReferenceCategoriesOpts,
  } = useReferenceCategorySearch(refAttr);

  const {
    loadMore: loadMoreReferenceCollections,
    search: searchReferenceCollections,
    result: searchReferenceCollectionsOpts,
  } = useReferenceCollectionSearch(refAttr);

  const onFilterChange = useAssignAttributeValueDialogFilterChangeHandlers({
    refetchProducts: searchProductsOpts.refetch,
    refetchPages: searchPagesOpts.refetch,
    refetchCategories: searchReferenceCategoriesOpts.refetch,
    refetchCollections: searchReferenceCollectionsOpts.refetch,
    referenceWhereConstraints: getReferenceWhereConstraints(initialConstraints),
  });

  const fetchMoreProductTypes = {
    hasMore: searchProductTypesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchProductTypesOpts.loading,
    onFetchMore: loadMoreProductTypes,
  };
  const fetchMoreCollections = {
    hasMore: searchCollectionsOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchCollectionsOpts.loading,
    onFetchMore: loadMoreCollections,
  };
  const fetchMoreCategories = {
    hasMore: searchCategoriesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchCategoriesOpts.loading,
    onFetchMore: loadMoreCategories,
  };
  const fetchMoreReferencePages = getSearchFetchMoreProps(searchPagesOpts, loadMorePages);
  const fetchMoreReferenceProducts = getSearchFetchMoreProps(searchProductsOpts, loadMoreProducts);
  const fetchMoreReferenceCategories = getSearchFetchMoreProps(
    searchReferenceCategoriesOpts,
    loadMoreReferenceCategories,
  );
  const fetchMoreReferenceCollections = getSearchFetchMoreProps(
    searchReferenceCollectionsOpts,
    loadMoreReferenceCollections,
  );
  const fetchMoreAttributeValues = {
    hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo?.hasNextPage,
    loading: !!searchAttributeValuesOpts.loading,
    onFetchMore: loadMoreAttributeValues,
  };
  const loading =
    uploadFileOpts.loading ||
    productCreateOpts.loading ||
    productVariantCreateOpts.loading ||
    updateChannelsOpts.loading ||
    updateVariantChannelsOpts.loading;
  const channelsErrors = submitChannelsErrors;
  const errors = submitErrors;

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "PXx4Jk",
          defaultMessage: "Create Product",
          description: "window title",
        })}
      />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            id: "Eau5AV",
            defaultMessage: "Manage Products Channel Availability",
          })}
          confirmButtonState="default"
          selected={channelListElements.length}
          hasSelectionChanged={hasChannelSelectionChanged}
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <ProductCreatePage
        allChannelsCount={allChannels?.length}
        currentChannels={currentChannels}
        categories={mapEdgesToItems(searchCategoriesOpts?.data?.search) || []}
        collections={mapEdgesToItems(searchCollectionsOpts?.data?.search) || []}
        attributeValues={mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute?.choices) ?? []}
        loading={loading}
        channelsErrors={channelsErrors}
        errors={errors}
        fetchCategories={searchCategories}
        fetchCollections={searchCollections}
        fetchProductTypes={searchProductTypes}
        fetchAttributeValues={searchAttributeValues}
        header={intl.formatMessage({
          id: "NBP8uu",
          defaultMessage: "New Product",
          description: "page header",
        })}
        productTypes={productTypes}
        onSubmit={handleSubmit}
        onWarehouseConfigure={() => navigate(warehouseAddPath)}
        saveButtonBarState={productCreateOpts.status}
        fetchMoreCategories={fetchMoreCategories}
        fetchMoreCollections={fetchMoreCollections}
        fetchMoreProductTypes={fetchMoreProductTypes}
        taxClasses={taxClasses ?? []}
        fetchMoreTaxClasses={fetchMoreTaxClasses}
        weightUnit={shop?.defaultWeightUnit}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        assignReferencesAttributeId={params.action === "assign-attribute-value" && params.id}
        onAssignReferencesClick={handleAssignAttributeReferenceClick}
        referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
        referenceProducts={mapEdgesToItems(searchProductsOpts?.data?.search) || []}
        referenceCategories={mapEdgesToItems(searchReferenceCategoriesOpts?.data?.search) || []}
        referenceCollections={mapEdgesToItems(searchReferenceCollectionsOpts?.data?.search) || []}
        fetchReferencePages={searchPages}
        fetchMoreReferencePages={fetchMoreReferencePages}
        fetchReferenceProducts={searchProducts}
        fetchMoreReferenceProducts={fetchMoreReferenceProducts}
        fetchReferenceCategories={searchReferenceCategories}
        fetchMoreReferenceCategories={fetchMoreReferenceCategories}
        fetchReferenceCollections={searchReferenceCollections}
        fetchMoreReferenceCollections={fetchMoreReferenceCollections}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onCloseDialog={currentParams => navigate(productAddUrl(currentParams))}
        selectedProductType={selectedProductType?.productType}
        onSelectProductType={handleSelectProductType}
        onAttributeSelectBlur={searchAttributeReset}
        fetchMoreWarehouses={fetchMoreWarehouses}
        searchWarehousesResult={searchWarehousesResult}
        searchWarehouses={searchWarehouses}
        onFilterChange={onFilterChange}
        initialConstraints={initialConstraints}
      />
    </>
  );
};

export default ProductCreateView;
