import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData
} from "@saleor/components/SaveFilterTabDialog";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import PageTypeBulkDeleteDialog from "@saleor/pageTypes/components/PageTypeBulkDeleteDialog";
import { usePageTypeBulkDeleteMutation } from "@saleor/pageTypes/mutations";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";
import { useIntl } from "react-intl";

import { configurationMenuUrl } from "../../../configuration";
import PageTypeListPage from "../../components/PageTypeListPage";
import { usePageTypeListQuery } from "../../queries";
import {
  pageTypeAddUrl,
  pageTypeListUrl,
  PageTypeListUrlDialog,
  PageTypeListUrlFilters,
  PageTypeListUrlQueryParams,
  pageTypeUrl
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface PageTypeListProps {
  params: PageTypeListUrlQueryParams;
}

export const PageTypeList: React.FC<PageTypeListProps> = ({ params }) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const notify = useNotifier();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const intl = useIntl();
  const { settings } = useListSettings(ListViews.PAGES_LIST);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params)
    }),
    [params]
  );
  const { data, loading, refetch } = usePageTypeListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const changeFilterField = (filter: PageTypeListUrlFilters) => {
    reset();
    navigate(
      pageTypeListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: undefined
      })
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
        ...getFilterTabs()[tab - 1].data
      })
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

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    data?.pageTypes?.pageInfo,
    paginationState,
    params
  );

  const handleSort = createSortHandler(navigate, pageTypeListUrl, params);

  const [
    pageTypeBulkDelete,
    pageTypeBulkDeleteOpts
  ] = usePageTypeBulkDeleteMutation({
    onCompleted: data => {
      if (data.pageTypeBulkDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        reset();
        refetch();
        navigate(
          pageTypeListUrl({
            ...params,
            action: undefined,
            ids: undefined
          })
        );
      }
    }
  });

  const hanldePageTypeBulkDelete = () =>
    pageTypeBulkDelete({
      variables: {
        ids: params.ids
      }
    });

  const selectedPageTypesHasPages = data?.pageTypes.edges.some(
    pageType =>
      pageType.node.hasPages && params.ids?.some(id => id === pageType.node.id)
  );

  return (
    <>
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
        pageTypes={data?.pageTypes?.edges?.map(edge => edge.node)}
        pageInfo={pageInfo}
        onAdd={() => navigate(pageTypeAddUrl)}
        onBack={() => navigate(configurationMenuUrl)}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        onRowClick={id => () => navigate(pageTypeUrl(id))}
        onSort={handleSort}
        isChecked={isSelected}
        selected={listElements.length}
        sort={getSortParams(params)}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={
          <IconButton
            color="primary"
            onClick={() =>
              openModal("remove", {
                ids: listElements
              })
            }
          >
            <DeleteIcon />
          </IconButton>
        }
      />
      <PageTypeBulkDeleteDialog
        confirmButtonState={pageTypeBulkDeleteOpts.status}
        quantity={params.ids?.length}
        hasPages={selectedPageTypesHasPages}
        open={params.action === "remove"}
        onClose={closeModal}
        onConfirm={hanldePageTypeBulkDelete}
      />
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
    </>
  );
};
PageTypeList.displayName = "PageTypeList";
export default PageTypeList;
