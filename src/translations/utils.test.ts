import {
  AttributeInputTypeEnum,
  type AttributeTranslationDetailsFragment,
  type AttributeValueTranslatableFragment,
  LanguageCodeEnum,
} from "@dashboard/graphql";
import { type OutputData } from "@editorjs/editorjs";
import { type IntlShape } from "react-intl";

import { type TranslationField, TranslationInputFieldName } from "./types";
import {
  getAttributeValueTranslationContent,
  getAttributeValueTranslationsInputData,
  getParsedTranslationInputData,
  getTranslationFields,
  mapAttributeValuesToTranslationFields,
} from "./utils";

const mockIntl: IntlShape = {
  formatMessage: ({ defaultMessage }: { defaultMessage?: string }) => defaultMessage ?? "",
} as IntlShape;

describe("getParsedTranslationInputData", () => {
  const nullableName: Pick<TranslationField, "name" | "nullable"> = {
    name: TranslationInputFieldName.name,
    nullable: true,
  };
  const nonNullableName: Pick<TranslationField, "name" | "nullable"> = {
    name: TranslationInputFieldName.name,
  };

  it("returns the raw string for a text field", () => {
    // Arrange & Act
    const result = getParsedTranslationInputData({ field: nullableName, data: "some name" });

    // Assert
    expect(result).toEqual({ name: "some name" });
  });

  it("returns null for a cleared nullable field so the translation is removed", () => {
    // Arrange & Act
    const result = getParsedTranslationInputData({ field: nullableName, data: "" });

    // Assert
    expect(result).toEqual({ name: null });
  });

  it("returns null for a whitespace-only nullable field", () => {
    // Arrange
    const field: Pick<TranslationField, "name" | "nullable"> = {
      name: TranslationInputFieldName.slug,
      nullable: true,
    };

    // Act
    const result = getParsedTranslationInputData({ field, data: "   " });

    // Assert
    expect(result).toEqual({ slug: null });
  });

  it("returns an empty string for a cleared field that is not nullable", () => {
    // Arrange & Act
    const result = getParsedTranslationInputData({ field: nonNullableName, data: "   " });

    // Assert
    expect(result).toEqual({ name: "" });
  });

  it("serializes rich text and returns null when it has no blocks", () => {
    // Arrange
    const field: Pick<TranslationField, "name" | "nullable"> = {
      name: TranslationInputFieldName.description,
      nullable: true,
    };
    const content: OutputData = { blocks: [{ type: "paragraph", data: { text: "Opis" } }] };

    // Act
    const filled = getParsedTranslationInputData({ field, data: content });
    const cleared = getParsedTranslationInputData({ field, data: { blocks: [] } });

    // Assert
    expect(filled).toEqual({ description: JSON.stringify(content) });
    expect(cleared).toEqual({ description: null });
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
      id: "translatable-content-1",
      attributeValue: {
        __typename: "AttributeValue",
        id: "av-1",
        inputType: AttributeInputTypeEnum.PLAIN_TEXT,
      },
      attribute: {
        __typename: "AttributeTranslatableContent",
        id: "attr-1",
        name: "Color",
      },
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
        attributeValue: {
          __typename: "AttributeValue",
          id: "av-1",
          inputType: AttributeInputTypeEnum.RICH_TEXT,
        },
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
        name: "av-1",
        type: "rich",
        value: '{"blocks":[]}',
        translation: '{"blocks":[{"text":"translated"}]}',
      }),
    );
  });

  it("maps empty rich text attribute values as rich type based on input type", () => {
    // Arrange
    const attributeValues = [
      makeAttrValue({
        attributeValue: {
          __typename: "AttributeValue",
          id: "av-1",
          inputType: AttributeInputTypeEnum.RICH_TEXT,
        },
        name: "",
        richText: null,
        plainText: null,
      }),
    ];

    // Act
    const result = mapAttributeValuesToTranslationFields(attributeValues, mockIntl);

    // Assert
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: "av-1",
        name: "av-1",
        type: "rich",
        value: "",
        translation: null,
      }),
    );
  });

  it("maps attribute values with plain text", () => {
    // Arrange
    const attributeValues = [
      makeAttrValue({
        attributeValue: {
          __typename: "AttributeValue",
          id: "av-2",
          inputType: AttributeInputTypeEnum.PLAIN_TEXT,
        },
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
        name: "av-2",
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
        attributeValue: { __typename: "AttributeValue", id: "av-3", inputType: null },
        plainText: "Cotton",
      }),
    ];

    // Act
    const result = mapAttributeValuesToTranslationFields(attributeValues, mockIntl);

    // Assert
    expect(result[0].translation).toBeNull();
  });

  it("uses translatable content id when attribute value id is missing", () => {
    // Arrange
    const attributeValues = [
      makeAttrValue({
        id: "translatable-content-99",
        attributeValue: null,
        plainText: "Wool",
      }),
    ];

    // Act
    const result = mapAttributeValuesToTranslationFields(attributeValues, mockIntl);

    // Assert
    expect(result[0].name).toBe("translatable-content-99");
    expect(result[0].nullable).toBe(false);
  });
});

