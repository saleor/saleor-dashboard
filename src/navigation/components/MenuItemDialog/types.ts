export type MenuItemType = "category" | "collection" | "link" | "page";

export interface MenuItemDialogFormData {
  id?: string;
  name: string;
  linkType: MenuItemType | null;
  linkValue: string;
}
