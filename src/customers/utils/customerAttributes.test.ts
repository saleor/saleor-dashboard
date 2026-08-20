import { AttributeInputTypeEnum, AttributeTypeEnum } from "@dashboard/graphql";

import {
  customerAttributeInputHasValue,
  getAttributeInputFromCustomer,
  getAttributeInputFromCustomerType,
  getCustomerUpdateAttributesInput,
  mapAssignedAttribute,
} from "./customerAttributes";

describe("mapAssignedAttribute", () => {
  it("maps a single choice slug", () => {
    // Arrange
    const assigned = {
      __typename: "AssignedSingleChoiceAttribute" as const,
      attribute: { __typename: "Attribute" as const, id: "attr-1", slug: "loyalty" },
      choiceValue: {
        __typename: "AssignedChoiceAttributeValue" as const,
        name: "Gold",
        slug: "gold",
      },
    };

    // Act
    const mapped = mapAssignedAttribute(assigned);

    // Assert
    expect(mapped.value).toEqual(["gold"]);
  });

  it("maps multi-choice slugs", () => {
    // Arrange
    const assigned = {
      __typename: "AssignedMultiChoiceAttribute" as const,
      attribute: { __typename: "Attribute" as const, id: "attr-2", slug: "tags" },
      choiceValues: [
        { __typename: "AssignedChoiceAttributeValue" as const, name: "A", slug: "a" },
        { __typename: "AssignedChoiceAttributeValue" as const, name: "B", slug: "b" },
      ],
    };

    // Act
    const mapped = mapAssignedAttribute(assigned);

    // Assert
    expect(mapped.value).toEqual(["a", "b"]);
  });

  it("maps a numeric value to a string", () => {
    // Arrange
    const assigned = {
      __typename: "AssignedNumericAttribute" as const,
      attribute: { __typename: "Attribute" as const, id: "attr-3", slug: "score" },
      numericValue: 12.5,
    };

    // Act
    const mapped = mapAssignedAttribute(assigned);

    // Assert
    expect(mapped.value).toEqual(["12.5"]);
  });
});

describe("getAttributeInputFromCustomerType", () => {
  const customerType = {
    __typename: "CustomerType" as const,
    attributes: [
      {
        __typename: "Attribute" as const,
        choices: {
          __typename: "AttributeValueCountableConnection" as const,
          edges: [
            {
              __typename: "AttributeValueCountableEdge" as const,
              cursor: "1",
              node: {
                __typename: "AttributeValue" as const,
                boolean: null,
                date: null,
                dateTime: null,
                file: null,
                id: "val-1",
                name: "Gold",
                plainText: null,
                reference: null,
                richText: null,
                slug: "gold",
                value: null,
              },
            },
          ],
          pageInfo: {
            __typename: "PageInfo" as const,
            endCursor: null,
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
          },
        },
        entityType: null,
        filterableInStorefront: true,
        id: "attr-1",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        name: "Loyalty",
        slug: "loyalty",
        type: AttributeTypeEnum.CUSTOMER_TYPE,
        unit: null,
        valueRequired: false,
        visibleInStorefront: true,
      },
    ],
    id: "type-1",
    isDefault: true,
    name: "Default",
    slug: "default",
  };

  it("builds empty attribute inputs when nothing is assigned", () => {
    // Arrange & Act
    const input = getAttributeInputFromCustomerType({ customerType });

    // Assert
    expect(input).toHaveLength(1);
    expect(input[0].id).toBe("attr-1");
    expect(input[0].value).toEqual([]);
    expect(input[0].label).toBe("Loyalty");
  });

  it("fills values from assigned attributes", () => {
    // Arrange
    const assignedAttributes = [
      {
        __typename: "AssignedSingleChoiceAttribute" as const,
        attribute: { __typename: "Attribute" as const, id: "attr-1", slug: "loyalty" },
        choiceValue: {
          __typename: "AssignedChoiceAttributeValue" as const,
          name: "Gold",
          slug: "gold",
        },
      },
    ];

    // Act
    const input = getAttributeInputFromCustomerType({ assignedAttributes, customerType });

    // Assert
    expect(input[0].value).toEqual(["gold"]);
  });

  it("builds inputs from a customer payload", () => {
    // Arrange
    const assignedAttributes = [
      {
        __typename: "AssignedSingleChoiceAttribute" as const,
        attribute: { __typename: "Attribute" as const, id: "attr-1", slug: "loyalty" },
        choiceValue: {
          __typename: "AssignedChoiceAttributeValue" as const,
          name: "Gold",
          slug: "gold",
        },
      },
    ];

    // Act
    const input = getAttributeInputFromCustomer({
      assignedAttributes,
      customerType,
    });

    // Assert
    expect(input[0].value).toEqual(["gold"]);
  });

  it("keeps in-progress values when switching to a type that shares the attribute", () => {
    // Arrange
    const previousAttributes = [
      {
        data: {
          inputType: AttributeInputTypeEnum.DROPDOWN,
          isRequired: false,
          values: [],
        },
        id: "attr-1",
        label: "Loyalty",
        value: ["silver"],
      },
    ];

    // Act
    const input = getAttributeInputFromCustomerType({
      customerType,
      previousAttributes,
    });

    // Assert
    expect(input[0].value).toEqual(["silver"]);
  });

  it("restores assigned values when a shared previous field is empty", () => {
    // Arrange
    const assignedAttributes = [
      {
        __typename: "AssignedSingleChoiceAttribute" as const,
        attribute: { __typename: "Attribute" as const, id: "attr-1", slug: "loyalty" },
        choiceValue: {
          __typename: "AssignedChoiceAttributeValue" as const,
          name: "Gold",
          slug: "gold",
        },
      },
    ];
    const previousAttributes = [
      {
        data: {
          inputType: AttributeInputTypeEnum.DROPDOWN,
          isRequired: false,
          values: [],
        },
        id: "attr-1",
        label: "Loyalty",
        value: [],
      },
    ];

    // Act
    const input = getAttributeInputFromCustomerType({
      assignedAttributes,
      customerType,
      previousAttributes,
    });

    // Assert
    expect(input[0].value).toEqual(["gold"]);
  });
});

