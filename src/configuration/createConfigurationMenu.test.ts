import { PermissionEnum } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import { createConfigurationMenu } from "./createConfigurationMenu";

describe("createConfigurationMenu", () => {
  const intl = createIntl({ locale: "en" });

  it("groups Store first and drops Miscellaneous and peer Refunds card", () => {
    // Arrange / Act
    const menu = createConfigurationMenu(intl);
    const labels = menu.map(section => section.label);
    const allUrls = menu.flatMap(section => section.menuItems.map(item => item.url));

    // Assert
    expect(labels[0]).toBe("Store");
    expect(labels).not.toContain("Miscellaneous");
    expect(allUrls.some(url => url?.includes("refunds-settings"))).toBe(false);
    expect(allUrls.some(url => url?.includes("site-settings"))).toBe(true);
    expect(allUrls.some(url => url?.includes("orders/settings"))).toBe(true);
  });

  it("keeps Orders hub reachable with either orders or settings permission", () => {
    // Arrange / Act
    const ordersSection = createConfigurationMenu(intl).find(section =>
      section.menuItems.some(item => item.testId === "configuration-menu-order-settings"),
    );
    const orderItem = ordersSection?.menuItems.find(
      item => item.testId === "configuration-menu-order-settings",
    );

    // Assert
    expect(orderItem?.permissions).toEqual([
      PermissionEnum.MANAGE_ORDERS,
      PermissionEnum.MANAGE_SETTINGS,
    ]);
  });
});
