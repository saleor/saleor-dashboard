import {
  AttributeInputTypeEnum,
  LanguageCodeEnum,
  type ShippingMethodTranslationsQuery,
} from "@dashboard/graphql";

import {
  getGeneralEntityTranslationCompletion,
  getPageTranslationCompletion,
  getProductTranslationCompletion,
  mapTranslationsToEntities,
} from "./utils";

describe("mapTranslationsToEntities", () => {
  it("should return empty array if data is undefined", () => {
    // Arrange
    const data = undefined;

    // Act
    const result = mapTranslationsToEntities(data);

    // Assert
    expect(result).toEqual([]);
  });

  it("should return empty array if translations is undefined", () => {
    // Arrange
    const data = {
      translations: undefined,
    } as unknown as ShippingMethodTranslationsQuery;

    // Act
    const result = mapTranslationsToEntities(data);

    // Assert
    expect(result).toEqual([]);
  });

  it("should return empty array if items is undefined", () => {
    // Arrange
    const data = {
      translations: {
        edges: undefined,
      },
    } as unknown as ShippingMethodTranslationsQuery;

    // Act
    const result = mapTranslationsToEntities(data);

    // Assert
    expect(result).toEqual([]);
  });

  it("should return correct array", () => {
    // Arrange
    const data = {
      translations: {
        edges: [
          {
            node: {
              __typename: "ShippingMethodTranslatableContent",
              translation: {
                name: "name",
                description: JSON.stringify({
                  blocks: [{ type: "paragraph", data: { text: "description" } }],
                }),
              },
              shippingMethod: {
                id: "id",
              },
              name: "name",
            },
          },
        ],
      },
    } as ShippingMethodTranslationsQuery;

    // Act
    const result = mapTranslationsToEntities(data);

    // Assert
    expect(result).toEqual([
      {
        completion: {
          current: 2,
          max: 2,
        },
        id: "id",
        name: "name",
      },
    ]);
  });

  it("skips items without a shipping method id", () => {
    // Arrange
    const data = {
      translations: {
        edges: [
          {
            node: {
              __typename: "ShippingMethodTranslatableContent",
              translation: {
                name: "name",
                description: JSON.stringify({
                  blocks: [{ type: "paragraph", data: { text: "description" } }],
                }),
              },
              name: "name",
            },
          },
        ],
      },
    } as ShippingMethodTranslationsQuery;

    // Act
    const result = mapTranslationsToEntities(data);

    // Assert
    expect(result).toEqual([]);
  });

  it("uses shippingMethodId when shippingMethod is unavailable", () => {
    // Arrange
    const data = {
      translations: {
        edges: [
          {
            node: {
              __typename: "ShippingMethodTranslatableContent",
              translation: null,
              shippingMethodId: "method-id",
              name: "Express",
            },
          },
        ],
      },
    } as ShippingMethodTranslationsQuery;

    // Act
    const result = mapTranslationsToEntities(data);

    // Assert
    expect(result).toEqual([
      {
        completion: { current: 0, max: 2 },
        id: "method-id",
        name: "Express",
      },
    ]);
  });

  it("does not count empty rich text description as complete", () => {
    // Arrange
    const data = {
      translations: {
        edges: [
          {
            node: {
              __typename: "ShippingMethodTranslatableContent",
              translation: {
                name: "Translated name",
                description: JSON.stringify({ blocks: [] }),
              },
              shippingMethod: {
                id: "id",
              },
              name: "name",
            },
          },
        ],
      },
    } as ShippingMethodTranslationsQuery;

    // Act
    const result = mapTranslationsToEntities(data);

    // Assert
    expect(result).toEqual([
      {
        completion: {
          current: 1,
          max: 2,
        },
        id: "id",
        name: "name",
      },
    ]);
  });
});

describe("getGeneralEntityTranslationCompletion", () => {
  it("does not count empty rich text description as complete", () => {
    // Arrange & Act
    const result = getGeneralEntityTranslationCompletion({
      name: "Category",
      description: JSON.stringify({ blocks: [] }),
      seoDescription: null,
      seoTitle: null,
    });

    // Assert
    expect(result).toEqual({ current: 1, max: 4 });
  });
});

describe("getPageTranslationCompletion", () => {
  it("does not count empty rich text content as complete", () => {
    // Arrange & Act
    const result = getPageTranslationCompletion({
      title: "Page title",
      content: JSON.stringify({ blocks: [] }),
      seoDescription: null,
      seoTitle: null,
    });

    // Assert
    expect(result).toEqual({ current: 1, max: 4 });
  });
});

describe("getProductTranslationCompletion", () => {
  it("does not count empty rich text product description as complete", () => {
    // Arrange & Act
    const result = getProductTranslationCompletion({
      translation: {
        __typename: "ProductTranslation",
        id: "t-1",
        name: "Product",
        description: JSON.stringify({ blocks: [] }),
        seoDescription: null,
        seoTitle: null,
        language: { __typename: "LanguageDisplay", code: LanguageCodeEnum.PL, language: "Polish" },
      },
      attributeValues: [],
    });

    // Assert
    expect(result).toEqual({ current: 1, max: 4 });
  });

  it("counts plain text attribute translations toward completion", () => {
    // Arrange & Act
    const result = getProductTranslationCompletion({
      translation: {
        __typename: "ProductTranslation",
        id: "t-1",
        name: "Product",
        description: null,
        seoDescription: null,
        seoTitle: null,
        language: { __typename: "LanguageDisplay", code: LanguageCodeEnum.PL, language: "Polish" },
      },
      attributeValues: [
        {
          __typename: "AttributeValueTranslatableContent",
          id: "av-content-1",
          name: "",
          plainText: null,
          richText: null,
          attributeValue: {
            __typename: "AttributeValue",
            id: "av-1",
            inputType: AttributeInputTypeEnum.PLAIN_TEXT,
          },
          attribute: { __typename: "AttributeTranslatableContent", id: "attr-1", name: "Material" },
          translation: {
            __typename: "AttributeValueTranslation",
            id: "avt-1",
            name: "",
            plainText: "Bawełna",
            richText: null,
            language: {
              __typename: "LanguageDisplay",
              code: LanguageCodeEnum.PL,
              language: "Polish",
            },
          },
        },
      ],
    });

    // Assert
    expect(result).toEqual({ current: 2, max: 5 });
  });

  it("does not count rich text attribute with empty blocks as complete", () => {
    // Arrange & Act
    const result = getProductTranslationCompletion({
      translation: {
        __typename: "ProductTranslation",
        id: "t-1",
        name: null,
        description: null,
        seoDescription: null,
        seoTitle: null,
        language: { __typename: "LanguageDisplay", code: LanguageCodeEnum.PL, language: "Polish" },
      },
      attributeValues: [
        {
          __typename: "AttributeValueTranslatableContent",
          id: "av-content-1",
          name: "",
          plainText: null,
          richText: null,
          attributeValue: {
            __typename: "AttributeValue",
            id: "av-1",
            inputType: AttributeInputTypeEnum.RICH_TEXT,
          },
          attribute: { __typename: "AttributeTranslatableContent", id: "attr-1", name: "Details" },
          translation: {
            __typename: "AttributeValueTranslation",
            id: "avt-1",
            name: "",
            plainText: null,
            richText: JSON.stringify({ blocks: [] }),
            language: {
              __typename: "LanguageDisplay",
              code: LanguageCodeEnum.PL,
              language: "Polish",
            },
          },
        },
      ],
    });

    // Assert
    expect(result).toEqual({ current: 0, max: 5 });
  });
});
