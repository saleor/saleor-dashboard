import { ApolloClient } from "@apollo/client";
import { AttributeEntityTypeEnum, AttributeInputTypeEnum } from "@dashboard/graphql";

import {
  AttributeChoicesHandler,
  PageHandler,
  ProductsHandler,
  ProductVariantHandler,
} from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { AttributeQueryVarsBuilder } from "./AttributeQueryVarsBuilder";

describe("AttributeQueryVarsBuilder", () => {
  describe("canHandle", () => {
    it("should return true for elements with rowType 'attribute'", () => {
      // Arrange
      const value = new ExpressionValue("attribute", "Attribute", "attribute");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new AttributeQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for elements with other rowTypes", () => {
      // Arrange
      const value = new ExpressionValue("not-attribute", "Other", "other");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new AttributeQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    const client = {} as ApolloClient<unknown>;
    const inputValue = "test";
    const baseElement = new FilterElement(
      new ExpressionValue("attribute", "Attribute", "attribute"),
      Condition.createEmpty(),
      false,
      undefined,
    );

    it("should create PageHandler for REFERENCE attributes with PAGE entity type", () => {
      // Arrange
      const element = new FilterElement(
        baseElement.value,
        baseElement.condition,
        false,
        undefined,
        new ExpressionValue(
          "attr-slug",
          "Attr",
          "REFERENCE",
          "PAGE",
        ),
      );
      const def = new AttributeQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher(client, inputValue, element);

      // Assert
      expect(handler).toBeInstanceOf(PageHandler);
    });

    it("should create ProductsHandler for REFERENCE attributes with PRODUCT entity type", () => {
      // Arrange
      const element = new FilterElement(
        baseElement.value,
        baseElement.condition,
        false,
        undefined,
        new ExpressionValue(
          "attr-slug",
          "Attr",
          "REFERENCE",
          "PRODUCT",
        ),
      );
      const def = new AttributeQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher(client, inputValue, element);

      // Assert
      expect(handler).toBeInstanceOf(ProductsHandler);
    });

    it("should create ProductVariantHandler for REFERENCE attributes with PRODUCT_VARIANT entity type", () => {
      // Arrange
      const element = new FilterElement(
        baseElement.value,
        baseElement.condition,
        false,
        undefined,
        new ExpressionValue(
          "attr-slug",
          "Attr",
          "REFERENCE",
          "PRODUCT_VARIANT",
        ),
      );
      const def = new AttributeQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher(client, inputValue, element);

      // Assert
      expect(handler).toBeInstanceOf(ProductVariantHandler);
    });

    it("should create AttributeChoicesHandler for other attribute types", () => {
      // Arrange
      const element = new FilterElement(
        baseElement.value,
        baseElement.condition,
        false,
        undefined,
        new ExpressionValue("attr-slug", "Attr", "DROPDOWN"),
      );
      const def = new AttributeQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher(client, inputValue, element);

      // Assert
      expect(handler).toBeInstanceOf(AttributeChoicesHandler);
    });

    it("should handle gracefully if attribute is not selected", () => {
      // Arrange
      const element = new FilterElement(
        baseElement.value,
        baseElement.condition,
        false,
        undefined,
        null,
      );
      const def = new AttributeQueryVarsBuilder();
      // Act
      const handler = def.createOptionFetcher(client, inputValue, element);

      // Assert
      expect(handler).toBeInstanceOf(AttributeChoicesHandler);
    });
  });

  describe("updateWhereQueryVariables", () => {
    const def = new AttributeQueryVarsBuilder();
    const baseValue = new ExpressionValue("attribute", "Attribute", "attribute");
    const baseConditionItem: ConditionItem = { type: "multiselect", label: "in", value: "input-2" };
    const baseSelected = ConditionSelected.fromConditionItem(baseConditionItem);
    const baseCondition = new Condition(
      ConditionOptions.fromName("DROPDOWN"),
      baseSelected,
      false,
    );

    it("should correctly build query for PAGE reference attributes", () => {
      // Arrange
      const attributeSlug = "ref-attr";
      const pageLabel = "Page 1";
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "RefAttr",
        "REFERENCE",
        "PAGE",
      );
      const selected = ConditionSelected.fromConditionItemAndValue(baseConditionItem, [
        {
          label: pageLabel,
          value: "UGFnZTox",
          slug: "page-1",
        },
      ]);
      const condition = new Condition(
        ConditionOptions.fromName("REFERENCE"),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        attributes: [
          {
            slug: attributeSlug,
            value: {
              reference: {
                referencedIds: {
                  containsAny: ["UGFnZTox"],
                },
              },
            },
          },
        ],
      });
    });

    it("should correctly build query for PRODUCT reference attributes", () => {
      // Arrange
      const attributeSlug = "product-ref";
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "Product Ref",
        "REFERENCE",
        "PRODUCT",
      );
      const selected = ConditionSelected.fromConditionItemAndValue(baseConditionItem, [
        {
          label: "Product 1",
          value: "UHJvZHVjdDox",
          slug: "product-1",
        },
      ]);
      const condition = new Condition(
        ConditionOptions.fromName("REFERENCE"),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);

      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        attributes: [
          {
            slug: attributeSlug,
            value: {
              reference: {
                referencedIds: {
                  containsAny: ["UHJvZHVjdDox"],
                },
              },
            },
          },
        ],
      });
    });

    it("should correctly build query for PRODUCT_VARIANT SINGLE_REFERENCE attributes", () => {
      // Arrange
      const attributeSlug = "variant-ref";
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "Variant Ref",
        "SINGLE_REFERENCE",
        "PRODUCT_VARIANT",
      );
      const selected = ConditionSelected.fromConditionItemAndValue(baseConditionItem, [
        {
          label: "Product A: Variant A",
          value: "UHJvZHVjdFZhcmlhbnQ6MQ==",
          slug: "UHJvZHVjdFZhcmlhbnQ6MQ==",
          originalSlug: "SKU-1",
        },
      ]);
      const condition = new Condition(
        ConditionOptions.fromName("SINGLE_REFERENCE"),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);

      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        attributes: [
          {
            slug: attributeSlug,
            value: {
              reference: {
                referencedIds: {
                  containsAny: ["UHJvZHVjdFZhcmlhbnQ6MQ=="],
                },
              },
            },
          },
        ],
      });
    });

    it("should correctly build query for DROPDOWN/MULTISELECT attributes", () => {
      // Arrange
      const attributeSlug = "dropdown-attr";
      const optionValue = "option-1";
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "DropdownAttr",
        "DROPDOWN",
      );
      const selected = ConditionSelected.fromConditionItemAndValue(baseConditionItem, {
        label: "Option 1",
        value: optionValue,
        slug: optionValue,
      });
      const condition = new Condition(
        ConditionOptions.fromName("DROPDOWN"),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({ attributes: [{ slug: attributeSlug, values: [optionValue] }] });
    });

    it("should correctly build query for NUMERIC attributes with range", () => {
      // Arrange
      const attributeSlug = "numeric-attr";
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "NumericAttr",
        "NUMERIC",
      );
      const rangeConditionItem: ConditionItem = {
        type: "number.range",
        label: "between",
        value: "input-4",
      };
      const selected = ConditionSelected.fromConditionItemAndValue(rangeConditionItem, [
        "10",
        "20",
      ]);
      const condition = new Condition(
        ConditionOptions.fromName("NUMERIC"),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        attributes: [{ slug: attributeSlug, valuesRange: { gte: 10, lte: 20 } }],
      });
    });

    it("should correctly build query for DATE attributes with range", () => {
      // Arrange
      const attributeSlug = "date-attr";
      const startDate = "2023-01-01";
      const endDate = "2023-01-31";
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "DateAttr",
        "DATE",
      );
      const rangeConditionItem: ConditionItem = {
        type: "date.range",
        label: "between",
        value: "input-3",
      };
      const selected = ConditionSelected.fromConditionItemAndValue(rangeConditionItem, [
        startDate,
        endDate,
      ]);
      const condition = new Condition(
        ConditionOptions.fromName("DATE"),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        attributes: [{ slug: attributeSlug, date: { gte: startDate, lte: endDate } }],
      });
    });

    it("should correctly build query for DATETIME attributes with range", () => {
      // Arrange
      const attributeSlug = "datetime-attr";
      const startDateTime = "2023-01-01T00:00:00Z";
      const endDateTime = "2023-01-31T23:59:59Z";
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "DatetimeAttr",
        "DATE_TIME",
      );
      const rangeConditionItem: ConditionItem = {
        type: "datetime.range",
        label: "between",
        value: "input-4",
      };
      const selected = ConditionSelected.fromConditionItemAndValue(rangeConditionItem, [
        startDateTime,
        endDateTime,
      ]);
      const condition = new Condition(
        ConditionOptions.fromName("DATE_TIME"),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        attributes: [{ slug: attributeSlug, dateTime: { gte: startDateTime, lte: endDateTime } }],
      });
    });

    it("should correctly build query for BOOLEAN attributes", () => {
      // Arrange
      const attributeSlug = "bool-attr";
      const boolValue = true;
      const selectedAttribute = new ExpressionValue(
        attributeSlug,
        "BoolAttr",
        "BOOLEAN",
      );
      const boolConditionItem: ConditionItem = { type: "select", label: "is", value: "input-5" };
      const selected = ConditionSelected.fromConditionItemAndValue(boolConditionItem, {
        label: "Yes",
        value: boolValue.toString(),
        slug: boolValue.toString(),
      });
      const condition = new Condition(
        ConditionOptions.fromName("BOOLEAN"),
        selected,
        false,
      );
      const element = new FilterElement(baseValue, condition, false, undefined, selectedAttribute);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({ attributes: [{ slug: attributeSlug, boolean: boolValue }] });
    });

    it("should return query unchanged if attribute slug is missing", () => {
      // Arrange
      const selectedAttribute = null;
      const element = new FilterElement(
        baseValue,
        baseCondition,
        false,
        undefined,
        selectedAttribute,
      );
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({});
    });
  });
});
