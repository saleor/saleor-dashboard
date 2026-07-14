import {
  aggregateCounts,
  DEFAULT_MODEL_TYPE_TAB_SEPARATOR,
  getGroupTabId,
  groupModelTypeTabs,
  isGroupAllSelected,
  isModelTabNodeActive,
  parseModelTypeTabSeparators,
  resolveActiveTabCountKey,
} from "./groupModelTypeTabs";

describe("parseModelTypeTabSeparators", () => {
  it("returns no separators when input is empty", () => {
    // Arrange
    const value = "";

    // Act
    const result = parseModelTypeTabSeparators(value);

    // Assert
    expect(result).toEqual([]);
  });

  it("parses the default separator input value", () => {
    // Arrange
    const value = DEFAULT_MODEL_TYPE_TAB_SEPARATOR;

    // Act
    const result = parseModelTypeTabSeparators(value);

    // Assert
    expect(result).toEqual(["—", ":", "-"]);
  });

  it("returns no separators when input is whitespace only", () => {
    // Arrange
    const value = "   ";

    // Act
    const result = parseModelTypeTabSeparators(value);

    // Assert
    expect(result).toEqual([]);
  });

  it("ignores a trailing comma after a single separator", () => {
    // Arrange
    const value = "—,";

    // Act
    const result = parseModelTypeTabSeparators(value);

    // Assert
    expect(result).toEqual(["—"]);
  });
});

