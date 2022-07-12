import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData,
} from "@saleor/components/SaveFilterTabDialog";
import {
  CategoryBulkDeleteMutation,
  useCategoryBulkDeleteMutation,
  useRootCategoriesQuery,
} from "@saleor/graphql";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import { usePaginationReset } from "@saleor/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@saleor/hooks/usePaginator";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";
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
  getFiltersCurrentTab,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab,
} from "./filter";
import { getSortQueryVariables } from "./sort";

interface CategoryListProps {
  params: CategoryListUrlQueryParams;
}

export const CategoryList: React.FC<CategoryListProps> = ({ params }) => {
  const navigate = useNavigator();

  const { isSelected, listElements, toggle, toggleAll, reset } = useBulkActions(
    params.ids,
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.CATEGORY_LIST,
  );

  usePaginationReset(categoryListUrl, params, settings.rowNumber);

  const intl = useIntl();

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

  const tabs = getFilterTabs();

  const currentTab = getFiltersCurrentTab(params, tabs);

  const changeFilterField = (filter: CategoryListUrlFilters) => {
    reset();
    navigate(
      categoryListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: undefined,
      }),
    );
  };

  const [openModal, closeModal] = createDialogActionHandlers<
    CategoryListUrlDialog,
    CategoryListUrlQueryParams
  >(navigate, categoryListUrl, params);

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      categoryListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data,
      }),
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(categoryListUrl());
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const paginationValues = usePaginator({
    pageInfo: maybe(() => data.categories.pageInfo),
    paginationState,
    queryString: params,
  });

  const handleCategoryBulkDelete = (data: CategoryBulkDeleteMutation) => {
    if (data.categoryBulkDelete.errors.length === 0) {
      navigate(categoryListUrl(), { replace: true });
      refetch();
      reset();
    }
  };

  const [
    categoryBulkDelete,
    categoryBulkDeleteOpts,
  ] = useCategoryBulkDeleteMutation({
    onCompleted: handleCategoryBulkDelete,
  });

  const handleSort = createSortHandler(navigate, categoryListUrl, params);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <CategoryListPage
        categories={mapEdgesToItems(data?.categories)}
        currentTab={currentTab}
        initialSearch={params.query || ""}
        onSearchChange={query => changeFilterField({ query })}
        onAll={() => navigate(categoryListUrl())}
        onTabChange={handleTabChange}
        onTabDelete={() => openModal("delete-search")}
        onTabSave={() => openModal("save-search")}
        tabs={tabs.map(tab => tab.name)}
        settings={settings}
        sort={getSortParams(params)}
        onSort={handleSort}
        disabled={loading}
        onUpdateListSettings={updateListSettings}
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={
          <IconButton
            variant="secondary"
            color="primary"
            data-test-id="delete-icon"
            onClick={() =>
              openModal("delete", {
                ids: listElements,
              })
            }
          >
            <DeleteIcon />
          </IconButton>
        }
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
              ids: params.ids,
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
        tabName={maybe(() => tabs[currentTab - 1].name, "...")}
      />
    </PaginatorContext.Provider>
  );
};
export default CategoryList;
