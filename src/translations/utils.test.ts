import {
  AttributeInputTypeEnum,
  type AttributeTranslationDetailsFragment,
  type AttributeValueTranslatableFragment,
} from "@dashboard/graphql";
import { type IntlShape } from "react-intl";

import { TranslationInputFieldName } from "./types";
import {
  getAttributeValueTranslationsInputData,
  getParsedTranslationInputData,
  getTranslationFields,
  mapAttributeValuesToTranslationFields,
} from "./utils";

const mockIntl: IntlShape = {
  formatMessage: ({ defaultMessage }: { defaultMessage?: string }) => defaultMessage ?? "",
} as IntlShape;

describe("getParsedTranslationInputData", () => {
  it("returns raw string for non-parseable field names", () => {
    // Arrange & Act
    const result = getParsedTranslationInputData({
      fieldName: TranslationInputFieldName.name,
      data: "some name",
    });

    // Assert
    expect(result).toEqual({ name: "some name" });
  });

  it("returns raw string for seoTitle field", () => {
    // Arrange & Act
    const result = getParsedTranslationInputData({
      fieldName: TranslationInputFieldName.seoTitle,
      data: "SEO Title",
    });

    // Assert
    expect(result).toEqual({ seoTitle: "SEO Title" });
  });
});

describe("getTranslationFields", () => {
  it("returns empty array when fields have no edges", () => {
    // Arrange
    const fields: NonNullable<
      NonNullable<AttributeTranslationDetailsFragment["attribute"]>["choices"]
    > = {
      __typename: "AttributeValueCountableConnection",
      pageInfo: {
        __typename: "PageInfo",
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
      },
      edges: [],
    };

    // Act
    const result = getTranslationFields(fields, mockIntl);

    // Assert
    expect(result).toEqual([]);
  });

  it("maps attribute choices to translation fields", () => {
    // Arrange
    const fields: NonNullable<
      NonNullable<AttributeTranslationDetailsFragment["attribute"]>["choices"]
    > = {
      __typename: "AttributeValueCountableConnection",
      pageInfo: {
        __typename: "PageInfo",
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
      },
      edges: [
        {
          __typename: "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue",
            id: "val-1",
            name: "Red",
            plainText: null,
            richText: null,
            inputType: AttributeInputTypeEnum.DROPDOWN,
            translation: {
              __typename: "AttributeValueTranslation",
              id: "trans-1",
              name: "Czerwony",
              plainText: null,
              richText: null,
            },
          },
        },
      ],
    };

    // Act
    const result = getTranslationFields(fields, mockIntl);

    // Assert
    expect(result).toEqual([
      {
        displayName: expect.any(String),
        name: "attributeValue:val-1",
        translation: "Czerwony",
        type: "short",
        value: "Red",
      },
    ]);
  });

  it("returns null translation when translation is missing", () => {
    // Arrange
    const fields: NonNullable<
      NonNullable<AttributeTranslationDetailsFragment["attribute"]>["choices"]
    > = {
      __typename: "AttributeValueCountableConnection",
      pageInfo: {
        __typename: "PageInfo",
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
      },
      edges: [
        {
          __typename: "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue",
            id: "val-2",
            name: "Blue",
            plainText: null,
            richText: null,
            inputType: AttributeInputTypeEnum.DROPDOWN,
            translation: null,
          },
        },
      ],
    };

    // Act
    const result = getTranslationFields(fields, mockIntl);

    // Assert
    expect(result[0].translation).toBeNull();
  });
});

describe("mapAttributeValuesToTranslationFields", () => {
  const makeAttrValue = (
    overrides: Partial<AttributeValueTranslatableFragment>,
  ): AttributeValueTranslatableFragment =>
    ({
      __typename: "AttributeValueTranslatableContent",
      attributeValue: { __typename: "AttributeValue", id: "av-1" },
      attribute: { __typename: "AttributeTranslatableContent", id: "attr-1", name: "Color" },
      name: "color-value",
      richText: null,
      plainText: null,
      translation: null,
      ...overrides,
    }) as AttributeValueTranslatableFragment;

  it("maps attribute values with rich text", () => {
    // Arrange
    const attributeValues = [
      makeAttrValue({
        richText: '{"blocks":[]}',
        translation: {
          __typename: "AttributeValueTranslation",
          id: "t-1",
          name: "",
          richText: '{"blocks":[{"text":"translated"}]}',
          plainText: null,
        } as AttributeValueTranslatableFragment["translation"],
      }),
    ];

    // Act
    const result = mapAttributeValuesToTranslationFields(attributeValues, mockIntl);

    // Assert
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: "av-1",
        name: "color-value",
        type: "rich",
        value: '{"blocks":[]}',
        translation: '{"blocks":[{"text":"translated"}]}',
      }),
    );
  });

  it("maps attribute values with plain text", () => {
    // Arrange
    const attributeValues = [
      makeAttrValue({
        attributeValue: { __typename: "AttributeValue", id: "av-2" },
        attribute: { __typename: "AttributeTranslatableContent", id: "attr-2", name: "Size" },
        name: "size-value",
        plainText: "Large",
        translation: {
          __typename: "AttributeValueTranslation",
          id: "t-2",
          name: "",
          richText: null,
          plainText: "Duży",
        } as AttributeValueTranslatableFragment["translation"],
      }),
    ];

    // Act
    const result = mapAttributeValuesToTranslationFields(attributeValues, mockIntl);

    // Assert
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: "av-2",
        type: "short",
        value: "Large",
        translation: "Duży",
      }),
    );
  });

  it("returns null translation when no translation exists", () => {
    // Arrange
    const attributeValues = [
      makeAttrValue({
        attributeValue: { __typename: "AttributeValue", id: "av-3" },
        plainText: "Cotton",
      }),
    ];

    // Act
    const result = mapAttributeValuesToTranslationFields(attributeValues, mockIntl);

    // Assert
    expect(result[0].translation).toBeNull();
  });
});

describe("getAttributeValueTranslationsInputData", () => {
  it("returns richText field for RICH type", () => {
    // Arrange & Act
    const result = getAttributeValueTranslationsInputData("rich", '{"blocks":[]}');

    // Assert
    expect(result).toEqual({ richText: '"{\\"blocks\\":[]}"' });
  });

  it("returns plainText field for SHORT type", () => {
    // Arrange & Act
    const result = getAttributeValueTranslationsInputData("short", "plain text value");

    // Assert
    expect(result).toEqual({ plainText: "plain text value" });
  });
});
