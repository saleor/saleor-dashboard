import { AttributeEntityTypeEnum } from "@dashboard/graphql";

import {
  createAttributeProductVariantOptionsFromAPI,
  createAttributeProductVariantOptionsFromProductsAPI,
} from "./Handler";
import {
  compareVariantReferenceNames,
  filterVariantReferenceOptions,
  formatVariantReferencePillLabel,
  getVariantReferenceGroups,
  isVariantReferenceEntity,
  isVariantReferenceOption,
  toVariantReferencePill,
} from "./variantReferenceOption";

describe("formatVariantReferencePillLabel", () => {
  it("puts the product on the first line and the variant on the second", () => {
    // Arrange & Act
    const label = formatVariantReferencePillLabel(
      "39",
      "Monospace Tee Lorem ipsum Very Long So I Can Test It",
    );

    // Assert
    expect(label).toBe("Monospace Tee Lorem ipsum Very Long So I Can Test It\n39");
  });

  it("falls back to the part that exists", () => {
    // Arrange & Act & Assert
    expect(formatVariantReferencePillLabel("S")).toBe("S");
    expect(formatVariantReferencePillLabel("", "Darko Polo")).toBe("Darko Polo");
  });
});

describe("compareVariantReferenceNames", () => {
  it("groups variants of the same product", () => {
    // Arrange
    const rows = [
      { productName: "Monospace Tee", variantName: "L" },
      { productName: "Darko Polo", variantName: "M" },
      { productName: "Darko Polo", variantName: "S" },
    ];

    // Act
    const ordered = [...rows].sort(compareVariantReferenceNames);

    // Assert
    expect(ordered.map(row => `${row.productName} / ${row.variantName}`)).toEqual([
      "Darko Polo / M",
      "Darko Polo / S",
      "Monospace Tee / L",
    ]);
  });
});

describe("getVariantReferenceGroups", () => {
  it("puts every variant of a product under a single header", () => {
    // Arrange
    const options = [
      { productName: "Blue Plimsolls", variantName: "42", value: "p-42", productId: "prod-plim" },
      {
        productName: "Blue Polygon Shirt",
        variantName: "M",
        value: "shirt-m",
        productId: "prod-shirt",
      },
      { productName: "Blue Plimsolls", variantName: "40", value: "p-40", productId: "prod-plim" },
      { productName: "Blue Plimsolls", variantName: "36", value: "p-36", productId: "prod-plim" },
    ];

    // Act
    const groups = getVariantReferenceGroups(options);

    // Assert
    expect(
      groups.map(group => [group.productName, group.variants.map(item => item.variantName)]),
    ).toEqual([
      ["Blue Plimsolls", ["36", "40", "42"]],
      ["Blue Polygon Shirt", ["M"]],
    ]);
  });

  it("keeps the first available product thumbnail on the group", () => {
    // Arrange
    const options = [
      { productName: "Darko Polo", variantName: "S", value: "polo-s" },
      {
        productName: "Darko Polo",
        variantName: "M",
        value: "polo-m",
        productThumbnailUrl: "https://example.com/polo.png",
      },
    ];

    // Act
    const groups = getVariantReferenceGroups(options);

    // Assert
    expect(groups).toHaveLength(1);
    expect(groups[0].productThumbnailUrl).toBe("https://example.com/polo.png");
  });

  it("merges variants that share a product id even when names differ slightly", () => {
    // Arrange
    const options = [
      { productName: "Blue Plimsolls", variantName: "40", value: "p-40", productId: "prod-plim" },
      { productName: "Blue  Plimsolls", variantName: "41", value: "p-41", productId: "prod-plim" },
    ];

    // Act
    const groups = getVariantReferenceGroups(options);

    // Assert
    expect(groups).toHaveLength(1);
    expect(groups[0].variants.map(item => item.variantName)).toEqual(["40", "41"]);
  });

  it("builds a non-selectable product header with selectable variants", () => {
    // Arrange
    const options = [
      { productName: "Monospace Tee", variantName: "L", value: "tee-l" },
      { productName: "Darko Polo", variantName: "S", value: "polo-s" },
      { productName: "Darko Polo", variantName: "M", value: "polo-m" },
    ];

    // Act
    const groups = getVariantReferenceGroups(options);

    // Assert
    expect(
      groups.map(group => [group.productName, group.variants.map(item => item.variantName)]),
    ).toEqual([
      ["Darko Polo", ["M", "S"]],
      ["Monospace Tee", ["L"]],
    ]);
  });
});

