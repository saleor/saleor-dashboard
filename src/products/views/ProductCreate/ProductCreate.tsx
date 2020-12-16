import { useChannelsList } from "@saleor/channels/queries";
import { ChannelsAction } from "@saleor/channels/urls";
import { ChannelData, createSortedChannelsData } from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { useFileUploadMutation } from "@saleor/files/mutations";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import ProductCreatePage from "@saleor/products/components/ProductCreatePage";
import {
  useProductChannelListingUpdate,
  useProductDeleteMutation,
  useProductVariantChannelListingUpdate,
  useVariantCreateMutation
} from "@saleor/products/mutations";
import { useProductCreateMutation } from "@saleor/products/mutations";
import {
  productAddUrl,
  ProductCreateUrlQueryParams,
  productListUrl,
  productUrl
} from "@saleor/products/urls";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import useProductTypeSearch from "@saleor/searches/useProductTypeSearch";
import { useTaxTypeList } from "@saleor/taxes/queries";
import { getProductErrorMessage } from "@saleor/utils/errors";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import { useWarehouseList } from "@saleor/warehouses/queries";
import { warehouseAddPath } from "@saleor/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

import { createHandler } from "./handlers";

interface ProductCreateProps {
  params: ProductCreateUrlQueryParams;
}

export const ProductCreateView: React.FC<ProductCreateProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const [productCreateComplete, setProductCreateComplete] = React.useState(
    false
  );

  const [openModal, closeModal] = createDialogActionHandlers<
    ChannelsAction,
    ProductCreateUrlQueryParams
  >(navigate, params => productAddUrl(params), params);

  const {
    loadMore: loadMoreCategories,
    search: searchCategory,
    result: searchCategoryOpts
  } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const {
    loadMore: loadMoreCollections,
    search: searchCollection,
    result: searchCollectionOpts
  } = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const {
    loadMore: loadMoreProductTypes,
    search: searchProductTypes,
    result: searchProductTypesOpts
  } = useProductTypeSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const warehouses = useWarehouseList({
    displayLoader: true,
    variables: {
      first: 50
    }
  });
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});
  const taxTypes = useTaxTypeList({});

  const productTypes = searchProductTypesOpts?.data?.search?.edges?.map(
    edge => edge.node
  );

  const { data: channelsData } = useChannelsList({});
  const allChannels: ChannelData[] = createSortedChannelsData(
    channelsData?.channels
  );

  const {
    channelListElements,
    channelsToggle,
    currentChannels,
    handleChannelsConfirm,
    handleChannelsModalClose,
    handleChannelsModalOpen,
    isChannelSelected,
    isChannelsModalOpen,
    setCurrentChannels,
    toggleAllChannels
  } = useChannels(allChannels, params?.action, {
    closeModal,
    openModal
  });

  const handleSuccess = (productId: string) => {
    notify({
      status: "success",
      text: intl.formatMessage({
        defaultMessage: "Product created"
      })
    });
    navigate(productUrl(productId));
  };

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const [updateChannels, updateChannelsOpts] = useProductChannelListingUpdate(
    {}
  );
  const [
    updateVariantChannels,
    updateVariantChannelsOpts
  ] = useProductVariantChannelListingUpdate({});

  const handleBack = () => navigate(productListUrl());

  const [productCreate, productCreateOpts] = useProductCreateMutation({});
  const [deleteProduct] = useProductDeleteMutation({});
  const [
    productVariantCreate,
    productVariantCreateOpts
  ] = useVariantCreateMutation({
    onCompleted: data => {
      const errors = data.productVariantCreate.errors;
      if (errors.length) {
        errors.map(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl)
          })
        );
      }
    }
  });

  const handleSubmit = async data => {
    const result = await createMetadataCreateHandler(
      createHandler(
        productTypes,
        variables => uploadFile({ variables }),
        variables => productCreate({ variables }),
        variables => productVariantCreate({ variables }),
        updateChannels,
        updateVariantChannels,
        deleteProduct
      ),
      updateMetadata,
      updatePrivateMetadata
    )(data);

    if (result) {
      setProductCreateComplete(true);
    }
  };

  React.useEffect(() => {
    const productId = productCreateOpts.data?.productCreate?.product?.id;

    if (productCreateComplete && productId) {
      handleSuccess(productId);
    }
  }, [productCreateComplete]);

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          defaultMessage: "Create Product",
          description: "window title"
        })}
      />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          disabled={!channelListElements.length}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            defaultMessage: "Manage Products Channel Availability"
          })}
          confirmButtonState="default"
          selected={channelListElements.length}
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <ProductCreatePage
        allChannelsCount={allChannels?.length}
        currentChannels={currentChannels}
        categories={(searchCategoryOpts?.data?.search?.edges || []).map(
          edge => edge.node
        )}
        collections={(searchCollectionOpts?.data?.search?.edges || []).map(
          edge => edge.node
        )}
        loading={
          uploadFileOpts.loading ||
          productCreateOpts.loading ||
          productVariantCreateOpts.loading ||
          updateChannelsOpts.loading ||
          updateVariantChannelsOpts.loading
        }
        channelsErrors={
          updateVariantChannelsOpts.data?.productVariantChannelListingUpdate
            ?.errors
        }
        errors={[
          ...(productCreateOpts.data?.productCreate.errors || []),
          ...(productVariantCreateOpts.data?.productVariantCreate.errors || [])
        ]}
        fetchCategories={searchCategory}
        fetchCollections={searchCollection}
        fetchProductTypes={searchProductTypes}
        header={intl.formatMessage({
          defaultMessage: "New Product",
          description: "page header"
        })}
        productTypes={productTypes}
        onBack={handleBack}
        onSubmit={handleSubmit}
        onWarehouseConfigure={() => navigate(warehouseAddPath)}
        saveButtonBarState={productCreateOpts.status}
        fetchMoreCategories={{
          hasMore: searchCategoryOpts.data?.search.pageInfo.hasNextPage,
          loading: searchCategoryOpts.loading,
          onFetchMore: loadMoreCategories
        }}
        fetchMoreCollections={{
          hasMore: searchCollectionOpts.data?.search.pageInfo.hasNextPage,
          loading: searchCollectionOpts.loading,
          onFetchMore: loadMoreCollections
        }}
        fetchMoreProductTypes={{
          hasMore: searchProductTypesOpts.data?.search.pageInfo.hasNextPage,
          loading: searchProductTypesOpts.loading,
          onFetchMore: loadMoreProductTypes
        }}
        warehouses={
          warehouses.data?.warehouses.edges.map(edge => edge.node) || []
        }
        taxTypes={taxTypes.data?.taxTypes || []}
        weightUnit={shop?.defaultWeightUnit}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
      />
    </>
  );
};
export default ProductCreateView;
