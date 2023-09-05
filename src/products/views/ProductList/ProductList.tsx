// @ts-strict-ignore
import { filterable } from "@dashboard/attributes/utils/data";
import ActionDialog from "@dashboard/components/ActionDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter/context";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import {
  DEFAULT_INITIAL_PAGINATION_DATA,
  DEFAULT_INITIAL_SEARCH_DATA,
  defaultListSettings,
  ProductListColumns,
} from "@dashboard/config";
import { Task } from "@dashboard/containers/BackgroundTasks/types";
import { useFlag } from "@dashboard/featureFlags";
import {
  ProductListQueryVariables,
  useAvailableColumnAttributesLazyQuery,
  useGridAttributesLazyQuery,
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
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { commonMessages } from "@dashboard/intl";
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
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import useProductTypeSearch from "@dashboard/searches/useProductTypeSearch";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortUrlVariables } from "@dashboard/utils/sort";
import { DialogContentText } from "@material-ui/core";
import isEqual from "lodash/isEqual";
import React, { useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductListPage from "../../components/ProductListPage";
import {
  getFilterOpts,
  getFilterQueryParam,
  getFilterVariables,
  storageUtils,
} from "./filters";
import { DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";
import { getAvailableProductKinds, getProductKindOpts } from "./utils";

interface ProductListProps {
  params: ProductListUrlQueryParams;
}

export const ProductList: React.FC<ProductListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { queue } = useBackgroundTask();
  const { valueProvider } = useConditionalFilterContext();
  const productListingPageFiltersFlag = useFlag("product_filters");

  const { updateListSettings, settings } = useListSettings<ProductListColumns>(
    ListViews.PRODUCT_LIST,
  );

  usePaginationReset(productListUrl, params, settings.rowNumber);

  const intl = useIntl();
  const { data: initialFilterAttributes } =
    useInitialProductFilterAttributesQuery({
      skip: productListingPageFiltersFlag.enabled,
    });
  const { data: initialFilterCategories } =
    useInitialProductFilterCategoriesQuery({
      variables: {
        categories: params.categories,
      },
      skip: !params.categories?.length || productListingPageFiltersFlag.enabled,
    });
  const { data: initialFilterCollections } =
    useInitialProductFilterCollectionsQuery({
      variables: {
        collections: params.collections,
      },
      skip:
        !params.collections?.length || productListingPageFiltersFlag.enabled,
    });
  const { data: initialFilterProductTypes } =
    useInitialProductFilterProductTypesQuery({
      variables: {
        productTypes: params.productTypes,
      },
      skip:
        !params.productTypes?.length || productListingPageFiltersFlag.enabled,
    });
  const searchCategories = useCategorySearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5,
    },
    skip: productListingPageFiltersFlag.enabled,
  });
  const searchCollections = useCollectionSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5,
    },
    skip: productListingPageFiltersFlag.enabled,
  });
  const searchProductTypes = useProductTypeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5,
    },
    skip: productListingPageFiltersFlag.enabled,
  });
  const searchAttributes = useAttributeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 10,
    },
    skip: productListingPageFiltersFlag.enabled,
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

  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);

  const {
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    getPresetNameToDelete,
    presets,
    selectedPreset,
    setPresetIdToDelete,
  } = useFilterPresets({
    params,
    getUrl: productListUrl,
    storageUtils,
    reset: clearRowSelection,
  });

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
      variables: { ids: selectedRowIds },
    });
    clearRowSelection();
  };

  const kindOpts = getProductKindOpts(availableProductKinds, intl);
  const paginationState = createPaginationState(settings.rowNumber, params);
  const channelOpts = availableChannels
    ? mapNodeToChoice(availableChannels, channel => channel.slug)
    : null;

  const filterVariables = getFilterVariables({
    isProductListingPageFiltersFlagEnabled:
      productListingPageFiltersFlag.enabled,
    filterContainer: valueProvider.value,
    queryParams: params,
    isChannelSelected: !!selectedChannel,
    channelSlug: selectedChannel?.slug,
  });

  const sort = getSortQueryVariables(params, !!selectedChannel);
  const queryVariables = React.useMemo<
    Omit<ProductListQueryVariables, "hasChannel" | "hasSelectedAttributes">
  >(
    () => ({
      ...paginationState,
      ...filterVariables,
      sort,
    }),
    [params, settings.rowNumber, valueProvider.value],
  );

  const filteredColumnIds = (settings.columns ?? [])
    .filter(isAttributeColumnValue)
    .map(getAttributeIdFromColumnValue);

  const { data, loading, refetch } = useProductListQuery({
    displayLoader: true,
    variables: {
      ...queryVariables,
      hasChannel: !!selectedChannel,
    },
    skip: valueProvider.loading,
  });

  const products = mapEdgesToItems(data?.products);

  const handleSetSelectedProductIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!products) {
        return;
      }

      const rowsIds = rows.map(row => products[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [products, selectedRowIds],
  );

  const availableColumnsAttributesOpts =
    useAvailableColumnAttributesLazyQuery();

  const [gridAttributesQuery, gridAttributesOpts] =
    useGridAttributesLazyQuery();

  useEffect(() => {
    // Fetch this only on initial render
    gridAttributesQuery({
      variables: {
        ids: filteredColumnIds,
        hasAttributes: !!filteredColumnIds.length,
      },
    });
  }, []);

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
        currencySymbol={selectedChannel?.currencyCode || ""}
        currentTab={selectedPreset}
        defaultSettings={defaultListSettings[ListViews.PRODUCT_LIST]}
        filterOpts={filterOpts}
        gridAttributesOpts={gridAttributesOpts}
        settings={settings}
        availableColumnsAttributesOpts={availableColumnsAttributesOpts}
        disabled={loading || valueProvider.loading}
        limits={limitOpts.data?.shop.limits}
        products={products}
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
        onTabUpdate={onPresetUpdate}
        onTabDelete={(tabIndex: number) => {
          setPresetIdToDelete(tabIndex);
          openModal("delete-search");
        }}
        onProductsDelete={() => openModal("delete")}
        onTabChange={onPresetChange}
        hasPresetsChanged={hasPresetsChanged()}
        initialSearch={params.query || ""}
        tabs={presets.map(tab => tab.name)}
        onExport={() => openModal("export")}
        selectedChannelId={selectedChannel?.id}
        selectedProductIds={selectedRowIds}
        onSelectProductIds={handleSetSelectedProductIds}
        clearRowSelection={clearRowSelection}
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
              counter: selectedRowIds.length,
              displayQuantity: <strong>{selectedRowIds.length}</strong>,
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
        selectedProducts={selectedRowIds.length}
        warehouses={mapEdgesToItems(warehouses?.data?.warehouses) || []}
        channels={availableChannels}
        onClose={closeModal}
        onSubmit={data =>
          exportProducts({
            variables: {
              input: {
                ...data,
                ...filterVariables,
                ids: selectedRowIds,
              },
            },
          })
        }
      />
      <SaveFilterTabDialog
        open={params.action === "save-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPresetSave}
      />
      <DeleteFilterTabDialog
        open={params.action === "delete-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPresetDelete}
        tabName={getPresetNameToDelete()}
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
