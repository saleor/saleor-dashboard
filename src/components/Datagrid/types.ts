import { Theme } from "@glideapps/glide-data-grid";

export interface AvailableColumn {
  id: string;
  title: string;
  width: number;
  group?: string;
  metaGroup?: string | null; // Description for column picker
  // null means that column is not visible in column picker
  pickerTitle?: string;
  hasMenu?: boolean;
  icon?: string;
  themeOverride?: Partial<Theme>;
}
