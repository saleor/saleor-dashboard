import { PermissionEnum } from "@dashboard/graphql";
import { createIntl } from "react-intl";

import { createConfigurationMenu } from "./createConfigurationMenu";

describe("createConfigurationMenu", () => {
  const intl = createIntl({ locale: "en" });

  it("orders groups by merchant job and drops legacy labels", () => {
    // Arrange / Act
    const menu = createConfigurationMenu(intl);
    const labels = menu.map(section => section.label);
    const allUrls = menu.flatMap(section => section.menuItems.map(item => item.url));

    // Assert
    expect(labels).toEqual([
      "Store",
      "Markets & channels",
      "Products & catalog",
      "Content",
      "Shipping & delivery",
      "Orders",
      "Users & permissions",
    ]);
    expect(labels).not.toContain("Miscellaneous");
    expect(labels).not.toContain("Product Settings");
    expect(labels).not.toContain("Tax Settings");
    expect(labels).not.toContain("Multichannel");
    expect(allUrls.some(url => url?.includes("refunds-settings"))).toBe(false);
    expect(allUrls.some(url => url?.includes("site-settings"))).toBe(true);
    expect(allUrls.some(url => url?.includes("orders/settings"))).toBe(true);
  });

  it("places channels and taxes under Markets & channels", () => {
    // Arrange / Act
    const markets = createConfigurationMenu(intl).find(
      section => section.label === "Markets & channels",
    );
    const testIds = markets?.menuItems.map(item => item.testId);

    // Assert
    expect(testIds).toEqual(["configuration-menu-channels", "configuration-menu-taxes"]);
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
