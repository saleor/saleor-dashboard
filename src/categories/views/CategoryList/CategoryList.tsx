import { useApolloClient } from "@apollo/client";
import ActionDialog from "@dashboard/components/ActionDialog";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { useRootCategoriesQuery } from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { Box } from "@saleor/macaw-ui-next";
import { useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { CategoryListPage } from "../../components/CategoryListPage/CategoryListPage";
import {
  type CategoryListPageState,
  CategoryListPageStateProvider,
} from "../../components/CategoryListPage/categoryListPageState";
import {
  categoryListUrl,
  type CategoryListUrlDialog,
  type CategoryListUrlFilters,
  type CategoryListUrlQueryParams,
} from "../../urls";
import {
  CATEGORY_LIST_EXPANDED_IDS_STORAGE_KEY,
  normalizeStoredExpandedIds,
} from "./expandedIdsStorage";
import { getActiveFilters, getFilterVariables, storageUtils } from "./filter";
import { useCategoryBulkDeleteController } from "./hooks/useCategoryBulkDeleteController";
import { useCategorySelectionController } from "./hooks/useCategorySelectionController";
import { useCategoryTreeController } from "./hooks/useCategoryTreeController";
import { getSortQueryVariables } from "./sort";
import { collectDescendantIds } from "./utils/categoryTree";

interface CategoryListProps {
  params: CategoryListUrlQueryParams;
}

const CategoryList = ({ params }: CategoryListProps): JSX.Element => {
  const client = useApolloClient();
  const location = useLocation();
  const navigate = useNavigator();
  const intl = useIntl();
  const notify = useNotifier();
  const { updateListSettings, settings } = useListSettings(ListViews.CATEGORY_LIST);
  const handleSort = createSortHandler(navigate, categoryListUrl, params);
  const {
    selectedRowIds,
    setSelectedRowIds,
    clearRowSelection,
    setClearDatagridRowSelectionCallback,
    excludeFromSelected,
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
    storageUtils,
    getUrl: categoryListUrl,
    reset: clearRowSelection,
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    CategoryListUrlDialog,
    CategoryListUrlQueryParams
  >(navigate, categoryListUrl, params);

  usePaginationReset(categoryListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [paginationState, params],
  );
  const { data, refetch } = useRootCategoriesQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const categories = mapEdgesToItems(data?.categories) ?? [];
  const paginationValues = usePaginator({
    pageInfo: data?.categories?.pageInfo,
    paginationState,
    queryString: params,
  });
  const [storedExpandedIds, setStoredExpandedIds] = useLocalStorage<string[]>(
    CATEGORY_LIST_EXPANDED_IDS_STORAGE_KEY,
    storedIds => normalizeStoredExpandedIds(storedIds),
  );

  const changeFilterField = (filter: CategoryListUrlFilters): void => {
    clearRowSelection();
    navigate(
      categoryListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: !filter.query?.length ? undefined : params.activeTab,
      }),
    );
  };

  const {
    visibleRows,
    visibleCategories,
    subcategoryPageSize,
    hasExpandedSubcategories,
    isCategoryExpanded,
    isCategoryChildrenLoading,
    getCategoryDepth,
    toggleExpanded,
    handleSubcategoryPageSizeChange,
    handleCollapseAllSubcategories,
    getCachedChildrenByParentId,
    pruneTreeStateAfterDelete,
  } = useCategoryTreeController({
    client,
    categories,
    locationPathname: location.pathname,
    clearRowSelection,
    storedExpandedIds,
    setStoredExpandedIds,
  });

  const { handleSelectedCategoryIdsChange, handleSetSelectedCategoryIds } =
    useCategorySelectionController({
      selectedRowIds,
      setSelectedRowIds,
      setClearDatagridRowSelectionCallback,
      visibleRows,
      getCachedChildrenByParentId,
    });

  const handleCategoryExpandToggle = useCallback(
    async (categoryId: string): Promise<void> => {
      if (isCategoryExpanded(categoryId)) {
        const hiddenIds = new Set(collectDescendantIds(categoryId, getCachedChildrenByParentId));
        const hasHiddenSelectedRows = selectedRowIds.some(id => hiddenIds.has(id));

        if (hasHiddenSelectedRows) {
          excludeFromSelected([...hiddenIds, categoryId]);
        }
      }

      await toggleExpanded(categoryId);
    },
    [
      excludeFromSelected,
      getCachedChildrenByParentId,
      isCategoryExpanded,
      selectedRowIds,
      toggleExpanded,
    ],
  );

  const notifyDeleted = useCallback((): void => {
    notify({
      status: "success",
      text: intl.formatMessage({
        id: "G5ETO0",
        defaultMessage: "Categories deleted",
      }),
    });
  }, [intl, notify]);

  const refetchRootCategories = useCallback((): void => {
    void refetch();
  }, [refetch]);

  const navigateToList = useCallback((): void => {
    navigate(categoryListUrl(), { replace: true });
  }, [navigate]);
  const handleOpenDeleteModal = useCallback((): void => {
    openModal("delete");
  }, [openModal]);

  const { categoryBulkDeleteOpts, handleCategoryBulkDelete } = useCategoryBulkDeleteController({
    selectedRowIds,
    visibleRows,
    client,
    subcategoryPageSize,
    getCachedChildrenByParentId,
    pruneTreeStateAfterDelete,
    clearRowSelection,
    refetchRootCategories,
    navigateToList,
    notifyDeleted,
  });
  const categoryListPageState = useMemo<CategoryListPageState>(
    () => ({
      categories: visibleCategories,
      selectedCategoriesIds: selectedRowIds,
      onCategoriesDelete: handleOpenDeleteModal,
      onSelectCategoriesIds: handleSetSelectedCategoryIds,
      onSelectedCategoriesIdsChange: handleSelectedCategoryIdsChange,
      isCategoryExpanded,
      onCategoryExpandToggle: handleCategoryExpandToggle,
      isCategoryChildrenLoading,
      getCategoryDepth,
      subcategoryPageSize,
      onSubcategoryPageSizeChange: handleSubcategoryPageSizeChange,
      hasExpandedSubcategories,
      onCollapseAllSubcategories: handleCollapseAllSubcategories,
    }),
    [
      getCategoryDepth,
      handleCategoryExpandToggle,
      handleCollapseAllSubcategories,
      handleOpenDeleteModal,
      handleSelectedCategoryIdsChange,
      handleSetSelectedCategoryIds,
      handleSubcategoryPageSizeChange,
      hasExpandedSubcategories,
      isCategoryChildrenLoading,
      isCategoryExpanded,
      selectedRowIds,
      subcategoryPageSize,
      visibleCategories,
    ],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <CategoryListPageStateProvider value={categoryListPageState}>
        <CategoryListPage
          hasPresetsChanged={hasPresetsChanged()}
          currentTab={selectedPreset}
          initialSearch={params.query || ""}
          onSearchChange={query => changeFilterField({ query })}
          onAll={() => navigate(categoryListUrl())}
          onTabChange={onPresetChange}
          onTabDelete={(tabIndex: number) => {
            setPresetIdToDelete(tabIndex);
            openModal("delete-search");
          }}
          onTabUpdate={onPresetUpdate}
          onTabSave={() => openModal("save-search")}
          tabs={presets.map(tab => tab.name)}
          settings={settings}
          sort={getSortParams(params)}
          onSort={handleSort}
          disabled={!data}
          onUpdateListSettings={(...props) => {
            clearRowSelection();
            updateListSettings(...props);
          }}
        />
      </CategoryListPageStateProvider>

      <ActionDialog
        confirmButtonState={categoryBulkDeleteOpts.status}
        onClose={() =>
          navigate(
            categoryListUrl({
              ...params,
              action: undefined,
              ids: undefined,
            }),
          )
        }
        onConfirm={handleCategoryBulkDelete}
        open={params.action === "delete"}
        title={intl.formatMessage({
          id: "sG0w22",
          defaultMessage: "Delete categories",
          description: "dialog title",
        })}
        variant="delete"
      >
        <Box display="grid" gap={2}>
          <Box>
            <FormattedMessage
              id="Pp/7T7"
              defaultMessage="{counter,plural,one{Are you sure you want to delete this category?} other{Are you sure you want to delete {displayQuantity} categories?}}"
              values={{
                counter: selectedRowIds.length,
                displayQuantity: <strong>{selectedRowIds.length}</strong>,
              }}
            />
          </Box>
          <Box>
            <FormattedMessage
              id="e+L+q3"
              defaultMessage="Remember this will also delete all products assigned to this category."
            />
          </Box>
        </Box>
      </ActionDialog>

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
    </PaginatorContext.Provider>
  );
};

// eslint-disable-next-line import/no-default-export
export default CategoryList;
