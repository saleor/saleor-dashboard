import { type SaveFilterTabDialogFormData } from "@dashboard/components/SaveFilterTabDialog";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  getActiveTabIndexAfterTabDelete,
  getNextUniqueTabName,
} from "@dashboard/products/views/ProductList/utils";
import { type GetFilterTabsOutput, type StorageUtils } from "@dashboard/utils/filters";
import { prepareQs } from "@dashboard/utils/filters/qs";
import { stringify } from "qs";
import { useState } from "react";

export interface UseFilterPresets {
  presetIdToDelete: number | null;
  setPresetIdToDelete: React.Dispatch<React.SetStateAction<number | null>>;
  presets: GetFilterTabsOutput<string>;
  builtInPresetCount: number;
  selectedPreset: number | undefined;
  onPresetChange: (index: number) => void;
  onPresetDelete: () => void;
  onPresetSave: (data: SaveFilterTabDialogFormData) => void;
  onPresetUpdate: (tabName: string) => void;
  getPresetNameToDelete: () => string;
  hasPresetsChanged: () => boolean;
}

export const useFilterPresets = <T extends { activeTab?: string; action?: string }>({
  params,
  reset,
  storageUtils,
  getUrl,
  builtInPresets = [],
}: {
  params: T;
  reset?: () => void;
  getUrl: () => string;
  storageUtils: StorageUtils<string>;
  builtInPresets?: GetFilterTabsOutput<string>;
}): UseFilterPresets => {
  const navigate = useNavigator();
  const baseUrl = getUrl();
  const [presetIdToDelete, setPresetIdToDelete] = useState<number | null>(null);
  const customPresets = storageUtils.getFilterTabs();
  const builtInPresetCount = builtInPresets.length;
  const getAllPresets = () => [...builtInPresets, ...storageUtils.getFilterTabs()];
  const selectedPreset =
    params.activeTab !== undefined && typeof params.activeTab === "string"
      ? parseInt(params.activeTab, 10)
      : undefined;
  const onPresetChange = (index: number) => {
    reset?.();

    const allPresets = getAllPresets();
    const qs = new URLSearchParams(allPresets[index - 1]?.data ?? "");

    qs.append("activeTab", index.toString());
    navigate(baseUrl.endsWith("?") ? baseUrl + qs.toString() : baseUrl + "?" + qs.toString());
  };
  const onPresetDelete = () => {
    if (!presetIdToDelete || presetIdToDelete <= builtInPresetCount) {
      return;
    }

    const customPresetId = presetIdToDelete - builtInPresetCount;

    storageUtils.deleteFilterTab(customPresetId);
    reset?.();

    // When deleting the current tab, navigate to the All products
    if (presetIdToDelete === selectedPreset || !selectedPreset) {
      navigate(baseUrl);
    } else {
      const currentParams = { ...params };

      // When deleting a tab that is not the current one, only remove the action param from the query
      delete currentParams.action;
      // When deleting a tab that is before the current one, decrease the activeTab param by 1
      currentParams.activeTab = getActiveTabIndexAfterTabDelete(selectedPreset, presetIdToDelete);
      navigate(
        baseUrl.endsWith("?")
          ? baseUrl + stringify(currentParams)
          : baseUrl + "?" + stringify(currentParams),
      );
    }
  };
  const onPresetSave = (data: SaveFilterTabDialogFormData) => {
    const { parsedQs } = prepareQs(location.search);
    const currentCustomPresets = storageUtils.getFilterTabs();

    storageUtils.saveFilterTab(
      getNextUniqueTabName(data.name, [
        ...builtInPresets.map(tab => tab.name),
        ...currentCustomPresets.map(tab => tab.name),
      ]),
      stringify(parsedQs),
    );
    onPresetChange(builtInPresetCount + currentCustomPresets.length + 1);
  };
  const onPresetUpdate = (tabName: string) => {
    const { parsedQs } = prepareQs(location.search);
    const currentCustomPresets = storageUtils.getFilterTabs();

    storageUtils.updateFilterTab(tabName, stringify(parsedQs));
    onPresetChange(
      builtInPresetCount + currentCustomPresets.findIndex(tab => tab.name === tabName) + 1,
    );
  };
  const hasPresetsChanged = () => {
    const { parsedQs } = prepareQs(location.search);

    if (!selectedPreset) {
      return location.search !== "" && stringify(parsedQs) !== "";
    }

    const activeTab = getAllPresets()[selectedPreset - 1];

    return (
      activeTab?.data !== stringify(parsedQs) &&
      location.search !== "" &&
      stringify(parsedQs) !== ""
    );
  };
  const getPresetNameToDelete = (): string => {
    const customPresetIndex = presetIdToDelete ? presetIdToDelete - builtInPresetCount - 1 : 0;
    const preset = customPresets?.[customPresetIndex];

    return preset?.name ?? "...";
  };

  return {
    presetIdToDelete,
    setPresetIdToDelete,
    getPresetNameToDelete,
    presets: customPresets,
    builtInPresetCount,
    selectedPreset,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    hasPresetsChanged,
  };
};
