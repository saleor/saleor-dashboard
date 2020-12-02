import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import { categoryUrl } from "@saleor/categories/urls";
import { useChannelsList } from "@saleor/channels/queries";
import {
  ChannelSaleData,
  createChannelsDataWithSaleDiscountPrice,
  createSortedChannelsDataFromSale
} from "@saleor/channels/utils";
import { collectionUrl } from "@saleor/collections/urls";
import ActionDialog from "@saleor/components/ActionDialog";
import AssignCategoriesDialog from "@saleor/components/AssignCategoryDialog";
import AssignCollectionDialog from "@saleor/components/AssignCollectionDialog";
import AssignProductDialog from "@saleor/components/AssignProductDialog";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, PAGINATE_BY } from "@saleor/config";
import SaleDetailsPage, {
  SaleDetailsPageTab
} from "@saleor/discounts/components/SaleDetailsPage";
import {
  TypedSaleCataloguesAdd,
  TypedSaleCataloguesRemove,
  TypedSaleDelete,
  TypedSaleUpdate,
  useSaleChannelListingUpdate
} from "@saleor/discounts/mutations";
import { useSaleDetails } from "@saleor/discounts/queries";
import { SaleCataloguesAdd } from "@saleor/discounts/types/SaleCataloguesAdd";
import { SaleCataloguesRemove } from "@saleor/discounts/types/SaleCataloguesRemove";
import { SaleDelete } from "@saleor/discounts/types/SaleDelete";
import { SaleUpdate } from "@saleor/discounts/types/SaleUpdate";
import {
  saleListUrl,
  saleUrl,
  SaleUrlDialog,
  SaleUrlQueryParams
} from "@saleor/discounts/urls";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useChannels from "@saleor/hooks/useChannels";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages, sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { productUrl } from "@saleor/products/urls";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import useProductSearch from "@saleor/searches/useProductSearch";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { createUpdateHandler } from "./handlers";

interface SaleDetailsProps {
  id: string;
  params: SaleUrlQueryParams;
}