describe("groupModelTypeTabs", () => {
  const defaultGrouping = { separator: " - " };
  const storefrontTypes = [
    { id: "cart", name: "Storefront - Cart" },
    { id: "checkout", name: "Storefront - Checkout" },
    { id: "chrome", name: "Storefront - Chrome" },
  ];

  it("returns empty array for empty input", () => {
    // Arrange
    const pageTypes: Array<{ id: string; name: string }> = [];

    // Act
    const result = groupModelTypeTabs(pageTypes, defaultGrouping);

    // Assert
    expect(result).toEqual([]);
  });

  it("groups a single prefixed type into a group tab", () => {
    // Arrange
    const pageTypes = [
      { id: "article", name: "Storefront - Article" },
      { id: "legal", name: "Legal" },
    ];

    // Act
    const result = groupModelTypeTabs(pageTypes, defaultGrouping);

    // Assert
    expect(result).toEqual([
      {
        kind: "group",
        id: getGroupTabId("Storefront"),
        prefix: "Storefront",
        subtypes: [{ id: "article", name: "Storefront - Article", suffix: "Article" }],
      },
      { kind: "type", id: "legal", name: "Legal" },
    ]);
  });

  it("groups two or more types that share a prefix", () => {
    // Arrange
    const pageTypes = [
      { id: "article", name: "Article" },
      ...storefrontTypes,
      { id: "legal", name: "Legal" },
    ];

    // Act
    const result = groupModelTypeTabs(pageTypes, defaultGrouping);

    // Assert
    expect(result).toEqual([
      { kind: "type", id: "article", name: "Article" },
      {
        kind: "group",
        id: getGroupTabId("Storefront"),
        prefix: "Storefront",
        subtypes: [
          { id: "cart", name: "Storefront - Cart", suffix: "Cart" },
          { id: "checkout", name: "Storefront - Checkout", suffix: "Checkout" },
          { id: "chrome", name: "Storefront - Chrome", suffix: "Chrome" },
        ],
      },
      { kind: "type", id: "legal", name: "Legal" },
    ]);
  });

  it("preserves API sort order when emitting groups", () => {
    // Arrange
    const pageTypes = [
      { id: "checkout", name: "Storefront - Checkout" },
      { id: "article", name: "Article" },
      { id: "cart", name: "Storefront - Cart" },
    ];

    // Act
    const result = groupModelTypeTabs(pageTypes, defaultGrouping);

    // Assert
    expect(result.map(node => (node.kind === "group" ? node.prefix : node.name))).toEqual([
      "Storefront",
      "Article",
    ]);
  });

  it("leaves names without the separator as standalone tabs", () => {
    // Arrange
    const pageTypes = [
      { id: "article", name: "Article" },
      { id: "legal", name: "Legal" },
    ];

    // Act
    const result = groupModelTypeTabs(pageTypes, defaultGrouping);

    // Assert
    expect(result).toEqual([
      { kind: "type", id: "article", name: "Article" },
      { kind: "type", id: "legal", name: "Legal" },
    ]);
  });

  it("returns standalone tabs when no separators are configured", () => {
    // Arrange
    const pageTypes = storefrontTypes;

    // Act
    const result = groupModelTypeTabs(pageTypes, { separator: "" });

    // Assert
    expect(result).toEqual(
      storefrontTypes.map(pageType => ({
        kind: "type",
        id: pageType.id,
        name: pageType.name,
      })),
    );
  });

  it("supports a custom separator", () => {
    // Arrange
    const pageTypes = [
      { id: "cart", name: "Storefront | Cart" },
      { id: "checkout", name: "Storefront | Checkout" },
    ];

    // Act
    const result = groupModelTypeTabs(pageTypes, { separator: " | " });

    // Assert
    expect(result).toEqual([
      {
        kind: "group",
        id: getGroupTabId("Storefront"),
        prefix: "Storefront",
        subtypes: [
          { id: "cart", name: "Storefront | Cart", suffix: "Cart" },
          { id: "checkout", name: "Storefront | Checkout", suffix: "Checkout" },
        ],
      },
    ]);
  });

  it("returns standalone tabs when grouping is disabled", () => {
    // Arrange
    const pageTypes = storefrontTypes;

    // Act
    const result = groupModelTypeTabs(pageTypes, { enabled: false });

    // Assert
    expect(result).toEqual(
      storefrontTypes.map(pageType => ({
        kind: "type",
        id: pageType.id,
        name: pageType.name,
      })),
    );
  });

  it("groups prefixes case-insensitively", () => {
    // Arrange
    const pageTypes = [
      { id: "bulk-1", name: "a page type to be bulk deleted 1/2" },
      { id: "bulk-2", name: "A page type to be bulk deleted 2/2" },
      { id: "edited", name: "A page type to be edited" },
    ];

    // Act
    const result = groupModelTypeTabs(pageTypes, { separator: "type to" });

    // Assert
    expect(result).toEqual([
      {
        kind: "group",
        id: getGroupTabId("a page"),
        prefix: "a page",
        subtypes: [
          {
            id: "bulk-1",
            name: "a page type to be bulk deleted 1/2",
            suffix: "be bulk deleted 1/2",
          },
          {
            id: "bulk-2",
            name: "A page type to be bulk deleted 2/2",
            suffix: "be bulk deleted 2/2",
          },
          { id: "edited", name: "A page type to be edited", suffix: "be edited" },
        ],
      },
    ]);
  });

  it("uses the default separator constant", () => {
    // Arrange
    const pageTypes = storefrontTypes.slice(0, 2);

    // Act
    const result = groupModelTypeTabs(pageTypes, { separator: DEFAULT_MODEL_TYPE_TAB_SEPARATOR });

    // Assert
    expect(result[0]).toMatchObject({ kind: "group", prefix: "Storefront" });
  });

  it("supports multiple comma-separated separators in one string", () => {
    // Arrange
    const pageTypes = [
      { id: "dash", name: "Storefront - Cart" },
      { id: "colon", name: "Storefront: Checkout" },
      { id: "marketing", name: "Marketing: Blog" },
    ];

    // Act
    const result = groupModelTypeTabs(pageTypes, { separator: " - , :" });

    // Assert
    expect(result).toEqual([
      {
        kind: "group",
        id: getGroupTabId("Storefront"),
        prefix: "Storefront",
        subtypes: [
          { id: "dash", name: "Storefront - Cart", suffix: "Cart" },
          { id: "colon", name: "Storefront: Checkout", suffix: "Checkout" },
        ],
      },
      {
        kind: "group",
        id: getGroupTabId("Marketing"),
        prefix: "Marketing",
        subtypes: [{ id: "marketing", name: "Marketing: Blog", suffix: "Blog" }],
      },
    ]);
  });

  it("treats a comma-containing value as one separator when it is not a list", () => {
    // Arrange
    const pageTypes = [{ id: "page", name: "Price, low to high" }];

    // Act
    const result = groupModelTypeTabs(pageTypes, { separator: ", " });

    // Assert
    expect(result).toEqual([
      {
        kind: "group",
        id: getGroupTabId("Price"),
        prefix: "Price",
        subtypes: [{ id: "page", name: "Price, low to high", suffix: "low to high" }],
      },
    ]);
  });

  it("supports free-text separators in a comma-separated list", () => {
    // Arrange
    const pageTypes = [
      { id: "bulk-1", name: "a page type to be bulk deleted 1/2" },
      { id: "dash", name: "Storefront - Cart" },
    ];

    // Act
    const result = groupModelTypeTabs(pageTypes, { separator: " - , type to" });

    // Assert
    expect(result).toEqual([
      {
        kind: "group",
        id: getGroupTabId("a page"),
        prefix: "a page",
        subtypes: [
          {
            id: "bulk-1",
            name: "a page type to be bulk deleted 1/2",
            suffix: "be bulk deleted 1/2",
          },
        ],
      },
      {
        kind: "group",
        id: getGroupTabId("Storefront"),
        prefix: "Storefront",
        subtypes: [{ id: "dash", name: "Storefront - Cart", suffix: "Cart" }],
      },
    ]);
  });

  it("groups types when a trailing comma is entered after the separator", () => {
    // Arrange
    const pageTypes = [{ id: "cart", name: "Storefront — Cart" }];

    // Act
    const result = groupModelTypeTabs(pageTypes, { separator: "—," });

    // Assert
    expect(result).toEqual([
      {
        kind: "group",
        id: getGroupTabId("Storefront"),
        prefix: "Storefront",
        subtypes: [{ id: "cart", name: "Storefront — Cart", suffix: "Cart" }],
      },
    ]);
  });

  it("uses the leftmost separator match when multiple separators are configured", () => {
    // Arrange
    const pageTypes = [{ id: "page", name: "Storefront - Cart: Promo" }];

    // Act
    const result = groupModelTypeTabs(pageTypes, { separator: " - , :" });

    // Assert
    expect(result).toEqual([
      {
        kind: "group",
        id: getGroupTabId("Storefront"),
        prefix: "Storefront",
        subtypes: [{ id: "page", name: "Storefront - Cart: Promo", suffix: "Cart: Promo" }],
      },
    ]);
  });

  it("prefers a longer separator when matches start at the same index", () => {
    // Arrange
    const pageTypes = [{ id: "page", name: "Storefront - Cart" }];

    // Act
    const result = groupModelTypeTabs(pageTypes, { separator: "- ,  - " });

    // Assert
    expect(result).toEqual([
      {
        kind: "group",
        id: getGroupTabId("Storefront"),
        prefix: "Storefront",
        subtypes: [{ id: "page", name: "Storefront - Cart", suffix: "Cart" }],
      },
    ]);
  });
});

