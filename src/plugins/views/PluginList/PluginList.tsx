import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData
} from "@saleor/components/SaveFilterTabDialog";
import { configurationMenuUrl } from "@saleor/configuration";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";

import PluginsListPage from "../../components/PluginsListPage/PluginsListPage";
import { usePluginsListQuery } from "../../queries";
import {
  pluginListUrl,
  PluginListUrlDialog,
  PluginListUrlQueryParams,
  pluginUrl
} from "../../urls";
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

interface PluginsListProps {
  params: PluginListUrlQueryParams;
}

export const PluginsList: React.FC<PluginsListProps> = ({ params }) => {
  const navigate = useNavigator();
  const paginate = usePaginator();
  const { updateListSettings, settings } = useListSettings(
    ListViews.PLUGINS_LIST
  );

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params)
    }),
    [params]
  );
  const { data, loading } = usePluginsListQuery({
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

  const [
    changeFilters,
    resetFilters,
    handleSearchChange
  ] = createFilterHandlers({
    createUrl: pluginListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    PluginListUrlDialog,
    PluginListUrlQueryParams
  >(navigate, pluginListUrl, params);

  const handleTabChange = (tab: number) => {
    navigate(
      pluginListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleFilterTabDelete = () => {
    deleteFilterTab(currentTab);
    navigate(pluginListUrl());
  };

  const handleFilterTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    maybe(() => data.plugins.pageInfo),
    paginationState,
    params
  );

  const handleSort = createSortHandler(navigate, pluginListUrl, params);

  return (
    <>
      <PluginsListPage
        currentTab={currentTab}
        disabled={loading}
        filterOpts={getFilterOpts(params)}
        initialSearch={params.query || ""}
        settings={settings}
        plugins={maybe(() => data.plugins.edges.map(edge => edge.node))}
        pageInfo={pageInfo}
        sort={getSortParams(params)}
        tabs={getFilterTabs().map(tab => tab.name)}
        onAdd={() => navigate(configurationMenuUrl)}
        onAll={resetFilters}
        onBack={() => navigate(configurationMenuUrl)}
        onFilterChange={changeFilters}
        onSearchChange={handleSearchChange}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        onSort={handleSort}
        onTabSave={() => openModal("save-search")}
        onTabDelete={() => openModal("delete-search")}
        onTabChange={handleTabChange}
        onUpdateListSettings={updateListSettings}
        onRowClick={id => () => navigate(pluginUrl(id))}
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

export default PluginsList;