export const SaleDetails: React.FC<SaleDetailsProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const notify = useNotifier();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const intl = useIntl();
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts
  } = useCategorySearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts
  } = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });
  const {
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts
  } = useProductSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const { data: channelsData } = useChannelsList({});

  const paginationState = createPaginationState(PAGINATE_BY, params);
  const changeTab = (tab: SaleDetailsPageTab) => {
    reset();
    navigate(
      saleUrl(id, {
        activeTab: tab
      })
    );
  };

  const { data, loading } = useSaleDetails({
    displayLoader: true,
    variables: {
      id,
      ...paginationState
    }
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    SaleUrlDialog,
    SaleUrlQueryParams
  >(navigate, params => saleUrl(id, params), params);

  const allChannels: ChannelSaleData[] = createChannelsDataWithSaleDiscountPrice(
    data?.sale,
    channelsData?.channels
  );
  const saleChannelsChoices: ChannelSaleData[] = createSortedChannelsDataFromSale(
    data?.sale
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
  } = useChannels(saleChannelsChoices, params?.action, {
    closeModal,
    openModal
  });

  const [updateChannels, updateChannelsOpts] = useSaleChannelListingUpdate({});

  const [selectedChannel] = useLocalStorage("salesListChannel", "");

  const handleSaleDelete = (data: SaleDelete) => {
    if (data.saleDelete.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Removed sale"
        })
      });
      navigate(saleListUrl(), true);
    }
  };

  const handleSaleUpdate = (data: SaleUpdate) => {
    if (data.saleUpdate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
    }
  };

  const handleCatalogueAdd = (data: SaleCataloguesAdd) => {
    if (data.saleCataloguesAdd.errors.length === 0) {
      closeModal();
    }
  };

  const handleCatalogueRemove = (data: SaleCataloguesRemove) => {
    if (data.saleCataloguesRemove.errors.length === 0) {
      closeModal();
      reset();
    }
  };

  const canOpenBulkActionDialog = maybe(() => params.ids.length > 0);

  return (
    <>
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          disabled={!channelListElements.length}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            defaultMessage: "Manage Channel Availability"
          })}
          selected={channelListElements.length}
          confirmButtonState="default"
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <TypedSaleCataloguesRemove onCompleted={handleCatalogueRemove}>
        {(saleCataloguesRemove, saleCataloguesRemoveOpts) => (
          <TypedSaleCataloguesAdd onCompleted={handleCatalogueAdd}>
            {(saleCataloguesAdd, saleCataloguesAddOpts) => (
              <TypedSaleUpdate onCompleted={handleSaleUpdate}>
                {(saleUpdate, saleUpdateOpts) => (
                  <TypedSaleDelete onCompleted={handleSaleDelete}>
                    {(saleDelete, saleDeleteOpts) => {
                      const tabPageInfo =
                        params.activeTab === SaleDetailsPageTab.categories
                          ? maybe(() => data.sale.categories.pageInfo)
                          : params.activeTab === SaleDetailsPageTab.collections
                          ? maybe(() => data.sale.collections.pageInfo)
                          : maybe(() => data.sale.products.pageInfo);

                      const handleCategoriesUnassign = (ids: string[]) =>
                        saleCataloguesRemove({
                          variables: {
                            ...paginationState,
                            id,
                            input: {
                              categories: ids
                            }
                          }
                        });

                      const handleCollectionsUnassign = (ids: string[]) =>
                        saleCataloguesRemove({
                          variables: {
                            ...paginationState,
                            id,
                            input: {
                              collections: ids
                            }
                          }
                        });

                      const handleProductsUnassign = (ids: string[]) =>
                        saleCataloguesRemove({
                          variables: {
                            ...paginationState,
                            id,
                            input: {
                              products: ids
                            }
                          }
                        });

                      const {
                        loadNextPage,
                        loadPreviousPage,
                        pageInfo
                      } = paginate(tabPageInfo, paginationState, params);

                      const handleSubmit = createUpdateHandler(
                        data?.sale,
                        saleChannelsChoices,
                        variables => saleUpdate({ variables }),
                        updateChannels
                      );
                      return (
                        <>
                          <WindowTitle
                            title={intl.formatMessage(sectionNames.sales)}
                          />
                          <SaleDetailsPage
                            sale={maybe(() => data.sale)}
                            allChannelsCount={allChannels?.length}
                            channelListings={currentChannels}
                            hasChannelChanged={
                              saleChannelsChoices?.length !==
                              currentChannels?.length
                            }
                            disabled={
                              loading ||
                              saleCataloguesRemoveOpts.loading ||
                              updateChannelsOpts.loading
                            }
                            errors={[
                              ...(saleUpdateOpts.data?.saleUpdate.errors || []),
                              ...(updateChannelsOpts.data
                                ?.saleChannelListingUpdate.errors || [])
                            ]}
                            selectedChannelId={selectedChannel}
                            pageInfo={pageInfo}
                            openChannelsModal={handleChannelsModalOpen}
                            onChannelsChange={setCurrentChannels}
                            onNextPage={loadNextPage}
                            onPreviousPage={loadPreviousPage}
                            onCategoryAssign={() =>
                              openModal("assign-category")
                            }
                            onCategoryClick={id => () =>
                              navigate(categoryUrl(id))}
                            onCollectionAssign={() =>
                              openModal("assign-collection")
                            }
                            onCollectionUnassign={collectionId =>
                              handleCollectionsUnassign([collectionId])
                            }
                            onCategoryUnassign={categoryId =>
                              handleCategoriesUnassign([categoryId])
                            }
                            onCollectionClick={id => () =>
                              navigate(collectionUrl(id))}
                            onProductAssign={() => openModal("assign-product")}
                            onProductUnassign={productId =>
                              handleProductsUnassign([productId])
                            }
                            onProductClick={id => () =>
                              navigate(productUrl(id))}
                            activeTab={params.activeTab}
                            onBack={() => navigate(saleListUrl())}
                            onTabClick={changeTab}
                            onSubmit={handleSubmit}
                            onRemove={() => openModal("remove")}
                            saveButtonBarState={saleUpdateOpts.status}
                            categoryListToolbar={
                              <Button
                                color="primary"
                                onClick={() =>
                                  openModal("unassign-category", {
                                    ids: listElements
                                  })
                                }
                              >
                                <FormattedMessage
                                  defaultMessage="Unassign"
                                  description="unassign category from sale, button"
                                  id="saleDetailsUnassignCategory"
                                />
                              </Button>
                            }
                            collectionListToolbar={
                              <Button
                                color="primary"
                                onClick={() =>
                                  openModal("unassign-collection", {
                                    ids: listElements
                                  })
                                }
                              >
                                <FormattedMessage
                                  defaultMessage="Unassign"
                                  description="unassign collection from sale, button"
                                  id="saleDetailsUnassignCollection"
                                />
                              </Button>
                            }
                            productListToolbar={
                              <Button
                                color="primary"
                                onClick={() =>
                                  openModal("unassign-product", {
                                    ids: listElements
                                  })
                                }
                              >
                                <FormattedMessage
                                  defaultMessage="Unassign"
                                  description="unassign product from sale, button"
                                  id="saleDetailsUnassignProduct"
                                />
                              </Button>
                            }
                            isChecked={isSelected}
                            selected={listElements.length}
                            toggle={toggle}
                            toggleAll={toggleAll}
                          />
                          <AssignProductDialog
                            confirmButtonState={saleCataloguesAddOpts.status}
                            hasMore={
                              searchProductsOpts.data?.search.pageInfo
                                .hasNextPage
                            }
                            open={params.action === "assign-product"}
                            onFetch={searchProducts}
                            onFetchMore={loadMoreProducts}
                            loading={searchProductsOpts.loading}
                            onClose={closeModal}
                            onSubmit={products =>
                              saleCataloguesAdd({
                                variables: {
                                  ...paginationState,
                                  id,
                                  input: {
                                    products: products.map(
                                      product => product.id
                                    )
                                  }
                                }
                              })
                            }
                            products={maybe(() =>
                              searchProductsOpts.data.search.edges
                                .map(edge => edge.node)
                                .filter(suggestedProduct => suggestedProduct.id)
                            )}
                          />
                          <AssignCategoriesDialog
                            categories={maybe(() =>
                              searchCategoriesOpts.data.search.edges
                                .map(edge => edge.node)
                                .filter(
                                  suggestedCategory => suggestedCategory.id
                                )
                            )}
                            confirmButtonState={saleCataloguesAddOpts.status}
                            hasMore={
                              searchCategoriesOpts.data?.search.pageInfo
                                .hasNextPage
                            }
                            open={params.action === "assign-category"}
                            onFetch={searchCategories}
                            onFetchMore={loadMoreCategories}
                            loading={searchCategoriesOpts.loading}
                            onClose={closeModal}
                            onSubmit={categories =>
                              saleCataloguesAdd({
                                variables: {
                                  ...paginationState,
                                  id,
                                  input: {
                                    categories
                                  }
                                }
                              })
                            }
                          />
                          <AssignCollectionDialog
                            collections={maybe(() =>
                              searchCollectionsOpts.data.search.edges
                                .map(edge => edge.node)
                                .filter(
                                  suggestedCategory => suggestedCategory.id
                                )
                            )}
                            confirmButtonState={saleCataloguesAddOpts.status}
                            hasMore={
                              searchCollectionsOpts.data?.search.pageInfo
                                .hasNextPage
                            }
                            open={params.action === "assign-collection"}
                            onFetch={searchCollections}
                            onFetchMore={loadMoreCollections}
                            loading={searchCollectionsOpts.loading}
                            onClose={closeModal}
                            onSubmit={collections =>
                              saleCataloguesAdd({
                                variables: {
                                  ...paginationState,
                                  id,
                                  input: {
                                    collections
                                  }
                                }
                              })
                            }
                          />
                          <ActionDialog
                            open={
                              params.action === "unassign-category" &&
                              canOpenBulkActionDialog
                            }
                            title={intl.formatMessage({
                              defaultMessage: "Unassign Categories From Sale",
                              description: "dialog header"
                            })}
                            confirmButtonState={saleCataloguesRemoveOpts.status}
                            onClose={closeModal}
                            onConfirm={() =>
                              handleCategoriesUnassign(params.ids)
                            }
                          >
                            {canOpenBulkActionDialog && (
                              <DialogContentText>
                                <FormattedMessage
                                  defaultMessage="{counter,plural,one{Are you sure you want to unassign this category?} other{Are you sure you want to unassign {displayQuantity} categories?}}"
                                  description="dialog content"
                                  values={{
                                    counter: params.ids.length,
                                    displayQuantity: (
                                      <strong>{params.ids.length}</strong>
                                    )
                                  }}
                                />
                              </DialogContentText>
                            )}
                          </ActionDialog>
                          <ActionDialog
                            open={
                              params.action === "unassign-collection" &&
                              canOpenBulkActionDialog
                            }
                            title={intl.formatMessage({
                              defaultMessage: "Unassign Collections From Sale",
                              description: "dialog header"
                            })}
                            confirmButtonState={saleCataloguesRemoveOpts.status}
                            onClose={closeModal}
                            onConfirm={() =>
                              handleCollectionsUnassign(params.ids)
                            }
                          >
                            {canOpenBulkActionDialog && (
                              <DialogContentText>
                                <FormattedMessage
                                  defaultMessage="{counter,plural,one{Are you sure you want to unassign this collection?} other{Are you sure you want to unassign {displayQuantity} collections?}}"
                                  description="dialog content"
                                  values={{
                                    counter: params.ids.length,
                                    displayQuantity: (
                                      <strong>{params.ids.length}</strong>
                                    )
                                  }}
                                />
                              </DialogContentText>
                            )}
                          </ActionDialog>
                          <ActionDialog
                            open={
                              params.action === "unassign-product" &&
                              canOpenBulkActionDialog
                            }
                            title={intl.formatMessage({
                              defaultMessage: "Unassign Products From Sale",
                              description: "dialog header"
                            })}
                            confirmButtonState={saleCataloguesRemoveOpts.status}
                            onClose={closeModal}
                            onConfirm={() => handleProductsUnassign(params.ids)}
                          >
                            {canOpenBulkActionDialog && (
                              <DialogContentText>
                                <FormattedMessage
                                  defaultMessage="{counter,plural,one{Are you sure you want to unassign this product?} other{Are you sure you want to unassign {displayQuantity} products?}}"
                                  description="dialog content"
                                  values={{
                                    counter: params.ids.length,
                                    displayQuantity: (
                                      <strong>{params.ids.length}</strong>
                                    )
                                  }}
                                />
                              </DialogContentText>
                            )}
                          </ActionDialog>
                          <ActionDialog
                            open={params.action === "remove"}
                            title={intl.formatMessage({
                              defaultMessage: "Delete Sale",
                              description: "dialog header"
                            })}
                            confirmButtonState={saleDeleteOpts.status}
                            onClose={closeModal}
                            variant="delete"
                            onConfirm={() =>
                              saleDelete({
                                variables: { id }
                              })
                            }
                          >
                            <DialogContentText>
                              <FormattedMessage
                                defaultMessage="Are you sure you want to delete {saleName}?"
                                description="dialog content"
                                values={{
                                  saleName: (
                                    <strong>
                                      {maybe(() => data.sale.name, "...")}
                                    </strong>
                                  )
                                }}
                              />
                            </DialogContentText>
                          </ActionDialog>
                        </>
                      );
                    }}
                  </TypedSaleDelete>
                )}
              </TypedSaleUpdate>
            )}
          </TypedSaleCataloguesAdd>
        )}
      </TypedSaleCataloguesRemove>
    </>
  );
};
export default SaleDetails;
