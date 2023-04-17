import useLocalStorage from "@dashboard/hooks/useLocalStorage";

const COLUMN_PICKER_KEY = "columnPickerConfig";

export type DatagridViews = "PRODUCT_VIEW" | "PRODUCT_DETAILS";

type CustomColumnSettings = {
  [view in DatagridViews]: string[];
};

export const defaultCustomColumns: CustomColumnSettings = {
  PRODUCT_VIEW: [],
  PRODUCT_DETAILS: [],
};

export const useCustomColumnSettings = (view: DatagridViews) => {
  const [config, setConfig] = useLocalStorage(
    COLUMN_PICKER_KEY,
    defaultCustomColumns,
  );

  const setCustomColumnsSettings = (cols: string[]) =>
    setConfig(currentSettings => ({
      ...currentSettings,
      [view]: cols,
    }));

  const customColumnsSettings = config[view];

  return { customColumnsSettings, setCustomColumnsSettings };
};