describe("filterVariantReferenceOptions", () => {
  it("keeps variants when the query matches the product or variant name", () => {
    // Arrange
    const options = [
      { productName: "Monospace Tee", variantName: "L" },
      { productName: "Darko Polo", variantName: "S" },
    ];

    // Act & Assert
    expect(
      filterVariantReferenceOptions(options, "polo").map(option => option.variantName),
    ).toEqual(["S"]);
    expect(filterVariantReferenceOptions(options, "tee").map(option => option.productName)).toEqual(
      ["Monospace Tee"],
    );
  });
});

describe("toVariantReferencePill", () => {
  it("rewrites the label to two lines and keeps the variant id", () => {
    // Arrange
    const option = {
      label: "ignored",
      value: "polo-s",
      productName: "Darko Polo",
      variantName: "S",
    };

    // Act
    const pill = toVariantReferencePill(option);

    // Assert
    expect(pill).toEqual({
      ...option,
      slug: "polo-s",
      label: "Darko Polo\nS",
    });
  });

  it("uses the variant id as slug when the option has none", () => {
    // Arrange
    const option: {
      label: string;
      value: string;
      slug?: string;
      productName: string;
      variantName: string;
    } = {
      label: "ignored",
      value: "UHJvZHVjdFZhcmlhbnQ6MQ==",
      productName: "Darko Polo",
      variantName: "S",
    };

    // Act
    const pill = toVariantReferencePill(option);

    // Assert
    expect(pill.slug).toBe("UHJvZHVjdFZhcmlhbnQ6MQ==");
  });
});

describe("isVariantReferenceEntity", () => {
  it("matches PRODUCT_VARIANT", () => {
    // Arrange & Act & Assert
    expect(isVariantReferenceEntity(AttributeEntityTypeEnum.PRODUCT_VARIANT)).toBe(true);
    expect(isVariantReferenceEntity(AttributeEntityTypeEnum.PRODUCT)).toBe(false);
  });
});

describe("createAttributeProductVariantOptionsFromAPI", () => {
  it("attaches product and variant names and sorts by product", () => {
    // Arrange
    const edges = [
      {
        node: {
          id: "v-tee-l",
          name: "L",
          slug: "tee-l",
          product: {
            id: "prod-tee",
            name: "Monospace Tee",
            thumbnail: { url: "https://example.com/tee.png" },
          },
        },
      },
      {
        node: {
          id: "v-polo-s",
          name: "S",
          slug: "polo-s",
          product: { id: "prod-polo", name: "Darko Polo" },
        },
      },
      {
        node: {
          id: "v-polo-m",
          name: "M",
          slug: "polo-m",
          product: { id: "prod-polo", name: "Darko Polo" },
        },
      },
    ];

    // Act
    const options = createAttributeProductVariantOptionsFromAPI(edges);

    // Assert
    expect(options).toEqual([
      {
        label: "Darko Polo\nM",
        value: "v-polo-m",
        slug: "polo-m",
        originalSlug: undefined,
        productName: "Darko Polo",
        variantName: "M",
        productId: "prod-polo",
      },
      {
        label: "Darko Polo\nS",
        value: "v-polo-s",
        slug: "polo-s",
        originalSlug: undefined,
        productName: "Darko Polo",
        variantName: "S",
        productId: "prod-polo",
      },
      {
        label: "Monospace Tee\nL",
        value: "v-tee-l",
        slug: "tee-l",
        originalSlug: undefined,
        productName: "Monospace Tee",
        variantName: "L",
        productId: "prod-tee",
        productThumbnailUrl: "https://example.com/tee.png",
      },
    ]);
  });
});

describe("createAttributeProductVariantOptionsFromProductsAPI", () => {
  it("emits every variant of a product with the same product id", () => {
    // Arrange
    const edges = [
      {
        node: {
          id: "prod-plim",
          name: "Blue Plimsolls",
          thumbnail: { url: "https://example.com/plim.png" },
          productVariants: {
            edges: [
              { node: { id: "v-40", name: "40" } },
              { node: { id: "v-41", name: "41" } },
              { node: { id: "v-42", name: "42" } },
            ],
          },
        },
      },
    ];

    // Act
    const options = createAttributeProductVariantOptionsFromProductsAPI(edges);

    // Assert
    expect(
      options.map(option => [option.productId, option.variantName, option.productThumbnailUrl]),
    ).toEqual([
      ["prod-plim", "40", "https://example.com/plim.png"],
      ["prod-plim", "41", "https://example.com/plim.png"],
      ["prod-plim", "42", "https://example.com/plim.png"],
    ]);
    expect(getVariantReferenceGroups(options.filter(isVariantReferenceOption))).toHaveLength(1);
  });
});
