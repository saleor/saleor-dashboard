import { SaveFilterTabDialogFormData } from "@dashboard/components/SaveFilterTabDialog";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  getActiveTabIndexAfterTabDelete,
  getNextUniqueTabName,
} from "@dashboard/products/views/ProductList/utils";
import { StorageUtils } from "@dashboard/utils/filters";
import { prepareQs } from "@dashboard/utils/filters/qs";
import { stringify } from "qs";
import { useState } from "react";

export const useFilterPresets = ({
  params,
  reset,
  storageUtils,
  getUrl,
}: {
  params: Record<string, unknown>;
  reset: () => void;
  getUrl: () => string;
  storageUtils: StorageUtils<string>;
}) => {
  const navigate = useNavigator();
  const baseUrl = getUrl();
  const [presetIdToDelete, setPresetIdToDelete] = useState<number | null>(null);

  const presets = storageUtils.getFilterTabs();

  const selectedPreset =
    params.activeTab !== undefined && typeof params.activeTab === "string"
      ? parseInt(params.activeTab, 10)
      : undefined;

  const onPresetChange = (index: number) => {
    reset();
    const currentPresets = storageUtils.getFilterTabs();
    const qs = new URLSearchParams(currentPresets[index - 1]?.data ?? "");
    qs.append("activeTab", index.toString());

    navigate(
      baseUrl.endsWith("?")
        ? baseUrl + qs.toString()
        : baseUrl + "?" + qs.toString(),
    );
  };

  const onPresetDelete = () => {
    if (!presetIdToDelete) {
      return;
    }

    storageUtils.deleteFilterTab(presetIdToDelete);
    reset();

    // When deleting the current tab, navigate to the All products
    if (presetIdToDelete === selectedPreset || !selectedPreset) {
      navigate(baseUrl);
    } else {
      const currentParams = { ...params };
      // When deleting a tab that is not the current one, only remove the action param from the query
      delete currentParams.action;
      // When deleting a tab that is before the current one, decrease the activeTab param by 1
      currentParams.activeTab = getActiveTabIndexAfterTabDelete(
        selectedPreset,
        presetIdToDelete,
      );
      navigate(
        baseUrl.endsWith("?")
          ? baseUrl + stringify(currentParams)
          : baseUrl + "?" + stringify(currentParams),
      );
    }
  };

  const onPresetSave = (data: SaveFilterTabDialogFormData) => {
    const { paresedQs } = prepareQs(location.search);

    storageUtils.saveFilterTab(
      getNextUniqueTabName(
        data.name,
        presets.map(tab => tab.name),
      ),
      stringify(paresedQs),
    );
    onPresetChange(presets.length + 1);
  };

  const onPresetUpdate = (tabName: string) => {
    const { paresedQs } = prepareQs(location.search);

    storageUtils.updateFilterTab(tabName, stringify(paresedQs));
    onPresetChange(presets.findIndex(tab => tab.name === tabName) + 1);
  };

  const hasPresetsChange = () => {
    const { paresedQs } = prepareQs(location.search);

    if (!selectedPreset) {
      return location.search !== "" && stringify(paresedQs) !== "";
    }

    const activeTab = presets[selectedPreset - 1];

    return (
      activeTab?.data !== stringify(paresedQs) &&
      location.search !== "" &&
      stringify(paresedQs) !== ""
    );
  };

  return {
    presetIdToDelete,
    setPresetIdToDelete,
    presets,
    selectedPreset,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    hasPresetsChange,
  };
};
