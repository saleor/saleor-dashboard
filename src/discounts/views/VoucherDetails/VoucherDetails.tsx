// @ts-strict-ignore
import {
  ChannelVoucherData,
  createChannelsDataWithDiscountPrice,
  createSortedChannelsDataFromVoucher,
} from "@dashboard/channels/utils";
import ActionDialog from "@dashboard/components/ActionDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import AssignCategoriesDialog from "@dashboard/components/AssignCategoryDialog";
import AssignCollectionDialog from "@dashboard/components/AssignCollectionDialog";
import AssignProductDialog from "@dashboard/components/AssignProductDialog";
import { Button } from "@dashboard/components/Button";
import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, PAGINATE_BY } from "@dashboard/config";
import DiscountCountrySelectDialog from "@dashboard/discounts/components/DiscountCountrySelectDialog";
import VoucherDetailsPage, {
  VoucherDetailsPageTab,
  VoucherTabItemsCount,
} from "@dashboard/discounts/components/VoucherDetailsPage";
import {
  voucherListUrl,
  voucherUrl,
  VoucherUrlDialog,
  VoucherUrlQueryParams,
} from "@dashboard/discounts/urls";
import {
  getFilteredCategories,
  getFilteredCollections,
  getFilteredProducts,
} from "@dashboard/discounts/utils";
import {
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
  useVoucherCataloguesAddMutation,
  useVoucherCataloguesRemoveMutation,
  useVoucherChannelListingUpdateMutation,
  useVoucherDeleteMutation,
  useVoucherDetailsQuery,
  useVoucherUpdateMutation,
  VoucherDetailsQueryVariables,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useChannels from "@dashboard/hooks/useChannels";
import useLocalPaginator, {
  useSectionLocalPaginationState,
} from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages, sectionNames } from "@dashboard/intl";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import React, { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { createUpdateHandler } from "./handlers";
import { useVoucherCodes } from "./hooks/useVoucherCodes";
import { VOUCHER_UPDATE_FORM_ID } from "./types";

interface VoucherDetailsProps {
  id: string;
  params: VoucherUrlQueryParams;
}

const VoucherDetails: React.FC<VoucherDetailsProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
  const intl = useIntl();
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
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts,
  } = useProductSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [activeTab, setActiveTab] = useState<VoucherDetailsPageTab>(
    VoucherDetailsPageTab.categories,
  );
  const [paginationState, setPaginationState] = useSectionLocalPaginationState(
    PAGINATE_BY,
    activeTab,
  );
  const paginate = useLocalPaginator(setPaginationState);
  const changeTab = (tab: VoucherDetailsPageTab) => {
    reset();
    setActiveTab(tab);
  };
  const detailsQueryInclude: Pick<
    VoucherDetailsQueryVariables,
    "includeCategories" | "includeCollections" | "includeProducts"
  > = {
    includeCategories: activeTab === VoucherDetailsPageTab.categories,
    includeCollections: activeTab === VoucherDetailsPageTab.collections,
    includeProducts: activeTab === VoucherDetailsPageTab.products,
  };
  const { data, loading, refetch } = useVoucherDetailsQuery({
    displayLoader: true,
    variables: {
      id,
      ...paginationState,
      ...detailsQueryInclude,
    },
  });
  const {
    voucherCodes,
    voucherCodesLoading,
    voucherCodesPagination,
    voucherCodesSettings,
    selectedVoucherCodesIds,
    addedVoucherCodes,
    voucherCodesRefetch,
    handleSetSelectedVoucherCodesIds,
    updateVoucherCodesListSettings,
    handleAddVoucherCode,
    handleGenerateMultipleCodes,
    handleDeleteVoucherCodes,
    handleClearAddedVoucherCodes,
  } = useVoucherCodes({ id });
  const [openModal, closeModal] = createDialogActionHandlers<
    VoucherUrlDialog,
    VoucherUrlQueryParams
  >(navigate, params => voucherUrl(id, params), params);
  const { channel, availableChannels } = useAppChannel(false);
  const allChannels: ChannelVoucherData[] = createChannelsDataWithDiscountPrice(
    data?.voucher,
    availableChannels,
  );
  const voucherChannelsChoices: ChannelVoucherData[] = useMemo(
    () => createSortedChannelsDataFromVoucher(data?.voucher),
    [data?.voucher],
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
    toggleAllChannels,
  } = useChannels(
    voucherChannelsChoices,
    params?.action,
    {
      closeModal,
      openModal,
    },
    { formId: VOUCHER_UPDATE_FORM_ID },
  );
  const [updateChannels, updateChannelsOpts] = useVoucherChannelListingUpdateMutation({});
  const notifySaved = () =>
    notify({
      status: "success",
      text: intl.formatMessage(commonMessages.savedChanges),
    });
  const [voucherUpdate, voucherUpdateOpts] = useVoucherUpdateMutation({
    onCompleted: data => {
      if (data.voucherUpdate.errors.length === 0) {
        closeModal();
        notifySaved();
        handleClearAddedVoucherCodes();
        voucherCodesRefetch();
      }
    },
  });
  const [voucherDelete, voucherDeleteOpts] = useVoucherDeleteMutation({
    onCompleted: data => {
      if (data.voucherDelete.errors.length === 0) {
        notifySaved();
        navigate(voucherListUrl(), { replace: true });
      }
    },
  });
  const [voucherCataloguesRemove, voucherCataloguesRemoveOpts] = useVoucherCataloguesRemoveMutation(
    {
      onCompleted: data => {
        if (data.voucherCataloguesRemove.errors.length === 0) {
          notifySaved();
          closeModal();
          reset();
          refetch();
        }
      },
    },
  );
  const [voucherCataloguesAdd, voucherCataloguesAddOpts] = useVoucherCataloguesAddMutation({
    onCompleted: data => {
      if (data.voucherCataloguesAdd.errors.length === 0) {
        notifySaved();
        closeModal();
        reset();
        refetch();
      }
    },
  });
  const canOpenBulkActionDialog = maybe(() => params.ids.length > 0);
  const handleUpdate = createUpdateHandler(
    data?.voucher,
    voucherChannelsChoices,
    variables => voucherUpdate({ variables }),
    updateChannels,
  );
  const handleSubmit = createMetadataUpdateHandler(
    data?.voucher,
    handleUpdate,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );
  const tabPageInfo =
    activeTab === VoucherDetailsPageTab.categories
      ? maybe(() => data.voucher.categories.pageInfo)
      : activeTab === VoucherDetailsPageTab.collections
        ? maybe(() => data.voucher.collections.pageInfo)
        : maybe(() => data.voucher.products.pageInfo);
  const handleCategoriesUnassign = (ids: string[]) =>
    voucherCataloguesRemove({
      variables: {
        ...paginationState,
        ...detailsQueryInclude,
        id,
        input: {
          categories: ids,
        },
      },
    });
  const handleCollectionsUnassign = (ids: string[]) =>
    voucherCataloguesRemove({
      variables: {
        ...paginationState,
        ...detailsQueryInclude,
        id,
        input: {
          collections: ids,
        },
      },
    });
  const handleProductsUnassign = (ids: string[]) =>
    voucherCataloguesRemove({
      variables: {
        ...paginationState,
        ...detailsQueryInclude,
        id,
        input: {
          products: ids,
        },
      },
    });
  const { pageInfo, ...paginationValues } = paginate(tabPageInfo, paginationState);
  const tabItemsCount: VoucherTabItemsCount = {
    categories: data?.voucher?.categoriesCount?.totalCount,
    collections: data?.voucher?.collectionsCount?.totalCount,
    products: data?.voucher?.productsCount?.totalCount,
  };

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
      <WindowTitle title={intl.formatMessage(sectionNames.vouchers)} />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          disabled={false}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            id: "EM730i",
            defaultMessage: "Manage Channel Availability",
          })}
          selected={channelListElements.length}
          confirmButtonState="default"
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <VoucherDetailsPage
        voucher={data?.voucher}
        voucherCodes={voucherCodes}
        addedVoucherCodes={addedVoucherCodes}
        voucherCodesPagination={voucherCodesPagination}
        voucherCodesLoading={voucherCodesLoading}
        voucherCodesSettings={voucherCodesSettings}
        onDeleteVoucherCodes={handleDeleteVoucherCodes}
        onMultipleVoucheCodesGenerate={handleGenerateMultipleCodes}
        onCustomVoucherCodeGenerate={handleAddVoucherCode}
        onVoucherCodesSettingsChange={updateVoucherCodesListSettings}
        onSelectVoucherCodesIds={handleSetSelectedVoucherCodesIds}
        selectedVoucherCodesIds={selectedVoucherCodesIds}
        allChannelsCount={allChannels?.length}
        channelListings={currentChannels}
        disabled={loading || voucherCataloguesRemoveOpts.loading || updateChannelsOpts.loading}
        errors={[
          ...(voucherUpdateOpts.data?.voucherUpdate.errors || []),
          ...(updateChannelsOpts.data?.voucherChannelListingUpdate.errors || []),
        ]}
        selectedChannelId={channel?.id}
        onCategoryAssign={() => openModal("assign-category")}
        onCollectionAssign={() => openModal("assign-collection")}
        onCollectionUnassign={collectionId =>
          openModal("unassign-collection", {
            ids: [collectionId],
          })
        }
        onCountryAssign={() => openModal("assign-country")}
        onCountryUnassign={countryCode =>
          voucherUpdate({
            variables: {
              ...paginationState,
              id,
              input: {
                countries: data.voucher.countries
                  .filter(country => country.code !== countryCode)
                  .map(country => country.code),
              },
            },
          })
        }
        onCategoryUnassign={categoryId =>
          openModal("unassign-category", {
            ids: [categoryId],
          })
        }
        onProductAssign={() => openModal("assign-product")}
        onProductUnassign={productId =>
          openModal("unassign-product", {
            ids: [productId],
          })
        }
        activeTab={activeTab}
        tabItemsCount={tabItemsCount}
        onTabClick={changeTab}
        onSubmit={handleSubmit}
        onRemove={() => openModal("remove")}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        saveButtonBarState={voucherUpdateOpts.status}
        categoryListToolbar={
          <Button
            onClick={() =>
              openModal("unassign-category", {
                ids: listElements,
              })
            }
          >
            <FormattedMessage id="Gkip05" defaultMessage="Unassign" description="button" />
          </Button>
        }
        collectionListToolbar={
          <Button
            onClick={() =>
              openModal("unassign-collection", {
                ids: listElements,
              })
            }
          >
            <FormattedMessage id="Gkip05" defaultMessage="Unassign" description="button" />
          </Button>
        }
        productListToolbar={
          <Button
            onClick={() =>
              openModal("unassign-product", {
                ids: listElements,
              })
            }
          >
            <FormattedMessage id="Gkip05" defaultMessage="Unassign" description="button" />
          </Button>
        }
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
      />
      <AssignCategoriesDialog
        categories={getFilteredCategories(data, searchCategoriesOpts)}
        confirmButtonState={voucherCataloguesAddOpts.status}
        hasMore={searchCategoriesOpts.data?.search.pageInfo.hasNextPage}
        open={params.action === "assign-category"}
        onFetch={searchCategories}
        onFetchMore={loadMoreCategories}
        loading={searchCategoriesOpts.loading}
        onClose={closeModal}
        onSubmit={categories =>
          voucherCataloguesAdd({
            variables: {
              ...paginationState,
              ...detailsQueryInclude,
              id,
              input: {
                categories: categories.map(category => category.id),
              },
            },
          })
        }
      />
      <AssignCollectionDialog
        collections={getFilteredCollections(data, searchCollectionsOpts)}
        confirmButtonState={voucherCataloguesAddOpts.status}
        hasMore={searchCollectionsOpts.data?.search.pageInfo.hasNextPage}
        open={params.action === "assign-collection"}
        onFetch={searchCollections}
        onFetchMore={loadMoreCollections}
        loading={searchCollectionsOpts.loading}
        onClose={closeModal}
        onSubmit={collections =>
          voucherCataloguesAdd({
            variables: {
              ...paginationState,
              ...detailsQueryInclude,
              id,
              input: {
                collections: collections.map(collection => collection.id),
              },
            },
          })
        }
      />
      <DiscountCountrySelectDialog
        confirmButtonState={voucherUpdateOpts.status}
        countries={maybe(() => shop.countries, [])}
        onClose={() => navigate(voucherUrl(id))}
        onConfirm={formData =>
          voucherUpdate({
            variables: {
              id,
              input: {
                countries: formData.countries,
              },
            },
          })
        }
        open={params.action === "assign-country"}
        initial={maybe(() => data.voucher.countries.map(country => country.code), [])}
      />
      <AssignProductDialog
        selectedChannels={currentChannels}
        productUnavailableText={intl.formatMessage({
          id: "XOkUxQ",
          defaultMessage: "Product unavailable in voucher channels",
        })}
        confirmButtonState={voucherCataloguesAddOpts.status}
        hasMore={searchProductsOpts.data?.search.pageInfo.hasNextPage}
        open={params.action === "assign-product"}
        onFetch={searchProducts}
        onFetchMore={loadMoreProducts}
        loading={searchProductsOpts.loading}
        onClose={closeModal}
        onSubmit={products =>
          voucherCataloguesAdd({
            variables: {
              ...paginationState,
              ...detailsQueryInclude,
              id,
              input: {
                products: products.map(product => product.id),
              },
            },
          })
        }
        products={getFilteredProducts(data, searchProductsOpts)}
      />
      <ActionDialog
        open={params.action === "unassign-category" && canOpenBulkActionDialog}
        title={intl.formatMessage({
          id: "LOSNq0",
          defaultMessage: "Unassign Categories From Voucher",
          description: "dialog header",
        })}
        confirmButtonState={voucherCataloguesRemoveOpts.status}
        onClose={closeModal}
        onConfirm={() => handleCategoriesUnassign(params.ids)}
        confirmButtonLabel={intl.formatMessage({
          id: "cNSLLO",
          defaultMessage: "Unassign and save",
          description: "button",
        })}
      >
        {canOpenBulkActionDialog && (
          <FormattedMessage
            id="GiJm1v"
            defaultMessage="{counter,plural,one{Are you sure you want to unassign this category?} other{Are you sure you want to unassign {displayQuantity} categories?}}"
            description="dialog content"
            values={{
              counter: params.ids.length,
              displayQuantity: <strong>{params.ids.length}</strong>,
            }}
          />
        )}
      </ActionDialog>
      <ActionDialog
        open={params.action === "unassign-collection" && canOpenBulkActionDialog}
        title={intl.formatMessage({
          id: "MmGlkp",
          defaultMessage: "Unassign Collections From Voucher",
          description: "dialog header",
        })}
        confirmButtonState={voucherCataloguesRemoveOpts.status}
        onClose={closeModal}
        onConfirm={() => handleCollectionsUnassign(params.ids)}
        confirmButtonLabel={intl.formatMessage({
          id: "cNSLLO",
          defaultMessage: "Unassign and save",
          description: "button",
        })}
      >
        {canOpenBulkActionDialog && (
          <FormattedMessage
            id="UjoSZB"
            defaultMessage="{counter,plural,one{Are you sure you want to unassign this collection?} other{Are you sure you want to unassign {displayQuantity} collections?}}"
            description="dialog content"
            values={{
              counter: params.ids.length,
              displayQuantity: <strong>{params.ids.length}</strong>,
            }}
          />
        )}
      </ActionDialog>
      <ActionDialog
        open={params.action === "unassign-product" && canOpenBulkActionDialog}
        title={intl.formatMessage({
          id: "cKCfSW",
          defaultMessage: "Unassign Products From Voucher",
          description: "dialog header",
        })}
        confirmButtonState={voucherCataloguesRemoveOpts.status}
        onClose={closeModal}
        onConfirm={() => handleProductsUnassign(params.ids)}
        confirmButtonLabel={intl.formatMessage({
          id: "cNSLLO",
          defaultMessage: "Unassign and save",
          description: "button",
        })}
      >
        {canOpenBulkActionDialog && (
          <FormattedMessage
            id="AHK0K9"
            defaultMessage="{counter,plural,one{Are you sure you want to unassign this product?} other{Are you sure you want to unassign {displayQuantity} products?}}"
            description="dialog content"
            values={{
              counter: params.ids.length,
              displayQuantity: <strong>{params.ids.length}</strong>,
            }}
          />
        )}
      </ActionDialog>
      <ActionDialog
        open={params.action === "remove"}
        title={intl.formatMessage({
          id: "Hgz44z",
          defaultMessage: "Delete Voucher",
          description: "dialog header",
        })}
        confirmButtonState={voucherDeleteOpts.status}
        onClose={closeModal}
        variant="delete"
        onConfirm={() =>
          voucherDelete({
            variables: { id },
          })
        }
      >
        <FormattedMessage
          id="NEJo1I"
          defaultMessage="Are you sure you want to delete {voucherCode}?"
          description="dialog content"
          values={{
            voucherCode: <strong>{maybe(() => data.voucher.name, "...")}</strong>,
          }}
        />
      </ActionDialog>
    </PaginatorContext.Provider>
  );
};

export default VoucherDetails;
