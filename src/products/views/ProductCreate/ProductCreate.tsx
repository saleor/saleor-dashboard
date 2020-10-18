import { useChannelsList } from "@saleor/channels/queries";
import { ChannelData, createSortedChannelsData } from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useListActions from "@saleor/hooks/useListActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import ProductCreatePage from "@saleor/products/components/ProductCreatePage";
import {
  useProductChannelListingUpdate,
  useProductVariantChannelListingUpdate,
  useVariantCreateMutation
} from "@saleor/products/mutations";
import { useProductCreateMutation } from "@saleor/products/mutations";
import { productListUrl, productUrl } from "@saleor/products/urls";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import useProductTypeSearch from "@saleor/searches/useProductTypeSearch";
import { useTaxTypeList } from "@saleor/taxes/queries";
import { getProductErrorMessage } from "@saleor/utils/errors";
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

export const ProductCreateView: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
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
  const [currentChannels, setCurrentChannels] = useStateFromProps(allChannels);

  const handleSuccess = (productId: string) => {
    notify({
      status: "success",
      text: intl.formatMessage({
        defaultMessage: "Product created"
      })
    });
    navigate(productUrl(productId));
  };

  const [updateChannels, updateChannelsOpts] = useProductChannelListingUpdate({
    onCompleted: data => {
      const productId = data.productChannelListingUpdate.product.id;
      if (productId) {
        handleSuccess(productId);
      }
    }
  });
  const [
    updateVariantChannels,
    updateVariantChannelsOpts
  ] = useProductVariantChannelListingUpdate({});

  const {
    isSelected: isChannelSelected,
    listElements: channelListElements,
    set: setChannels,
    toggle: channelsToggle
  } = useListActions<ChannelData>(currentChannels, (a, b) => a.id === b.id);
  const toggleAllChannels = (items: ChannelData[], selected: number) => {
    if (selected !== items.length) {
      setChannels(items);
    } else {
      setChannels([]);
    }
  };

  const [isChannelsModalOpen, setChannelsModalOpen] = React.useState(false);

  const handleChannelsModalClose = () => {
    setChannelsModalOpen(false);
    setChannels(currentChannels);
  };

  const handleChannelsConfirm = () => {
    setCurrentChannels(channelListElements);
    setChannelsModalOpen(false);
  };

  const handleBack = () => navigate(productListUrl());

  const [productCreate, productCreateOpts] = useProductCreateMutation({});
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

  const handleCreate = createHandler(
    productTypes,
    variables => productCreate({ variables }),
    variables => productVariantCreate({ variables }),
    updateChannels,
    updateVariantChannels
  );

  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata
  );

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
        hasChannelChanged={allChannels?.length !== currentChannels?.length}
        currency={shop?.defaultCurrency}
        categories={(searchCategoryOpts?.data?.search?.edges || []).map(
          edge => edge.node
        )}
        collections={(searchCollectionOpts?.data?.search?.edges || []).map(
          edge => edge.node
        )}
        disabled={
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
        openChannelsModal={() => setChannelsModalOpen(true)}
        onChannelsChange={setCurrentChannels}
      />
    </>
  );
};
export default ProductCreateView;
