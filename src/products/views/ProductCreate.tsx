import { useChannelsList } from "@saleor/channels/queries";
import { ChannelData, createChannelsData } from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useListActions from "@saleor/hooks/useListActions";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { useProductChannelListingUpdate } from "@saleor/products/mutations";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import useProductTypeSearch from "@saleor/searches/useProductTypeSearch";
import { useTaxTypeList } from "@saleor/taxes/queries";
import getProductErrorMessage from "@saleor/utils/errors/product";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import { useWarehouseList } from "@saleor/warehouses/queries";
import { warehouseAddPath } from "@saleor/warehouses/urls";
import React from "react";
import { useIntl } from "react-intl";

import { decimal, weight } from "../../misc";
import ProductCreatePage from "../components/ProductCreatePage";
import { ProductCreateData } from "../components/ProductCreatePage/form";
import { useProductCreateMutation } from "../mutations";
import { ProductCreate } from "../types/ProductCreate";
import { productListUrl, productUrl } from "../urls";

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

  const { data: channelsData } = useChannelsList({});
  const allChannels: ChannelData[] = createChannelsData(channelsData?.channels);
  const [currentChannels, setCurrentChannels] = useStateFromProps(allChannels);

  const [updateChannels] = useProductChannelListingUpdate({
    onCompleted: data => {
      if (data.productChannelListingUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Channels updated"
          })
        });
        navigate(productUrl(data.productChannelListingUpdate.product.id));
      } else {
        data.productChannelListingUpdate.errors.map(error =>
          notify({
            status: "error",
            text: getProductErrorMessage(error, intl)
          })
        );
      }
    }
  });

  const {
    isSelected: isChannelSelected,
    listElements: channelListElements,
    set: setChannels,
    toggle: channelsToggle
  } = useListActions<ChannelData>(currentChannels, (a, b) => a.id === b.id);

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

  const handleSuccess = (data: ProductCreate, channelsData: ChannelData[]) => {
    if (data.productCreate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Product created"
        })
      });
      updateChannels({
        variables: {
          id: data.productCreate.product.id,
          input: {
            addChannels: channelsData.map(channel => ({
              channelId: channel.id,
              isPublished: channel.isPublished,
              publicationDate: channel.publicationDate
            }))
          }
        }
      });
    }
  };

  const [productCreate, productCreateOpts] = useProductCreateMutation({});

  const handleCreate = async (formData: ProductCreateData) => {
    const result = await productCreate({
      variables: {
        input: {
          attributes: formData.attributes.map(attribute => ({
            id: attribute.id,
            values: attribute.value
          })),
          basePrice: decimal(formData.basePrice),
          category: formData.category,
          chargeTaxes: formData.chargeTaxes,
          collections: formData.collections,
          descriptionJson: JSON.stringify(formData.description),
          name: formData.name,
          productType: formData.productType?.id,
          seo: {
            description: formData.seoDescription,
            title: formData.seoTitle
          },
          sku: formData.sku,
          slug: formData.slug,
          stocks: formData.stocks.map(stock => ({
            quantity: parseInt(stock.value, 0),
            warehouse: stock.id
          })),
          taxCode: formData.changeTaxCode ? formData.taxCode : undefined,
          trackInventory: formData.trackInventory,
          weight: weight(formData.weight)
        }
      }
    });

    const productId = result.data.productCreate?.product?.id;

    if (productId) {
      handleSuccess(result.data, formData.channelListing);
    }

    return productId || null;
  };

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
          onConfirm={handleChannelsConfirm}
        />
      )}
      <ProductCreatePage
        allChannelsCount={allChannels?.length}
        currentChannels={currentChannels}
        hasChannelChanged={allChannels?.length !== currentChannels?.length}
        currency={shop?.defaultCurrency}
        categories={
          searchCategoryOpts?.data?.search?.edges || [].map(edge => edge.node)
        }
        collections={
          searchCollectionOpts?.data?.search?.edges || [].map(edge => edge.node)
        }
        initial={{ channelListing: currentChannels || [] }}
        disabled={productCreateOpts.loading}
        errors={productCreateOpts.data?.productCreate.errors || []}
        fetchCategories={searchCategory}
        fetchCollections={searchCollection}
        fetchProductTypes={searchProductTypes}
        header={intl.formatMessage({
          defaultMessage: "New Product",
          description: "page header"
        })}
        productTypes={searchProductTypesOpts.data?.search.edges.map(
          edge => edge.node
        )}
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
      />
    </>
  );
};
export default ProductCreateView;
