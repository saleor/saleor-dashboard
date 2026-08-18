import { type SidebarMenuItem } from "@dashboard/components/Sidebar/menu/types";

import { injectNavigationPins } from "./injectNavigationPins";
import { type ResolvedNavigationPin } from "./types";

const options = { favoritesLabel: "Favorites", favoritesIcon: null };

const pin = (overrides: Partial<ResolvedNavigationPin> = {}): ResolvedNavigationPin => ({
  id: "type-1",
  target: "products",
  name: "Blog Post",
  scope: "user",
  ...overrides,
});

const catalog: SidebarMenuItem = {
  id: "products",
  label: "Catalog",
  type: "itemGroup",
  children: [{ id: "existing", label: "Products", type: "item" }],
};

describe("injectNavigationPins", () => {
  it("returns the menu untouched when there are no pins", () => {
    // Act
    const result = injectNavigationPins([catalog], [], options);

    // Assert
    expect(result).toEqual([catalog]);
  });

  it("appends pins after a section's existing children", () => {
    // Act
    const result = injectNavigationPins([catalog], [pin()], options);

    // Assert
    expect(result[0].children?.map(child => child.label)).toEqual(["Products", "Blog Post"]);
  });

  it("keeps settings sub-items last, inserting pins above them", () => {
    // Arrange
    const catalogWithSettings: SidebarMenuItem = {
      ...catalog,
      children: [
        { id: "existing", label: "Products", type: "item" },
        { id: "product-types", label: "Product Types", type: "item", labelStyle: "settings" },
      ],
    };

    // Act
    const result = injectNavigationPins([catalogWithSettings], [pin()], options);

    // Assert
    expect(result[0].children?.map(child => child.label)).toEqual([
      "Products",
      "Blog Post",
      "Product Types",
    ]);
  });

  it("promotes a plain item to a group so its pins render", () => {
    // Arrange
    const translations: SidebarMenuItem = {
      id: "translations",
      label: "Translations",
      type: "item",
    };

    // Act
    const result = injectNavigationPins([translations], [pin({ target: "translations" })], options);

    // Assert
    expect(result[0].type).toBe("itemGroup");
    expect(result[0].children).toHaveLength(1);
  });

  it("puts Favorites first, above everything else", () => {
    // Act
    const result = injectNavigationPins([catalog], [pin({ target: "favorites" })], options);

    // Assert
    expect(result.map(item => item.id)).toEqual(["navigation-pin-favorites-section", "products"]);
  });

  it("omits Favorites entirely when nothing targets it", () => {
    // Act
    const result = injectNavigationPins([catalog], [pin()], options);

    // Assert
    expect(result.map(item => item.id)).toEqual(["products"]);
  });

  it("gates every pin on MANAGE_PAGES so it cannot become a dead link", () => {
    // Act
    const result = injectNavigationPins([catalog], [pin()], options);

    // Assert
    expect(result[0].children?.[1].permissions).toEqual(["MANAGE_PAGES"]);
  });

  it("links a pin to the model list filtered by that model type", () => {
    // Act
    const result = injectNavigationPins([catalog], [pin()], options);

    // Assert
    expect(result[0].children?.[1].url).toContain("type-1");
  });
});