describe("customerAttributeInputHasValue", () => {
  it("treats empty dropdowns as no value", () => {
    // Arrange & Act & Assert
    expect(customerAttributeInputHasValue({ id: "attr-1", dropdown: null })).toBe(false);
  });

  it("treats a selected dropdown as a value", () => {
    // Arrange & Act & Assert
    expect(customerAttributeInputHasValue({ id: "attr-1", dropdown: { value: "gold" } })).toBe(
      true,
    );
  });

  it("treats false booleans as a value", () => {
    // Arrange & Act & Assert
    expect(customerAttributeInputHasValue({ id: "attr-1", boolean: false })).toBe(true);
  });
});

describe("getCustomerUpdateAttributesInput", () => {
  const loyaltyAttribute = {
    data: {
      inputType: AttributeInputTypeEnum.DROPDOWN,
      isRequired: false,
      values: [],
    },
    id: "attr-1",
    label: "Loyalty",
    value: [] as string[],
  };

  it("omits empty attributes when the customer type is changing", () => {
    // Arrange & Act
    const input = getCustomerUpdateAttributesInput({
      attributes: [loyaltyAttribute],
      prevAttributes: [],
      typeChanged: true,
      updatedFileAttributes: [],
    });

    // Assert
    expect(input).toBeUndefined();
  });

  it("sends filled attributes when the customer type is changing", () => {
    // Arrange & Act
    const input = getCustomerUpdateAttributesInput({
      attributes: [{ ...loyaltyAttribute, value: ["gold"] }],
      prevAttributes: [],
      typeChanged: true,
      updatedFileAttributes: [],
    });

    // Assert
    expect(input).toEqual([{ id: "attr-1", dropdown: { value: "gold" } }]);
  });

  it("still sends empty attributes when the type is unchanged so clearing works", () => {
    // Arrange & Act
    const input = getCustomerUpdateAttributesInput({
      attributes: [loyaltyAttribute],
      prevAttributes: [{ ...loyaltyAttribute, value: ["gold"] }],
      typeChanged: false,
      updatedFileAttributes: [],
    });

    // Assert
    expect(input).toEqual([{ id: "attr-1", dropdown: null }]);
  });
});
