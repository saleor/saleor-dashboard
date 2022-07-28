import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import FilterBar from "@saleor/components/FilterBar";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData,
} from "@saleor/components/SaveFilterTabDialog";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { getSearchFetchMoreProps } from "@saleor/hooks/makeTopLevelSearch/utils";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useNavigator from "@saleor/hooks/useNavigator";
import { pageListUrl, PageListUrlQueryParams } from "@saleor/pages/urls";
import usePageTypeSearch from "@saleor/searches/usePageTypeSearch";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import {
  createFilterStructure,
  deleteFilterTab,
  getActiveFilters,
  getFilterOpts,
  getFilterQueryParam,
  getFiltersCurrentTab,
  getFilterTabs,
  saveFilterTab,
} from "./filters";
import { pagesListSearchAndFiltersMessages as messages } from "./messages";
import { PageListActionDialogOpts } from "./PageListPage";

interface PageListSearchAndFiltersProps {
  params: PageListUrlQueryParams;
  actionDialogOpts: PageListActionDialogOpts;
}

const PageListSearchAndFilters: React.FC<PageListSearchAndFiltersProps> = ({
  params,
  actionDialogOpts,
}) => {
  const navigate = useNavigator();
  const intl = useIntl();

  const defaultSearchVariables = {
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5,
    },
  };

  const { reset } = useBulkActions(params.ids);

  const {
    loadMore: fetchMorePageTypes,
    search: searchPageTypes,
    result: searchPageTypesResult,
  } = usePageTypeSearch(defaultSearchVariables);

  const filterOpts = getFilterOpts({
    params,
    pageTypes: mapEdgesToItems(searchPageTypesResult?.data?.search),
    pageTypesProps: {
      ...getSearchFetchMoreProps(searchPageTypesResult, fetchMorePageTypes),
      onSearchChange: searchPageTypes,
    },
  });

  const [
    changeFilters,
    resetFilters,
    handleSearchChange,
  ] = createFilterHandlers({
    createUrl: pageListUrl,
    getFilterQueryParam,
    navigate,
    params,
    cleanupFn: reset,
  });

  const filterStructure = createFilterStructure(intl, filterOpts);

  const { open: openModal, close: closeModal } = actionDialogOpts;

  const handleTabChange = (tab: number) => {
    navigate(
      pageListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data,
      }),
    );
  };

  const tabs = getFilterTabs();
  const currentTab = getFiltersCurrentTab(params, tabs);

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(pageListUrl());
  };

  return (
    <>
      <FilterBar
        filterStructure={filterStructure}
        initialSearch={""}
        onAll={resetFilters}
        onFilterChange={changeFilters}
        onSearchChange={handleSearchChange}
        searchPlaceholder={intl.formatMessage(messages.searchPlaceholder)}
        allTabLabel={"All Pages"}
        tabs={tabs.map(({ name }) => name)}
        currentTab={currentTab}
        onTabDelete={handleTabDelete}
        onTabChange={handleTabChange}
        onTabSave={() => openModal("save-search")}
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
        tabName={tabs[currentTab - 1]?.name ?? "..."}
      />
    </>
  );
};

export default PageListSearchAndFilters;
