import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ActionDialog from "@saleor/components/ActionDialog";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData
} from "@saleor/components/SaveFilterTabDialog";
import {
  DEFAULT_INITIAL_PAGINATION_DATA,
  DEFAULT_INITIAL_SEARCH_DATA,
  defaultListSettings,
  ProductListColumns
} from "@saleor/config";
import { Task } from "@saleor/containers/BackgroundTasks/types";
import useBackgroundTask from "@saleor/hooks/useBackgroundTask";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import ProductExportDialog from "@saleor/products/components/ProductExportDialog";
import {
  getAttributeIdFromColumnValue,
  isAttributeColumnValue
} from "@saleor/products/components/ProductListPage/utils";
import {
  useAvailableInGridAttributesQuery,
  useCountAllProducts,
  useInitialProductFilterDataQuery,
  useProductListQuery
} from "@saleor/products/queries";
import { ProductListVariables } from "@saleor/products/types/ProductList";
import {
  productAddUrl,
  productListUrl,
  ProductListUrlDialog,
  ProductListUrlQueryParams,
  ProductListUrlSortField,
  productUrl
} from "@saleor/products/urls";
import useAttributeSearch from "@saleor/searches/useAttributeSearch";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import useProductTypeSearch from "@saleor/searches/useProductTypeSearch";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import { getSortUrlVariables } from "@saleor/utils/sort";
import { useWarehouseList } from "@saleor/warehouses/queries";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductListPage from "../../components/ProductListPage";
import {
  useProductBulkDeleteMutation,
  useProductExport
} from "../../mutations";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterOpts,
  getFilterQueryParam,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface ProductListProps {
  params: ProductListUrlQueryParams;
}

