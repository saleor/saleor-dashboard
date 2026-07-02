import { PermissionEnum } from "@dashboard/graphql";

import { createSettingsSubmenuItem, showSubmenuSeparator } from "./settingsSubmenuItem";
import { type SidebarMenuItem } from "./types";

describe("showSubmenuSeparator", () => {
  const settingsItem: SidebarMenuItem = {
    id: "product-types",
    label: "Product types",
    type: "item",
    separatorBefore: true,
  };

  it("shows separator when item is not first in submenu", () => {
    // Arrange & Act & Assert
    expect(showSubmenuSeparator(settingsItem, 1)).toBe(true);
  });

  it("hides separator when settings item is first visible submenu entry", () => {
    // Arrange & Act & Assert
    expect(showSubmenuSeparator(settingsItem, 0)).toBe(false);
  });

  it("hides separator when flag is not set", () => {
    // Arrange
    const item: SidebarMenuItem = {
      id: "products",
      label: "Products",
      type: "item",
    };

    // Act & Assert
    expect(showSubmenuSeparator(item, 2)).toBe(false);
  });
});

describe("createSettingsSubmenuItem", () => {
  it("creates a settings-styled submenu item", () => {
    // Arrange & Act
    const item = createSettingsSubmenuItem({
      id: "model-types",
      label: "Model types",
      url: "/model-types/",
      permissions: [PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES],
    });

    // Assert
    expect(item).toMatchObject({
      id: "model-types",
      label: "Model types",
      labelStyle: "settings",
      url: "/model-types/",
      type: "item",
      separatorBefore: true,
      permissions: [PermissionEnum.MANAGE_PAGE_TYPES_AND_ATTRIBUTES],
    });
    expect(item.icon).toBeTruthy();
  });
});
