import ActionDialog from "@dashboard/components/ActionDialog";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import {
  CategoryBulkDeleteMutation,
  useCategoryBulkDeleteMutation,
  useRootCategoriesQuery,
} from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
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
import { DialogContentText } from "@material-ui/core";
import isEqual from "lodash/isEqual";
import React, { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryListPage } from "../../components/CategoryListPage/CategoryListPage";
import {
  categoryListUrl,
  CategoryListUrlDialog,
  CategoryListUrlFilters,
  CategoryListUrlQueryParams,
} from "../../urls";
import { getActiveFilters, getFilterVariables, storageUtils } from "./filter";
import { getSortQueryVariables } from "./sort";

interface CategoryListProps {
  params: CategoryListUrlQueryParams;
}

export const CategoryList: React.FC<CategoryListProps> = ({ params }) => {
  const navigate = useNavigator();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(ListViews.CATEGORY_LIST);
  const handleSort = createSortHandler(navigate, categoryListUrl, params);
  const {
    selectedRowIds,
    setSelectedRowIds,
    clearRowSelection,
    setClearDatagridRowSelectionCallback,
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
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [paginationState, params],
  );
  const { data, loading, refetch } = useRootCategoriesQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const categories = mapEdgesToItems(data?.categories);
  const paginationValues = usePaginator({
    pageInfo: data?.categories?.pageInfo,
    paginationState,
    queryString: params,
  });
  const changeFilterField = (filter: CategoryListUrlFilters) => {
    clearRowSelection();
    navigate(
      categoryListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: !filter.query?.length ? undefined : params.activeTab,
      }),
    );
  };
  const handleCategoryBulkDeleteOnComplete = (data: CategoryBulkDeleteMutation) => {
    if (data?.categoryBulkDelete?.errors.length === 0) {
      navigate(categoryListUrl(), { replace: true });
      refetch();
      clearRowSelection();
    }
  };
  const handleSetSelectedCategoryIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!categories) {
        return;
      }

      const rowsIds = rows.map(row => categories[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [categories, setClearDatagridRowSelectionCallback, selectedRowIds, setSelectedRowIds],
  );
  const [categoryBulkDelete, categoryBulkDeleteOpts] = useCategoryBulkDeleteMutation({
    onCompleted: handleCategoryBulkDeleteOnComplete,
  });
  const handleCategoryBulkDelete = useCallback(async () => {
    await categoryBulkDelete({
      variables: {
        ids: selectedRowIds,
      },
    });
    clearRowSelection();
  }, [selectedRowIds]);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <CategoryListPage
        hasPresetsChanged={hasPresetsChanged()}
        categories={mapEdgesToItems(data?.categories)!}
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
        disabled={loading}
        onUpdateListSettings={(...props) => {
          clearRowSelection();
          updateListSettings(...props);
        }}
        selectedCategoriesIds={selectedRowIds}
        onSelectCategoriesIds={handleSetSelectedCategoryIds}
        onCategoriesDelete={() => openModal("delete")}
      />

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
        <DialogContentText>
          <FormattedMessage
            id="Pp/7T7"
            defaultMessage="{counter,plural,one{Are you sure you want to delete this category?} other{Are you sure you want to delete {displayQuantity} categories?}}"
            values={{
              counter: params?.ids?.length,
              displayQuantity: <strong>{params?.ids?.length}</strong>,
            }}
          />
        </DialogContentText>
        <DialogContentText>
          <FormattedMessage
            id="e+L+q3"
            defaultMessage="Remember this will also delete all products assigned to this category."
          />
        </DialogContentText>
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
export default CategoryList;
