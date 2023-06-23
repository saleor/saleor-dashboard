// @ts-strict-ignore
import { filterable } from "@dashboard/attributes/utils/data";
import ActionDialog from "@dashboard/components/ActionDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData,
} from "@dashboard/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import {
  DEFAULT_INITIAL_PAGINATION_DATA,
  DEFAULT_INITIAL_SEARCH_DATA,
  defaultListSettings,
  ProductListColumns,
} from "@dashboard/config";
import { Task } from "@dashboard/containers/BackgroundTasks/types";
import {
  ProductListQueryVariables,
  useGridAttributesQuery,
  useInitialProductFilterAttributesQuery,
  useInitialProductFilterCategoriesQuery,
  useInitialProductFilterCollectionsQuery,
  useInitialProductFilterProductTypesQuery,
  useProductBulkDeleteMutation,
  useProductCountQuery,
  useProductExportMutation,
  useProductListQuery,
  useWarehouseListQuery,
} from "@dashboard/graphql";
import useBackgroundTask from "@dashboard/hooks/useBackgroundTask";
import { useFilterHandlers } from "@dashboard/hooks/useFilterHandlers";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { commonMessages } from "@dashboard/intl";
import { maybe } from "@dashboard/misc";
import ProductExportDialog from "@dashboard/products/components/ProductExportDialog";
import {
  getAttributeIdFromColumnValue,
  isAttributeColumnValue,
} from "@dashboard/products/components/ProductListPage/utils";
import ProductTypePickerDialog from "@dashboard/products/components/ProductTypePickerDialog";
import {
  productAddUrl,
  productListUrl,
  ProductListUrlDialog,
  ProductListUrlQueryParams,
  ProductListUrlSortField,
} from "@dashboard/products/urls";
import useAttributeSearch from "@dashboard/searches/useAttributeSearch";
import useAttributeValueSearch from "@dashboard/searches/useAttributeValueSearch";
import useAvailableInGridAttributesSearch from "@dashboard/searches/useAvailableInGridAttributesSearch";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import useProductTypeSearch from "@dashboard/searches/useProductTypeSearch";
import { ListViews } from "@dashboard/types";
import { prepareQs } from "@dashboard/utils/filters/qs";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortUrlVariables } from "@dashboard/utils/sort";
import { DialogContentText } from "@material-ui/core";
import isEqual from "lodash/isEqual";
import { stringify } from "qs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductListPage from "../../components/ProductListPage";
import {
  deleteFilterTab,
  getFilterOpts,
  getFilterQueryParam,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab,
  updateFilterTab,
} from "./filters";
import { DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";
import {
  getActiveTabIndexAfterTabDelete,
  getAvailableProductKinds,
  getNextUniqueTabName,
  getProductKindOpts,
} from "./utils";

interface ProductListProps {
  params: ProductListUrlQueryParams;
}

export const ProductList: React.FC<ProductListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { queue } = useBackgroundTask();

  const [tabIndexToDelete, setTabIndexToDelete] = useState<number | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const { updateListSettings, settings } = useListSettings<ProductListColumns>(
    ListViews.PRODUCT_LIST,
  );

  // Keep reference to clear datagrid selection function
  const clearRowSelectionCallback = React.useRef<() => void | null>(null);
  const clearRowSelection = () => {
    setSelectedProductIds([]);
    if (clearRowSelectionCallback.current) {
      clearRowSelectionCallback.current();
    }
  };

  // Whenever pagination change we need to clear datagrid selection
  useEffect(() => {
    clearRowSelection();
  }, [params.after, params.before]);

  // Remove focus from delete button after delete action
  useEffect(() => {
    if (!params.action && deleteButtonRef.current) {
      deleteButtonRef.current.blur();
    }
  }, [params.action]);

  usePaginationReset(productListUrl, params, settings.rowNumber);

  const intl = useIntl();
  const { data: initialFilterAttributes } =
    useInitialProductFilterAttributesQuery();
  const { data: initialFilterCategories } =
    useInitialProductFilterCategoriesQuery({
      variables: {
        categories: params.categories,
      },
      skip: !params.categories?.length,
    });
  const { data: initialFilterCollections } =
    useInitialProductFilterCollectionsQuery({
      variables: {
        collections: params.collections,
      },
      skip: !params.collections?.length,
    });
  const { data: initialFilterProductTypes } =
    useInitialProductFilterProductTypesQuery({
      variables: {
        productTypes: params.productTypes,
      },
      skip: !params.productTypes?.length,
    });
  const searchCategories = useCategorySearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5,
    },
  });
  const searchCollections = useCollectionSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5,
    },
  });
  const searchProductTypes = useProductTypeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5,
    },
  });
  const searchAttributes = useAttributeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 10,
    },
  });
  const [focusedAttribute, setFocusedAttribute] = useState<string>();
  const searchAttributeValues = useAttributeValueSearch({
    variables: {
      id: focusedAttribute,
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 10,
    },
    skip: !focusedAttribute,
  });
  const warehouses = useWarehouseListQuery({
    variables: {
      first: 100,
    },
    skip: params.action !== "export",
  });
  const availableProductKinds = getAvailableProductKinds();
  const { availableChannels } = useAppChannel(false);
  const limitOpts = useShopLimitsQuery({
    variables: {
      productVariants: true,
    },
  });

  const selectedChannel = availableChannels.find(
    channel => channel.slug === params.channel,
  );

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductListUrlDialog,
    ProductListUrlQueryParams
  >(navigate, productListUrl, params);

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab !== undefined ? parseInt(params.activeTab, 10) : undefined;

  const countAllProducts = useProductCountQuery({
    skip: params.action !== "export",
  });

  const [exportProducts, exportProductsOpts] = useProductExportMutation({
    onCompleted: data => {
      if (data.exportProducts.errors.length === 0) {
        notify({
          text: intl.formatMessage({
            id: "dPYqy0",
            defaultMessage:
              "We are currently exporting your requested CSV. As soon as it is available it will be sent to your email address",
          }),
          title: intl.formatMessage({
            id: "5QKsu+",
            defaultMessage: "Exporting CSV",
            description: "waiting for export to end, header",
          }),
        });
        queue(Task.EXPORT, {
          id: data.exportProducts.exportFile.id,
        });
        closeModal();
        clearRowSelection();
      }
    },
  });

  const [productBulkDelete, productBulkDeleteOpts] =
    useProductBulkDeleteMutation({
      onCompleted: data => {
        if (data.productBulkDelete.errors.length === 0) {
          closeModal();
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
          refetch();
          limitOpts.refetch();
          clearRowSelection();
        }
      },
    });

  const [changeFilters, resetFilters, handleSearchChange] = useFilterHandlers({
    cleanupFn: clearRowSelection,
    createUrl: productListUrl,
    getFilterQueryParam,
    params,
    keepActiveTab: true,
    defaultSortField: DEFAULT_SORT_KEY,
    hasSortWithRank: true,
  });

  const handleTabChange = (tab: number) => {
    clearRowSelection();

    const qs = new URLSearchParams(getFilterTabs()[tab - 1]?.data ?? "");
    qs.append("activeTab", tab.toString());

    navigate(productListUrl() + qs.toString());
  };

  const handleFilterTabDelete = () => {
    deleteFilterTab(tabIndexToDelete);
    clearRowSelection();

    // When deleting the current tab, navigate to the All products
    if (tabIndexToDelete === currentTab) {
      navigate(productListUrl());
    } else {
      const currentParams = { ...params };
      // When deleting a tab that is not the current one, only remove the action param from the query
      delete currentParams.action;
      // When deleting a tab that is before the current one, decrease the activeTab param by 1
      currentParams.activeTab = getActiveTabIndexAfterTabDelete(
        currentTab,
        tabIndexToDelete,
      );
      navigate(productListUrl() + stringify(currentParams));
    }
  };

  const handleFilterTabSave = (data: SaveFilterTabDialogFormData) => {
    const { paresedQs } = prepareQs(location.search);

    saveFilterTab(
      getNextUniqueTabName(
        data.name,
        tabs.map(tab => tab.name),
      ),
      stringify(paresedQs),
    );
    handleTabChange(tabs.length + 1);
  };

  const hanleFilterTabUpdate = (tabName: string) => {
    const { paresedQs, activeTab } = prepareQs(location.search);

    updateFilterTab(tabName, stringify(paresedQs));
    paresedQs.activeTab = activeTab;

    navigate(productListUrl() + stringify(paresedQs));
  };

  const handleSort = (field: ProductListUrlSortField, attributeId?: string) =>
    navigate(
      productListUrl({
        ...params,
        ...getSortUrlVariables(field, params),
        attributeId,
        ...DEFAULT_INITIAL_PAGINATION_DATA,
      }),
    );

  const handleSubmitBulkDelete = () => {
    productBulkDelete({
      variables: { ids: selectedProductIds },
    });
    deleteButtonRef.current.blur();
    clearRowSelection();
  };

  const kindOpts = getProductKindOpts(availableProductKinds, intl);
  const paginationState = createPaginationState(settings.rowNumber, params);
  const channelOpts = availableChannels
    ? mapNodeToChoice(availableChannels, channel => channel.slug)
    : null;
  const filter = getFilterVariables(params, !!selectedChannel);
  const sort = getSortQueryVariables(params, !!selectedChannel);
  const queryVariables = React.useMemo<
    Omit<ProductListQueryVariables, "hasChannel" | "hasSelectedAttributes">
  >(
    () => ({
      ...paginationState,
      filter,
      sort,
      channel: selectedChannel?.slug,
    }),
    [params, settings.rowNumber],
  );

  const filteredColumnIds = settings.columns
    .filter(isAttributeColumnValue)
    .map(getAttributeIdFromColumnValue);

  const { data, loading, refetch } = useProductListQuery({
    displayLoader: true,
    variables: {
      ...queryVariables,
      hasChannel: !!selectedChannel,
      hasSelectedAttributes: filteredColumnIds.length > 0,
    },
  });

  const products = mapEdgesToItems(data?.products);

  const handleSetSelectedProductIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!products) {
        return;
      }

      const rowsIds = rows.map(row => products[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedProductIds);

      if (!haveSaveValues) {
        setSelectedProductIds(rowsIds);
      }

      clearRowSelectionCallback.current = clearSelection;
    },
    [products, selectedProductIds],
  );

  const availableInGridAttributesOpts = useAvailableInGridAttributesSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5,
    },
  });
  const gridAttributes = useGridAttributesQuery({
    variables: { ids: filteredColumnIds },
    skip: filteredColumnIds.length === 0,
  });

  const {
    loadMore: loadMoreDialogProductTypes,
    search: searchDialogProductTypes,
    result: searchDialogProductTypesOpts,
  } = useProductTypeSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const fetchMoreDialogProductTypes = {
    hasMore: searchDialogProductTypesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchDialogProductTypesOpts.loading,
    onFetchMore: loadMoreDialogProductTypes,
  };

  const filterOpts = getFilterOpts(
    params,
    (mapEdgesToItems(initialFilterAttributes?.attributes) || []).filter(
      filterable,
    ),
    searchAttributeValues,
    {
      initial: mapEdgesToItems(initialFilterCategories?.categories) || [],
      search: searchCategories,
    },
    {
      initial: mapEdgesToItems(initialFilterCollections?.collections) || [],
      search: searchCollections,
    },
    {
      initial: mapEdgesToItems(initialFilterProductTypes?.productTypes) || [],
      search: searchProductTypes,
    },
    kindOpts,
    channelOpts,
  );

  const hasPresetsChanged = () => {
    const activeTab = tabs[currentTab - 1];
    const { paresedQs } = prepareQs(location.search);

    return (
      activeTab?.data !== stringify(paresedQs) &&
      location.search !== "" &&
      stringify(paresedQs) !== ""
    );
  };

  const paginationValues = usePaginator({
    pageInfo: data?.products?.pageInfo,
    paginationState,
    queryString: params,
  });

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <ProductListPage
        activeAttributeSortId={params.attributeId}
        sort={{
          asc: params.asc,
          sort: params.sort,
        }}
        onSort={handleSort}
        availableInGridAttributes={
          mapEdgesToItems(
            availableInGridAttributesOpts.result?.data?.availableInGrid,
          ) || []
        }
        currencySymbol={selectedChannel?.currencyCode || ""}
        currentTab={currentTab}
        defaultSettings={defaultListSettings[ListViews.PRODUCT_LIST]}
        filterOpts={filterOpts}
        gridAttributes={mapEdgesToItems(gridAttributes?.data?.grid) || []}
        settings={settings}
        loading={
          availableInGridAttributesOpts.result.loading || gridAttributes.loading
        }
        hasMore={maybe(
          () =>
            availableInGridAttributesOpts.result.data.availableInGrid.pageInfo
              .hasNextPage,
          false,
        )}
        disabled={loading}
        limits={limitOpts.data?.shop.limits}
        products={products}
        onColumnQueryChange={availableInGridAttributesOpts.search}
        onFetchMore={availableInGridAttributesOpts.loadMore}
        onUpdateListSettings={(...props) => {
          clearRowSelection();
          updateListSettings(...props);
        }}
        onAdd={() => openModal("create-product")}
        onAll={resetFilters}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onFilterAttributeFocus={setFocusedAttribute}
        onTabSave={() => openModal("save-search")}
        onTabUpdate={hanleFilterTabUpdate}
        onTabDelete={(tabIndex: number) => {
          setTabIndexToDelete(tabIndex);
          openModal("delete-search");
        }}
        onProductsDelete={() => openModal("delete")}
        onTabChange={handleTabChange}
        hasPresetsChanged={hasPresetsChanged()}
        initialSearch={params.query || ""}
        tabs={tabs.map(tab => tab.name)}
        onExport={() => openModal("export")}
        selectedChannelId={selectedChannel?.id}
        selectedProductIds={selectedProductIds}
        onSelectProductIds={handleSetSelectedProductIds}
        columnQuery={availableInGridAttributesOpts.query}
        clearRowSelection={clearRowSelection}
        setBulkDeleteButtonRef={(ref: HTMLButtonElement) => {
          deleteButtonRef.current = ref;
        }}
      />
      <ActionDialog
        open={params.action === "delete"}
        confirmButtonState={productBulkDeleteOpts.status}
        onClose={closeModal}
        onConfirm={handleSubmitBulkDelete}
        title={intl.formatMessage({
          id: "F4WdSO",
          defaultMessage: "Delete Products",
          description: "dialog header",
        })}
        variant="delete"
      >
        <DialogContentText>
          <FormattedMessage
            id="yDkmX7"
            defaultMessage="{counter,plural,one{Are you sure you want to delete this product?} other{Are you sure you want to delete {displayQuantity} products?}}"
            description="dialog content"
            values={{
              counter: selectedProductIds.length,
              displayQuantity: <strong>{selectedProductIds.length}</strong>,
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ProductExportDialog
        attributes={
          mapEdgesToItems(searchAttributes?.result?.data?.search) || []
        }
        hasMore={searchAttributes.result.data?.search.pageInfo.hasNextPage}
        loading={
          searchAttributes.result.loading ||
          countAllProducts.loading ||
          warehouses.loading
        }
        onFetch={searchAttributes.search}
        onFetchMore={searchAttributes.loadMore}
        open={params.action === "export"}
        confirmButtonState={exportProductsOpts.status}
        errors={exportProductsOpts.data?.exportProducts.errors || []}
        productQuantity={{
          all: countAllProducts.data?.products?.totalCount,
          filter: data?.products?.totalCount,
        }}
        selectedProducts={selectedProductIds.length}
        warehouses={mapEdgesToItems(warehouses?.data?.warehouses) || []}
        channels={availableChannels}
        onClose={closeModal}
        onSubmit={data =>
          exportProducts({
            variables: {
              input: {
                ...data,
                filter,
                ids: selectedProductIds,
              },
            },
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
        tabName={tabs[tabIndexToDelete - 1]?.name ?? "..."}
      />
      <ProductTypePickerDialog
        confirmButtonState="success"
        open={params.action === "create-product"}
        productTypes={mapNodeToChoice(
          mapEdgesToItems(searchDialogProductTypesOpts?.data?.search),
        )}
        fetchProductTypes={searchDialogProductTypes}
        fetchMoreProductTypes={fetchMoreDialogProductTypes}
        onClose={closeModal}
        onConfirm={productTypeId =>
          navigate(
            productAddUrl({
              "product-type-id": productTypeId,
            }),
          )
        }
      />
    </PaginatorContext.Provider>
  );
};
export default ProductList;
