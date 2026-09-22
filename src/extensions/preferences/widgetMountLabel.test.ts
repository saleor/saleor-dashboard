import { WIDGET_AVAILABLE_MOUNTS } from "@dashboard/extensions/domain/app-extension-manifest-available-mounts";

import { getWidgetLocationHref, isWidgetMount, widgetMountMessages } from "./widgetMountLabel";

describe("widgetMountLabel", () => {
  it("has a label for every preference-enabled widget mount", () => {
    // Arrange / Act / Assert
    for (const mount of WIDGET_AVAILABLE_MOUNTS) {
      expect(widgetMountMessages[mount]).toBeDefined();
      expect(widgetMountMessages[mount].defaultMessage).toBeTruthy();
    }
  });

  it("accepts known widget mounts and rejects others", () => {
    expect(isWidgetMount("ORDER_DETAILS_WIDGETS")).toBe(true);
    expect(isWidgetMount("NAVIGATION_CATALOG")).toBe(false);
  });

  it("resolves a list or home path for every widget mount", () => {
    for (const mount of WIDGET_AVAILABLE_MOUNTS) {
      expect(getWidgetLocationHref(mount)).toMatch(/^\//);
    }

    expect(getWidgetLocationHref("NAVIGATION_CATALOG")).toBeUndefined();
  });
});
