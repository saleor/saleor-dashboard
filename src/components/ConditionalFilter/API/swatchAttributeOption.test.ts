import { AttributeInputTypeEnum } from "@dashboard/graphql";

import {
  createAttributeChoiceOptionsFromAPI,
  isSwatchAttributeOption,
  isSwatchAttributeType,
} from "./swatchAttributeOption";

describe("isSwatchAttributeType", () => {
  it("matches SWATCH", () => {
    // Arrange & Act & Assert
    expect(isSwatchAttributeType(AttributeInputTypeEnum.SWATCH)).toBe(true);
    expect(isSwatchAttributeType(AttributeInputTypeEnum.DROPDOWN)).toBe(false);
  });
});

describe("isSwatchAttributeOption", () => {
  it("matches a hex or file swatch", () => {
    // Arrange & Act & Assert
    expect(isSwatchAttributeOption({ swatchColor: "#c45c26" })).toBe(true);
    expect(isSwatchAttributeOption({ swatchFileUrl: "https://example.com/swatch.png" })).toBe(true);
    expect(isSwatchAttributeOption({})).toBe(false);
  });
});

describe("createAttributeChoiceOptionsFromAPI", () => {
  it("attaches a hex swatch when present", () => {
    // Arrange
    const edges = [
      {
        node: {
          id: "val-1",
          name: "Dark Orange",
          slug: "dark-orange",
          originalSlug: "dark-orange",
          value: "#c45c26",
        },
      },
    ];

    // Act
    const options = createAttributeChoiceOptionsFromAPI(edges, AttributeInputTypeEnum.SWATCH);

    // Assert
    expect(options).toEqual([
      {
        label: "Dark Orange",
        value: "val-1",
        slug: "dark-orange",
        originalSlug: "dark-orange",
        swatchColor: "#c45c26",
      },
    ]);
  });

  it("attaches a file swatch when present", () => {
    // Arrange
    const edges = [
      {
        node: {
          id: "val-2",
          name: "Plaid",
          slug: "plaid",
          file: { url: "https://example.com/plaid.png" },
        },
      },
    ];

    // Act
    const options = createAttributeChoiceOptionsFromAPI(edges, AttributeInputTypeEnum.SWATCH);

    // Assert
    expect(options).toEqual([
      {
        label: "Plaid",
        value: "val-2",
        slug: "plaid",
        swatchFileUrl: "https://example.com/plaid.png",
      },
    ]);
  });

  it("does not treat leftover value/file as a swatch on dropdown attributes", () => {
    // Arrange
    const edges = [
      {
        node: {
          id: "val-3",
          name: "Cotton",
          slug: "cotton",
          value: "#ffffff",
          file: { url: "https://example.com/cotton.png" },
        },
      },
    ];

    // Act
    const options = createAttributeChoiceOptionsFromAPI(edges, AttributeInputTypeEnum.DROPDOWN);

    // Assert
    expect(options).toEqual([
      {
        label: "Cotton",
        value: "val-3",
        slug: "cotton",
      },
    ]);
  });
});
