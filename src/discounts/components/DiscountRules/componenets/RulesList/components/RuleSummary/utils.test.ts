import { categoryUrl } from "@dashboard/categories/urls";
import { collectionUrl } from "@dashboard/collections/urls";
import { type Rule } from "@dashboard/discounts/models";
import { RewardValueTypeEnum } from "@dashboard/graphql";
import { productUrl, productVariantEditUrl } from "@dashboard/products/urls";
import { type DefaultTheme } from "@saleor/macaw-ui-next";

import { type EnrichCondition } from "./components/RuleConditionsChips/useEnrichConditions";
import {
  conditionTypeToHue,
  getConditionEntityUrl,
  hasNoRuleConditions,
  mapConditionToOption,
} from "./utils";

jest.mock("@dashboard/products/urls", () => ({
  productUrl: jest.fn((id: string) => `mock-product-url:${id}`),
  productVariantEditUrl: jest.fn((id: string) => `mock-variant-url:${id}`),
}));

jest.mock("@dashboard/collections/urls", () => ({
  collectionUrl: jest.fn((id: string) => `mock-collection-url:${id}`),
}));

jest.mock("@dashboard/categories/urls", () => ({
  categoryUrl: jest.fn((id: string) => `mock-category-url:${id}`),
}));

const mockRule = (conditions: Rule["conditions"]): Rule => ({
  id: "rule-1",
  name: "Test rule",
  description: null,
  channel: null,
  rewardType: null,
  rewardValue: null,
  rewardValueType: RewardValueTypeEnum.PERCENTAGE,
  rewardGifts: [],
  conditions,
});

describe("hasNoRuleConditions", () => {
  it("returns true when conditions array is empty", () => {
    // Arrange
    const rule = mockRule([]);

    // Act
    const result = hasNoRuleConditions(rule);

    // Assert
    expect(result).toBe(true);
  });

  it("returns true when every condition has no meaningful value length", () => {
    // Arrange
    const rule = mockRule([
      { id: "a", type: "is", value: null },
      { id: "b", type: "is", value: "" },
      { id: "c", type: "is", value: [] },
    ]);

    // Act
    const result = hasNoRuleConditions(rule);

    // Assert
    expect(result).toBe(true);
  });

  it("returns false when at least one condition has a non-empty value", () => {
    // Arrange
    const rule = mockRule([
      { id: "a", type: "is", value: null },
      { id: "b", type: "is", value: "x" },
    ]);

    // Act
    const result = hasNoRuleConditions(rule);

    // Assert
    expect(result).toBe(false);
  });

  it("returns false when a condition has option values", () => {
    // Arrange
    const rule = mockRule([
      {
        id: "product",
        type: "is",
        value: [{ label: "P", value: "id-1" }],
      },
    ]);

    // Act
    const result = hasNoRuleConditions(rule);

    // Assert
    expect(result).toBe(false);
  });
});

describe("getConditionEntityUrl", () => {
  beforeEach(() => {
    (productUrl as jest.Mock).mockClear();
    (productVariantEditUrl as jest.Mock).mockClear();
    (collectionUrl as jest.Mock).mockClear();
    (categoryUrl as jest.Mock).mockClear();
  });

  it("returns undefined when conditionType is missing", () => {
    // Act
    const result = getConditionEntityUrl(undefined, "id-1");

    // Assert
    expect(result).toBeUndefined();
    expect(productUrl).not.toHaveBeenCalled();
  });

  it("returns undefined when entityId is missing", () => {
    // Act
    const result = getConditionEntityUrl("product", undefined);

    // Assert
    expect(result).toBeUndefined();
    expect(productUrl).not.toHaveBeenCalled();
  });

  it("returns undefined for unknown condition types", () => {
    // Act
    const result = getConditionEntityUrl("unknown", "id-1");

    // Assert
    expect(result).toBeUndefined();
  });

  it("delegates to productUrl for product", () => {
    // Act
    const result = getConditionEntityUrl("product", "pid");

    // Assert
    expect(result).toBe("mock-product-url:pid");
    expect(productUrl).toHaveBeenCalledWith("pid");
  });

  it("delegates to collectionUrl for collection", () => {
    // Act
    const result = getConditionEntityUrl("collection", "cid");

    // Assert
    expect(result).toBe("mock-collection-url:cid");
    expect(collectionUrl).toHaveBeenCalledWith("cid");
  });

  it("delegates to categoryUrl for category", () => {
    // Act
    const result = getConditionEntityUrl("category", "catid");

    // Assert
    expect(result).toBe("mock-category-url:catid");
    expect(categoryUrl).toHaveBeenCalledWith("catid");
  });

  it("delegates to productVariantEditUrl for variant", () => {
    // Act
    const result = getConditionEntityUrl("variant", "vid");

    // Assert
    expect(result).toBe("mock-variant-url:vid");
    expect(productVariantEditUrl).toHaveBeenCalledWith("vid");
  });
});

describe("mapConditionToOption", () => {
  it("maps multiselect option arrays to one chip per value", () => {
    // Arrange
    const conditions: EnrichCondition[] = [
      {
        id: "product",
        type: "is",
        value: [
          { label: "Product A", value: "id-a" },
          { label: "Product B", value: "id-b" },
        ],
        inputType: "multiselect",
        label: "Products",
      },
    ];

    // Act
    const result = mapConditionToOption(conditions);

    // Assert
    expect(result).toEqual([
      {
        value: "Product A",
        label: "Products",
        entityId: "id-a",
        conditionType: "product",
      },
      {
        value: "Product B",
        label: "Products",
        entityId: "id-b",
        conditionType: "product",
      },
    ]);
  });

  it("uses condition id as label fallback for multiselect", () => {
    // Arrange
    const conditions: EnrichCondition[] = [
      {
        id: "collection",
        type: "is",
        value: [{ label: "C1", value: "c1" }],
        inputType: "multiselect",
      },
    ];

    // Act
    const result = mapConditionToOption(conditions);

    // Assert
    expect(result[0]?.label).toBe("collection");
  });

  it("maps non-multiselect conditions to a single chip", () => {
    // Arrange
    const conditions: EnrichCondition[] = [
      {
        id: "price",
        type: "greater",
        value: "10.00",
        inputType: "price",
        label: "Price",
      },
    ];

    // Act
    const result = mapConditionToOption(conditions);

    // Assert
    expect(result).toEqual([{ label: "Price", value: "10.00" }]);
  });

  it("returns an empty array for an empty input", () => {
    // Act
    const result = mapConditionToOption([]);

    // Assert
    expect(result).toEqual([]);
  });
});

describe("conditionTypeToHue", () => {
  it("returns pill colors for light theme", () => {
    // Arrange
    const theme: DefaultTheme = "defaultLight";

    // Act
    const result = conditionTypeToHue("product", theme);

    // Assert
    expect(result).toEqual(
      expect.objectContaining({
        base: expect.any(String),
        border: expect.any(String),
        text: expect.any(String),
      }),
    );
  });

  it("returns different colors for dark vs light theme for the same type", () => {
    // Arrange
    const type = "collection";

    // Act
    const light = conditionTypeToHue(type, "defaultLight");
    const dark = conditionTypeToHue(type, "defaultDark");

    // Assert
    expect(light.base).not.toBe(dark.base);
  });
});
