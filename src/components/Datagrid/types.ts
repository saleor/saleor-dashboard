import { Theme } from "@glideapps/glide-data-grid";

export interface AvailableColumn {
  id: string;
  title: string;
  width: number;
  group?: string;
  metaGroup?: string; // Description for column picker
  pickerTitle?: string;
  hasMenu?: boolean;
  icon?: string;
  themeOverride?: Partial<Theme>;
  action?: (id: string) => boolean;
}
