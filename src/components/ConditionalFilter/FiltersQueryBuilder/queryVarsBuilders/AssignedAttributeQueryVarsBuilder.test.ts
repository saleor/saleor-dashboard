import { AttributeEntityTypeEnum, AttributeInputTypeEnum } from "@dashboard/graphql";

import { Condition } from "../../FilterElement/Condition";
import { type ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { AssignedAttributeQueryVarsBuilder } from "./AssignedAttributeQueryVarsBuilder";

describe("AssignedAttributeQueryVarsBuilder", () => {
  const def = new AssignedAttributeQueryVarsBuilder();
  const baseValue = new ExpressionValue("attribute", "Attribute", "attribute");
  const inCondition: ConditionItem = { type: "multiselect", label: "in", value: "input-2" };

  const createElement = (
    selectedAttribute: ExpressionValue,
    conditionItem: ConditionItem,
    conditionValue: ConditionSelected["value"],
    inputType: AttributeInputTypeEnum,
  ) => {
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, conditionValue);
    const condition = new Condition(ConditionOptions.fromName(inputType), selected, false);

    return new FilterElement(baseValue, condition, false, undefined, selectedAttribute);
  };

  it("should return true for attribute rows and false otherwise", () => {
    // Arrange
    const attributeElement = new FilterElement(baseValue, Condition.createEmpty(), false);
    const otherElement = new FilterElement(
      new ExpressionValue("dateJoined", "Join date", "dateJoined"),
      Condition.createEmpty(),
      false,
    );

    // Act / Assert
    expect(def.canHandle(attributeElement)).toBe(true);
    expect(def.canHandle(otherElement)).toBe(false);
  });

  it("should map dropdown values to AssignedAttributeWhereInput.value.slug", () => {
    // Arrange
    const element = createElement(
      new ExpressionValue("industry", "Industry", AttributeInputTypeEnum.DROPDOWN),
      inCondition,
      { label: "Retail", value: "option-id", slug: "option-id", originalSlug: "retail" },
      AttributeInputTypeEnum.DROPDOWN,
    );

    // Act
    const result = def.updateWhereQueryVariables({}, element);

    // Assert
    expect(result).toEqual({
      attributes: [{ slug: "industry", value: { slug: { eq: "retail" } } }],
    });
  });

  it("should map multiselect values to slug.oneOf", () => {
    // Arrange
    const element = createElement(
      new ExpressionValue("tags", "Tags", AttributeInputTypeEnum.MULTISELECT),
      inCondition,
      [
        { label: "VIP", value: "id-1", slug: "id-1", originalSlug: "vip" },
        { label: "Retail", value: "id-2", slug: "id-2", originalSlug: "retail" },
      ],
      AttributeInputTypeEnum.MULTISELECT,
    );

    // Act
    const result = def.updateWhereQueryVariables({}, element);

    // Assert
    expect(result).toEqual({
      attributes: [{ slug: "tags", value: { slug: { oneOf: ["vip", "retail"] } } }],
    });
  });

  it("should map boolean attributes to value.boolean", () => {
    // Arrange
    const element = createElement(
      new ExpressionValue("tax-exempt", "Tax exempt", AttributeInputTypeEnum.BOOLEAN),
      { type: "select", label: "is", value: "input-5" },
      { label: "Yes", value: "true", slug: "true" },
      AttributeInputTypeEnum.BOOLEAN,
    );

    // Act
    const result = def.updateWhereQueryVariables({}, element);

    // Assert
    expect(result).toEqual({
      attributes: [{ slug: "tax-exempt", value: { boolean: true } }],
    });
  });

  it("should map numeric ranges to value.numeric.range", () => {
    // Arrange
    const element = createElement(
      new ExpressionValue("credit-limit", "Credit limit", AttributeInputTypeEnum.NUMERIC),
      { type: "number.range", label: "between", value: "input-4" },
      ["10", "20"],
      AttributeInputTypeEnum.NUMERIC,
    );

    // Act
    const result = def.updateWhereQueryVariables({}, element);

    // Assert
    expect(result).toEqual({
      attributes: [{ slug: "credit-limit", value: { numeric: { range: { gte: 10, lte: 20 } } } }],
    });
  });

  it("should map date ranges to value.date", () => {
    // Arrange
    const element = createElement(
      new ExpressionValue("contract-start", "Contract start", AttributeInputTypeEnum.DATE),
      { type: "date.range", label: "between", value: "input-3" },
      ["2023-01-01", "2023-01-31"],
      AttributeInputTypeEnum.DATE,
    );

    // Act
    const result = def.updateWhereQueryVariables({}, element);

    // Assert
    expect(result).toEqual({
      attributes: [
        { slug: "contract-start", value: { date: { gte: "2023-01-01", lte: "2023-01-31" } } },
      ],
    });
  });

  it("should map datetime ranges to value.dateTime", () => {
    // Arrange
    const element = createElement(
      new ExpressionValue("last-review", "Last review", AttributeInputTypeEnum.DATE_TIME),
      { type: "datetime.range", label: "between", value: "input-4" },
      ["2023-01-01T00:00:00Z", "2023-01-31T23:59:59Z"],
      AttributeInputTypeEnum.DATE_TIME,
    );

    // Act
    const result = def.updateWhereQueryVariables({}, element);

    // Assert
    expect(result).toEqual({
      attributes: [
        {
          slug: "last-review",
          value: {
            dateTime: { gte: "2023-01-01T00:00:00Z", lte: "2023-01-31T23:59:59Z" },
          },
        },
      ],
    });
  });

  it("should map reference attributes to value.reference", () => {
    // Arrange
    const element = createElement(
      new ExpressionValue(
        "account-manager",
        "Account manager",
        AttributeInputTypeEnum.REFERENCE,
        AttributeEntityTypeEnum.PAGE,
      ),
      inCondition,
      [{ label: "Page 1", value: "UGFnZTox", slug: "page-1" }],
      AttributeInputTypeEnum.REFERENCE,
    );

    // Act
    const result = def.updateWhereQueryVariables({}, element);

    // Assert
    expect(result).toEqual({
      attributes: [
        {
          slug: "account-manager",
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

  it("should append multiple attributes onto the same list", () => {
    // Arrange
    const first = createElement(
      new ExpressionValue("industry", "Industry", AttributeInputTypeEnum.DROPDOWN),
      inCondition,
      { label: "Retail", value: "id-1", slug: "id-1", originalSlug: "retail" },
      AttributeInputTypeEnum.DROPDOWN,
    );
    const second = createElement(
      new ExpressionValue("tax-exempt", "Tax exempt", AttributeInputTypeEnum.BOOLEAN),
      { type: "select", label: "is", value: "input-5" },
      { label: "Yes", value: "true", slug: "true" },
      AttributeInputTypeEnum.BOOLEAN,
    );

    // Act
    const result = def.updateWhereQueryVariables(def.updateWhereQueryVariables({}, first), second);

    // Assert
    expect(result.attributes).toEqual([
      { slug: "industry", value: { slug: { eq: "retail" } } },
      { slug: "tax-exempt", value: { boolean: true } },
    ]);
  });

  it("should leave the query unchanged when no attribute is selected", () => {
    // Arrange
    const element = new FilterElement(baseValue, Condition.createEmpty(), false, undefined, null);

    // Act
    const result = def.updateWhereQueryVariables(
      { dateJoined: { gte: "2025-01-01" } } as never,
      element,
    );

    // Assert
    expect(result).toEqual({ dateJoined: { gte: "2025-01-01" } });
  });
});
