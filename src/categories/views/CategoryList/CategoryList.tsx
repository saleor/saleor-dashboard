import ActionDialog from "@dashboard/components/ActionDialog";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData,
} from "@dashboard/components/SaveFilterTabDialog";
import {
  CategoryBulkDeleteMutation,
  useCategoryBulkDeleteMutation,
  useRootCategoriesQuery,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { maybe } from "@dashboard/misc";
import {
  getActiveTabIndexAfterTabDelete,
  getNextUniqueTabName,
} from "@dashboard/products/views/ProductList/utils";
import { ListViews } from "@dashboard/types";
import { prepareQs } from "@dashboard/utils/filters/qs";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { DialogContentText } from "@material-ui/core";
import isEqual from "lodash/isEqual";
import { stringify } from "qs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryListPage } from "../../components/CategoryListPage/CategoryListPage";
import {
  categoryListUrl,
  CategoryListUrlDialog,
  CategoryListUrlFilters,
  CategoryListUrlQueryParams,
} from "../../urls";
import {
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab,
  updateFilterTab,
} from "./filter";
import { getSortQueryVariables } from "./sort";

interface CategoryListProps {
  params: CategoryListUrlQueryParams;
}

export const CategoryList: React.FC<CategoryListProps> = ({ params }) => {
  const navigate = useNavigator();
  const intl = useIntl();

  const [tabIndexToDelete, setTabIndexToDelete] = useState<number | null>(null);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[]>(
    [],
  );
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  // Keep reference to clear datagrid selection function
  const clearRowSelectionCallback = React.useRef<() => void | null>(null);
  const clearRowSelection = () => {
    setSelectedCategoriesIds([]);
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

  const { updateListSettings, settings } = useListSettings(
    ListViews.CATEGORY_LIST,
  );
  usePaginationReset(categoryListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data, loading, refetch } = useRootCategoriesQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const categories = mapEdgesToItems(data?.categories);

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab !== undefined ? parseInt(params.activeTab, 10) : undefined;

  const changeFilterField = (filter: CategoryListUrlFilters) => {
    clearRowSelection();
    navigate(
      categoryListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: currentTab.toString(),
      }),
    );
  };

  const [openModal, closeModal] = createDialogActionHandlers<
    CategoryListUrlDialog,
    CategoryListUrlQueryParams
  >(navigate, categoryListUrl, params);

  const paginationValues = usePaginator({
    pageInfo: maybe(() => data.categories.pageInfo),
    paginationState,
    queryString: params,
  });

  const handleTabChange = (tab: number) => {
    clearRowSelection();

    const qs = new URLSearchParams(getFilterTabs()[tab - 1]?.data ?? "");
    qs.append("activeTab", tab.toString());

    navigate(categoryListUrl() + qs.toString());
  };

  const handleTabDelete = () => {
    deleteFilterTab(tabIndexToDelete);
    clearRowSelection();

    // When deleting the current tab, navigate to the All products
    if (tabIndexToDelete === currentTab) {
      navigate(categoryListUrl());
    } else {
      const currentParams = { ...params };
      // When deleting a tab that is not the current one, only remove the action param from the query
      delete currentParams.action;
      // When deleting a tab that is before the current one, decrease the activeTab param by 1
      currentParams.activeTab = getActiveTabIndexAfterTabDelete(
        currentTab,
        tabIndexToDelete,
      );
      navigate(categoryListUrl() + stringify(currentParams));
    }
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
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

  const handleTabUpdate = (tabName: string) => {
    const { paresedQs } = prepareQs(location.search);

    updateFilterTab(tabName, stringify(paresedQs));
    handleTabChange(tabs.findIndex(tab => tab.name === tabName) + 1);
  };

  const handleCategoryBulkDelete = (data: CategoryBulkDeleteMutation) => {
    if (data.categoryBulkDelete.errors.length === 0) {
      navigate(categoryListUrl(), { replace: true });
      refetch();
      clearRowSelection();
    }
  };

  const hasPresetsChanged = () => {
    const activeTab = tabs[currentTab - 1];
    const { paresedQs } = prepareQs(location.search);

    return (
      activeTab?.data !== stringify(paresedQs) &&
      location.search !== "" &&
      stringify(paresedQs) !== ""
    );
  };

  const handleSetSelectedCategoryIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!categories) {
        return;
      }

      const rowsIds = rows.map(row => categories[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedCategoriesIds);

      if (!haveSaveValues) {
        setSelectedCategoriesIds(rowsIds);
      }

      clearRowSelectionCallback.current = clearSelection;
    },
    [categories, selectedCategoriesIds],
  );

  const [categoryBulkDelete, categoryBulkDeleteOpts] =
    useCategoryBulkDeleteMutation({
      onCompleted: handleCategoryBulkDelete,
    });

  const handleSort = createSortHandler(navigate, categoryListUrl, params);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <CategoryListPage
        hasPresetsChanged={hasPresetsChanged()}
        categories={mapEdgesToItems(data?.categories)}
        currentTab={currentTab}
        initialSearch={params.query || ""}
        onSearchChange={query => changeFilterField({ query })}
        onAll={() => navigate(categoryListUrl())}
        onTabChange={handleTabChange}
        onTabDelete={(tabIndex: number) => {
          setTabIndexToDelete(tabIndex);
          openModal("delete-search");
        }}
        onTabUpdate={handleTabUpdate}
        onTabSave={() => openModal("save-search")}
        tabs={tabs.map(tab => tab.name)}
        settings={settings}
        sort={getSortParams(params)}
        onSort={handleSort}
        disabled={loading}
        onUpdateListSettings={(...props) => {
          clearRowSelection();
          updateListSettings(...props);
        }}
        selectedCategoriesIds={selectedCategoriesIds}
        onSelectCategoriesIds={handleSetSelectedCategoryIds}
        onCategoriesDelete={() => openModal("delete")}
        setBulkDeleteButtonRef={(ref: HTMLButtonElement) => {
          deleteButtonRef.current = ref;
        }}
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
        onConfirm={() =>
          categoryBulkDelete({
            variables: {
              ids: selectedCategoriesIds,
            },
          })
        }
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
              counter: maybe(() => params.ids.length),
              displayQuantity: (
                <strong>{maybe(() => params.ids.length)}</strong>
              ),
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
        onSubmit={handleTabSave}
      />

      <DeleteFilterTabDialog
        open={params.action === "delete-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={handleTabDelete}
        tabName={tabs[tabIndexToDelete - 1]?.name ?? "..."}
      />
    </PaginatorContext.Provider>
  );
};
export default CategoryList;
