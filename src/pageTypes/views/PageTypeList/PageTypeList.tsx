import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData,
} from "@saleor/components/SaveFilterTabDialog";
import TypeDeleteWarningDialog from "@saleor/components/TypeDeleteWarningDialog";
import {
  usePageTypeBulkDeleteMutation,
  usePageTypeListQuery,
} from "@saleor/graphql";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { usePaginationReset } from "@saleor/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import { getStringOrPlaceholder } from "@saleor/misc";
import usePageTypeDelete from "@saleor/pageTypes/hooks/usePageTypeDelete";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";
import { useIntl } from "react-intl";

import PageTypeListPage from "../../components/PageTypeListPage";
import {
  pageTypeListUrl,
  PageTypeListUrlDialog,
  PageTypeListUrlFilters,
  PageTypeListUrlQueryParams,
} from "../../urls";
import {
  deleteFilterTab,
  getActiveFilters,
  getFiltersCurrentTab,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab,
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface PageTypeListProps {
  params: PageTypeListUrlQueryParams;
}

export const PageTypeList: React.FC<PageTypeListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const {
    isSelected,
    listElements: selectedPageTypes,
    reset,
    toggle,
    toggleAll,
  } = useBulkActions(params.ids);
  const intl = useIntl();
  const { settings } = useListSettings(ListViews.PAGES_LIST);

  usePaginationReset(pageTypeListUrl, params, settings.rowNumber);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data, loading, refetch } = usePageTypeListQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const tabs = getFilterTabs();

  const currentTab = getFiltersCurrentTab(params, tabs);

  const changeFilterField = (filter: PageTypeListUrlFilters) => {
    reset();
    navigate(
      pageTypeListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: undefined,
      }),
    );
  };

  const [openModal, closeModal] = createDialogActionHandlers<
    PageTypeListUrlDialog,
    PageTypeListUrlQueryParams
  >(navigate, pageTypeListUrl, params);

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      pageTypeListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data,
      }),
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(pageTypeListUrl());
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const paginationValues = usePaginator({
    pageInfo: data?.pageTypes?.pageInfo,
    paginationState,
    queryString: params,
  });

  const handleSort = createSortHandler(navigate, pageTypeListUrl, params);

  const [
    pageTypeBulkDelete,
    pageTypeBulkDeleteOpts,
  ] = usePageTypeBulkDeleteMutation({
    onCompleted: data => {
      if (data.pageTypeBulkDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        reset();
        refetch();
        navigate(
          pageTypeListUrl({
            ...params,
            action: undefined,
            ids: undefined,
          }),
        );
      }
    },
  });

  const hanldePageTypeBulkDelete = () =>
    pageTypeBulkDelete({
      variables: {
        ids: params.ids,
      },
    });

  const pageTypeDeleteData = usePageTypeDelete({
    selectedTypes: selectedPageTypes,
    params,
  });

  const pageTypesData = mapEdgesToItems(data?.pageTypes);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <PageTypeListPage
        currentTab={currentTab}
        initialSearch={params.query || ""}
        onSearchChange={query => changeFilterField({ query })}
        onAll={() => navigate(pageTypeListUrl())}
        onTabChange={handleTabChange}
        onTabDelete={() => openModal("delete-search")}
        onTabSave={() => openModal("save-search")}
        tabs={tabs.map(tab => tab.name)}
        disabled={loading}
        pageTypes={pageTypesData}
        onSort={handleSort}
        isChecked={isSelected}
        selected={selectedPageTypes.length}
        sort={getSortParams(params)}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={
          <IconButton
            variant="secondary"
            color="primary"
            onClick={() =>
              openModal("remove", {
                ids: selectedPageTypes,
              })
            }
          >
            <DeleteIcon />
          </IconButton>
        }
      />
      {pageTypesData && (
        <TypeDeleteWarningDialog
          {...pageTypeDeleteData}
          typesData={pageTypesData}
          typesToDelete={selectedPageTypes}
          onClose={closeModal}
          onDelete={hanldePageTypeBulkDelete}
          deleteButtonState={pageTypeBulkDeleteOpts.status}
          showViewAssignedItemsButton={false}
        />
      )}
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
        tabName={getStringOrPlaceholder(tabs[currentTab - 1]?.name)}
      />
    </PaginatorContext.Provider>
  );
};
PageTypeList.displayName = "PageTypeList";
export default PageTypeList;
