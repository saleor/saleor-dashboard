import {
  categoryListUrl,
  CategoryListUrlQueryParams,
} from "@dashboard/categories/urls";
import { SaveFilterTabDialogFormData } from "@dashboard/components/SaveFilterTabDialog";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  getActiveTabIndexAfterTabDelete,
  getNextUniqueTabName,
} from "@dashboard/products/views/ProductList/utils";
import { prepareQs } from "@dashboard/utils/filters/qs";
import { stringify } from "qs";
import { useState } from "react";

import {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab,
  updateFilterTab,
} from "./filter";

export const useTabs = ({
  params,
  reset,
}: {
  params: CategoryListUrlQueryParams;
  reset: () => void;
}) => {
  const navigate = useNavigator();
  const [tabIndexToDelete, setTabIndexToDelete] = useState<number | null>(null);

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab !== undefined ? parseInt(params.activeTab, 10) : undefined;

  const onTabChange = (tab: number) => {
    reset();
    const qs = new URLSearchParams(getFilterTabs()[tab - 1]?.data ?? "");
    qs.append("activeTab", tab.toString());

    navigate(categoryListUrl() + qs.toString());
  };

  const onTabDelete = () => {
    deleteFilterTab(tabIndexToDelete);
    reset();

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

  const onTabSave = (data: SaveFilterTabDialogFormData) => {
    const { paresedQs } = prepareQs(location.search);

    saveFilterTab(
      getNextUniqueTabName(
        data.name,
        tabs.map(tab => tab.name),
      ),
      stringify(paresedQs),
    );
    onTabChange(tabs.length + 1);
  };

  const onTabUpdate = (tabName: string) => {
    const { paresedQs } = prepareQs(location.search);

    updateFilterTab(tabName, stringify(paresedQs));
    onTabChange(tabs.findIndex(tab => tab.name === tabName) + 1);
  };

  const hasTabChanged = () => {
    const activeTab = tabs[currentTab - 1];
    const { paresedQs } = prepareQs(location.search);

    return (
      activeTab?.data !== stringify(paresedQs) &&
      location.search !== "" &&
      stringify(paresedQs) !== ""
    );
  };

  return {
    tabIndexToDelete,
    setTabIndexToDelete,
    tabs,
    currentTab,
    onTabChange,
    onTabDelete,
    onTabSave,
    onTabUpdate,
    hasTabChanged,
  };
};
