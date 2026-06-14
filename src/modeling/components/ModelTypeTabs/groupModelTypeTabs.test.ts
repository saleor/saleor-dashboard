import {
  aggregateCounts,
  DEFAULT_MODEL_TYPE_TAB_SEPARATOR,
  getGroupTabId,
  groupModelTypeTabs,
  isGroupAllSelected,
  isModelTabNodeActive,
  resolveActiveTabCountKey,
} from "./groupModelTypeTabs";

describe("groupModelTypeTabs", () => {
  const storefrontTypes = [
    { id: "cart", name: "Storefront — Cart" },
    { id: "checkout", name: "Storefront — Checkout" },
    { id: "chrome", name: "Storefront — Chrome" },
  ];

  it("returns empty array for empty input", () => {
    // Arrange
    const pageTypes: Array<{ id: string; name: string }> = [];

    // Act
    const result = groupModelTypeTabs(pageTypes);

    // Assert
    expect(result).toEqual([]);
  });

  it("keeps a single prefixed type as a standalone tab", () => {
    // Arrange
    const pageTypes = [
      { id: "article", name: "Storefront — Article" },
      { id: "legal", name: "Legal" },
    ];

    // Act
    const result = groupModelTypeTabs(pageTypes);

    // Assert
    expect(result).toEqual([
      { kind: "type", id: "article", name: "Storefront — Article" },
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
    const result = groupModelTypeTabs(pageTypes);

    // Assert
    expect(result).toEqual([
      { kind: "type", id: "article", name: "Article" },
      {
        kind: "group",
        id: getGroupTabId("Storefront"),
        prefix: "Storefront",
        subtypes: [
          { id: "cart", name: "Storefront — Cart", suffix: "Cart" },
          { id: "checkout", name: "Storefront — Checkout", suffix: "Checkout" },
          { id: "chrome", name: "Storefront — Chrome", suffix: "Chrome" },
        ],
      },
      { kind: "type", id: "legal", name: "Legal" },
    ]);
  });

  it("preserves API sort order when emitting groups", () => {
    // Arrange
    const pageTypes = [
      { id: "checkout", name: "Storefront — Checkout" },
      { id: "article", name: "Article" },
      { id: "cart", name: "Storefront — Cart" },
    ];

    // Act
    const result = groupModelTypeTabs(pageTypes);

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
    const result = groupModelTypeTabs(pageTypes);

    // Assert
    expect(result).toEqual([
      { kind: "type", id: "article", name: "Article" },
      { kind: "type", id: "legal", name: "Legal" },
    ]);
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

  it("uses the default separator constant", () => {
    // Arrange
    const pageTypes = storefrontTypes.slice(0, 2);

    // Act
    const result = groupModelTypeTabs(pageTypes, { separator: DEFAULT_MODEL_TYPE_TAB_SEPARATOR });

    // Assert
    expect(result[0]).toMatchObject({ kind: "group", prefix: "Storefront" });
  });
});

describe("group tab helpers", () => {
  const group = {
    kind: "group" as const,
    id: getGroupTabId("Storefront"),
    prefix: "Storefront",
    subtypes: [
      { id: "cart", name: "Storefront — Cart", suffix: "Cart" },
      { id: "checkout", name: "Storefront — Checkout", suffix: "Checkout" },
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
      { id: "cart", name: "Storefront — Cart" },
      { id: "checkout", name: "Storefront — Checkout" },
    ];

    // Act
    const result = resolveActiveTabCountKey(["cart", "checkout"], pageTypes);

    // Assert
    expect(result).toBe(getGroupTabId("Storefront"));
  });
});