export const ProductList: React.FC<ProductListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { queue } = useBackgroundTask();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings<ProductListColumns>(
    ListViews.PRODUCT_LIST
  );
  const intl = useIntl();
  const { data: initialFilterData } = useInitialProductFilterDataQuery({
    variables: {
      categories: params.categories,
      collections: params.collections,
      productTypes: params.productTypes
    }
  });
  const searchCategories = useCategorySearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5
    }
  });
  const searchCollections = useCollectionSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5
    }
  });
  const searchProductTypes = useProductTypeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5
    }
  });
  const searchAttributes = useAttributeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 10
    }
  });
  const warehouses = useWarehouseList({
    variables: {
      first: 100
    }
  });
  const { availableChannels, channel } = useAppChannel();

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductListUrlDialog,
    ProductListUrlQueryParams
  >(navigate, productListUrl, params);

  // Reset pagination
  React.useEffect(
    () =>
      navigate(
        productListUrl({
          ...params,
          ...DEFAULT_INITIAL_PAGINATION_DATA
        }),
        true
      ),
    [settings.rowNumber]
  );

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const countAllProducts = useCountAllProducts({});

  const [exportProducts, exportProductsOpts] = useProductExport({
    onCompleted: data => {
      if (data.exportProducts.errors.length === 0) {
        notify({
          text: intl.formatMessage({
            defaultMessage:
              "We are currently exporting your requested CSV. As soon as it is available it will be sent to your email address"
          }),
          title: intl.formatMessage({
            defaultMessage: "Exporting CSV",
            description: "waiting for export to end, header"
          })
        });
        queue(Task.EXPORT, {
          id: data.exportProducts.exportFile.id
        });
        closeModal();
        reset();
      }
    }
  });

  const [
    changeFilters,
    resetFilters,
    handleSearchChange
  ] = createFilterHandlers({
    cleanupFn: reset,
    createUrl: productListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      productListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleFilterTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(productListUrl());
  };

  const handleFilterTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const handleSort = (field: ProductListUrlSortField, attributeId?: string) =>
    navigate(
      productListUrl({
        ...params,
        ...getSortUrlVariables(field, params),
        attributeId,
        ...DEFAULT_INITIAL_PAGINATION_DATA
      })
    );

  const paginationState = createPaginationState(settings.rowNumber, params);
  const filter = getFilterVariables(params, channel.slug);
  const sort = getSortQueryVariables(params, channel.slug);
  const queryVariables = React.useMemo<ProductListVariables>(
    () => ({
      ...paginationState,
      filter,
      sort
    }),
    [params, settings.rowNumber]
  );
  const { data, loading, refetch } = useProductListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  function filterColumnIds(columns: ProductListColumns[]) {
    return columns
      .filter(isAttributeColumnValue)
      .map(getAttributeIdFromColumnValue);
  }
  const attributes = useAvailableInGridAttributesQuery({
    variables: { first: 6, ids: filterColumnIds(settings.columns) }
  });

  const [
    productBulkDelete,
    productBulkDeleteOpts
  ] = useProductBulkDeleteMutation({
    onCompleted: data => {
      if (data.productBulkDelete.errors.length === 0) {
        closeModal();
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        reset();
        refetch();
      }
    }
  });

  const filterOpts = getFilterOpts(
    params,
    initialFilterData?.attributes?.edges?.map(edge => edge.node) || [],
    {
      initial:
        initialFilterData?.categories?.edges?.map(edge => edge.node) || [],
      search: searchCategories
    },
    {
      initial:
        initialFilterData?.collections?.edges?.map(edge => edge.node) || [],
      search: searchCollections
    },
    {
      initial:
        initialFilterData?.productTypes?.edges?.map(edge => edge.node) || [],
      search: searchProductTypes
    }
  );

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    data?.products?.pageInfo,
    paginationState,
    params
  );

  return (
    <>
      <ProductListPage
        activeAttributeSortId={params.attributeId}
        sort={{
          asc: params.asc,
          sort: params.sort
        }}
        onSort={handleSort}
        availableInGridAttributes={maybe(
          () => attributes.data.availableInGrid.edges.map(edge => edge.node),
          []
        )}
        currencySymbol={channel?.currencyCode}
        currentTab={currentTab}
        defaultSettings={defaultListSettings[ListViews.PRODUCT_LIST]}
        filterOpts={filterOpts}
        gridAttributes={maybe(
          () => attributes.data.grid.edges.map(edge => edge.node),
          []
        )}
        totalGridAttributes={maybe(
          () => attributes.data.availableInGrid.totalCount,
          0
        )}
        settings={settings}
        loading={attributes.loading}
        hasMore={maybe(
          () => attributes.data.availableInGrid.pageInfo.hasNextPage,
          false
        )}
        onAdd={() => navigate(productAddUrl())}
        disabled={loading}
        products={maybe(() => data.products.edges.map(edge => edge.node))}
        onFetchMore={() =>
          attributes.loadMore(
            (prev, next) => {
              if (
                prev.availableInGrid.pageInfo.endCursor ===
                next.availableInGrid.pageInfo.endCursor
              ) {
                return prev;
              }
              return {
                ...prev,
                availableInGrid: {
                  ...prev.availableInGrid,
                  edges: [
                    ...prev.availableInGrid.edges,
                    ...next.availableInGrid.edges
                  ],
                  pageInfo: next.availableInGrid.pageInfo
                }
              };
            },
            {
              after: attributes.data.availableInGrid.pageInfo.endCursor
            }
          )
        }
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        onUpdateListSettings={updateListSettings}
        pageInfo={pageInfo}
        onRowClick={id => () => navigate(productUrl(id))}
        onAll={resetFilters}
        toolbar={
          <IconButton
            color="primary"
            onClick={() =>
              openModal("delete", {
                ids: listElements
              })
            }
          >
            <DeleteIcon />
          </IconButton>
        }
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onTabSave={() => openModal("save-search")}
        onTabDelete={() => openModal("delete-search")}
        onTabChange={handleTabChange}
        initialSearch={params.query || ""}
        tabs={getFilterTabs().map(tab => tab.name)}
        onExport={() => openModal("export")}
        channelsCount={availableChannels?.length}
        selectedChannelId={channel.id}
      />
      <ActionDialog
        open={params.action === "delete"}
        confirmButtonState={productBulkDeleteOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          productBulkDelete({
            variables: { ids: params.ids }
          })
        }
        title={intl.formatMessage({
          defaultMessage: "Delete Products",
          description: "dialog header"
        })}
        variant="delete"
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="{counter,plural,one{Are you sure you want to delete this product?} other{Are you sure you want to delete {displayQuantity} products?}}"
            description="dialog content"
            values={{
              counter: params?.ids?.length,
              displayQuantity: <strong>{params?.ids?.length}</strong>
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ProductExportDialog
        attributes={(searchAttributes.result.data?.search.edges || []).map(
          edge => edge.node
        )}
        hasMore={searchAttributes.result.data?.search.pageInfo.hasNextPage}
        loading={searchAttributes.result.loading}
        onFetch={searchAttributes.search}
        onFetchMore={searchAttributes.loadMore}
        open={params.action === "export"}
        confirmButtonState={exportProductsOpts.status}
        errors={exportProductsOpts.data?.exportProducts.errors || []}
        productQuantity={{
          all: countAllProducts.data?.products.totalCount,
          filter: data?.products.totalCount
        }}
        selectedProducts={listElements.length}
        warehouses={
          warehouses.data?.warehouses.edges.map(edge => edge.node) || []
        }
        channels={availableChannels}
        onClose={closeModal}
        onSubmit={data =>
          exportProducts({
            variables: {
              input: {
                ...data,
                filter,
                ids: listElements
              }
            }
          })
        }
      />
      <SaveFilterTabDialog
        open={params.action === "save-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={handleFilterTabSave}
      />
      <DeleteFilterTabDialog
        open={params.action === "delete-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={handleFilterTabDelete}
        tabName={maybe(() => tabs[currentTab - 1].name, "...")}
      />
    </>
  );
};
export default ProductList;