describe("getAttributeValueTranslationContent", () => {
  const makeTranslation = (
    content: Pick<
      NonNullable<AttributeValueTranslatableFragment["translation"]>,
      "richText" | "plainText"
    >,
  ): AttributeValueTranslatableFragment["translation"] => ({
    __typename: "AttributeValueTranslation",
    id: "t-1",
    name: "",
    language: {
      __typename: "LanguageDisplay",
      code: LanguageCodeEnum.PL,
      language: "Polish",
    },
    ...content,
  });

  it("returns the rich text translation for a RICH field", () => {
    // Arrange & Act
    const result = getAttributeValueTranslationContent({
      translation: makeTranslation({ richText: '{"blocks":[]}', plainText: null }),
      type: "rich",
    });

    // Assert
    expect(result).toBe('{"blocks":[]}');
  });

  it("returns the plain text translation for a SHORT field", () => {
    // Arrange & Act
    const result = getAttributeValueTranslationContent({
      translation: makeTranslation({ richText: null, plainText: "Bawełna" }),
      type: "short",
    });

    // Assert
    expect(result).toBe("Bawełna");
  });

  it("keeps a plain text translation stored as an empty string so it can be reset", () => {
    // Arrange & Act
    const result = getAttributeValueTranslationContent({
      translation: makeTranslation({ richText: null, plainText: "" }),
      type: "short",
    });

    // Assert
    expect(result).toBe("");
  });

  it("returns null when translation is missing", () => {
    // Arrange & Act
    const result = getAttributeValueTranslationContent({ translation: null, type: "short" });

    // Assert
    expect(result).toBeNull();
  });
});

describe("getAttributeValueTranslationsInputData", () => {
  it("forwards already serialized RICH content", () => {
    // Arrange
    const serialized = JSON.stringify({ blocks: [{ type: "paragraph", data: { text: "Opis" } }] });

    // Act
    const result = getAttributeValueTranslationsInputData("rich", serialized);

    // Assert
    expect(result).toEqual({ richText: serialized });
  });

  it("returns null richText for a blank or empty serialized RICH string", () => {
    // Arrange & Act
    const blank = getAttributeValueTranslationsInputData("rich", " ");
    const emptyDocument = getAttributeValueTranslationsInputData("rich", '{"blocks":[]}');

    // Assert
    expect(blank).toEqual({ richText: null });
    expect(emptyDocument).toEqual({ richText: null });
  });

  it("returns richText field for RICH type", () => {
    // Arrange
    const data: OutputData = {
      blocks: [{ type: "paragraph", data: { text: "Opis" } }],
    };

    // Act
    const result = getAttributeValueTranslationsInputData("rich", data);

    // Assert
    expect(result).toEqual({ richText: JSON.stringify(data) });
  });

  it("returns null richText for cleared RICH content", () => {
    // Arrange
    const data: OutputData = { blocks: [] };

    // Act
    const result = getAttributeValueTranslationsInputData("rich", data);

    // Assert
    expect(result).toEqual({ richText: null });
  });

  it("returns plainText field for SHORT type", () => {
    // Arrange & Act
    const result = getAttributeValueTranslationsInputData("short", "plain text value");

    // Assert
    expect(result).toEqual({ plainText: "plain text value" });
  });

  it("returns null plainText with an empty name for cleared SHORT content", () => {
    // Arrange & Act
    const result = getAttributeValueTranslationsInputData("short", " ");

    // Assert
    expect(result).toEqual({ name: "", plainText: null });
  });
});