describe("group tab helpers", () => {
  const group = {
    kind: "group" as const,
    id: getGroupTabId("Storefront"),
    prefix: "Storefront",
    subtypes: [
      { id: "cart", name: "Storefront - Cart", suffix: "Cart" },
      { id: "checkout", name: "Storefront - Checkout", suffix: "Checkout" },
    ],
  };

  it("detects when all subtypes in a group are selected", () => {
    // Arrange
    const selectedIds = ["cart", "checkout"];

    // Act
    const result = isGroupAllSelected(group, selectedIds);

    // Assert
    expect(result).toBe(true);
  });

  it("rejects duplicate ids in selectedIds", () => {
    // Arrange
    const selectedIds = ["cart", "cart"];

    // Act
    const result = isGroupAllSelected(group, selectedIds);

    // Assert
    expect(result).toBe(false);
  });

  it("detects active standalone and grouped selections", () => {
    // Arrange
    const standalone = { kind: "type" as const, id: "article", name: "Article" };

    // Act
    const standaloneActive = isModelTabNodeActive(standalone, ["article"]);
    const groupAllActive = isModelTabNodeActive(group, ["cart", "checkout"]);
    const subtypeActive = isModelTabNodeActive(group, ["cart"]);

    // Assert
    expect(standaloneActive).toBe(true);
    expect(groupAllActive).toBe(true);
    expect(subtypeActive).toBe(true);
  });

  it("aggregates subtype counts for a group", () => {
    // Arrange
    const counts = {
      cart: { value: 2, hasMore: false },
      checkout: { value: 3, hasMore: true },
    };

    // Act
    const result = aggregateCounts(["cart", "checkout"], counts);

    // Assert
    expect(result).toEqual({ value: 5, hasMore: true });
  });

  it("resolves the active count key for a grouped selection", () => {
    // Arrange
    const pageTypes = [
      { id: "cart", name: "Storefront - Cart" },
      { id: "checkout", name: "Storefront - Checkout" },
    ];

    // Act
    const result = resolveActiveTabCountKey(["cart", "checkout"], pageTypes, { separator: " - " });

    // Assert
    expect(result).toBe(getGroupTabId("Storefront"));
  });
});
