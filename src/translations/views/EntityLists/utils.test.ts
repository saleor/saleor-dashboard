import {
  AttributeInputTypeEnum,
  LanguageCodeEnum,
  type ShippingMethodTranslationsQuery,
} from "@dashboard/graphql";

import { getProductTranslationCompletion, mapTranslationsToEntities } from "./utils";

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
                description: "description",
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

  it("should return empty string when no shipping method", () => {
    // Arrange
    const data = {
      translations: {
        edges: [
          {
            node: {
              __typename: "ShippingMethodTranslatableContent",
              translation: {
                name: "name",
                description: "description",
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
        id: "",
        name: "name",
      },
    ]);
  });
});

describe("getProductTranslationCompletion", () => {
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
});
