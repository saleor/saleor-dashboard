export type MenuItemType = "category" | "collection" | "link" | "page";

export type MenuItemTypeWithOptions = Exclude<MenuItemType, "link">;

export interface MenuItemDialogFormData {
  id?: string;
  name: string;
  linkType: MenuItemType | null;
  linkValue: string;
}
