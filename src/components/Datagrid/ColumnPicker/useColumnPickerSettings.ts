import useLocalStorage from "@dashboard/hooks/useLocalStorage";

const COLUMN_PICKER_KEY = "columnPickerConfig";

export type DatagridViews =
  | "PRODUCT_LIST"
  | "PRODUCT_DETAILS"
  | "ORDER_LIST"
  | "ORDER_DETAILS"
  | "ORDER_DRAFT_DETAILS"
  | "COLLECTION_LIST";

type DynamicColumnSettings = {
  [view in DatagridViews]: string[];
};

export const defaultDynamicColumns: DynamicColumnSettings = {
  PRODUCT_LIST: [],
  PRODUCT_DETAILS: [],
  ORDER_LIST: [],
  ORDER_DETAILS: [],
  ORDER_DRAFT_DETAILS: [],
  COLLECTION_LIST: [],
};

export const useColumnPickerSettings = (view: DatagridViews) => {
  const [config, setConfig] = useLocalStorage(
    COLUMN_PICKER_KEY,
    defaultDynamicColumns,
  );

  const setDynamicColumnsSettings = (cols: string[]) =>
    setConfig(currentSettings => ({
      ...currentSettings,
      [view]: cols,
    }));

  const columnPickerSettings = config[view] ?? [];

  return { columnPickerSettings, setDynamicColumnsSettings };
};
