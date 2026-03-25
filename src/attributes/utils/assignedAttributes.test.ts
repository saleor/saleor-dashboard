import { getDisplayValueFromAssignedAttribute } from "./assignedAttributes";

type Attr = Parameters<typeof getDisplayValueFromAssignedAttribute>[0];

const baseAttribute = { __typename: "Attribute" as const, id: "attr-1" };

describe("getDisplayValueFromAssignedAttribute", () => {
  // Arrange — single choice
  it("returns name for single choice attribute like fabric type", () => {
    const attr: Attr = {
      __typename: "AssignedSingleChoiceAttribute",
      singleChoiceValue: { __typename: "AssignedChoiceAttributeValue", name: "Organic Cotton" },
      attribute: baseAttribute,
    };

    // Act
    const result = getDisplayValueFromAssignedAttribute(attr);

    // Assert
    expect(result).toBe("Organic Cotton");
  });

  it("returns empty string when single choice value is null", () => {
    // Arrange
    const attr: Attr = {
      __typename: "AssignedSingleChoiceAttribute",
      singleChoiceValue: null,
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("");
  });

  // Arrange — multi choice
  it("returns comma-separated names for multi choice attribute like available sizes", () => {
    const attr: Attr = {
      __typename: "AssignedMultiChoiceAttribute",
      multiChoiceValue: [
        { __typename: "AssignedChoiceAttributeValue", name: "S" },
        { __typename: "AssignedChoiceAttributeValue", name: "M" },
        { __typename: "AssignedChoiceAttributeValue", name: "L" },
        { __typename: "AssignedChoiceAttributeValue", name: "XL" },
      ],
      attribute: baseAttribute,
    };

    // Act
    const result = getDisplayValueFromAssignedAttribute(attr);

    // Assert
    expect(result).toBe("S, M, L, XL");
  });

  it("returns empty string for multi choice with no values", () => {
    // Arrange
    const attr: Attr = {
      __typename: "AssignedMultiChoiceAttribute",
      multiChoiceValue: [],
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("");
  });

  // Arrange — numeric
  it("returns stringified number for numeric attribute like weight in grams", () => {
    const attr: Attr = {
      __typename: "AssignedNumericAttribute",
      numericValue: 250,
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("250");
  });

  it("returns '0' for numeric attribute with zero value (e.g. free shipping threshold)", () => {
    // Arrange
    const attr: Attr = {
      __typename: "AssignedNumericAttribute",
      numericValue: 0,
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("0");
  });

  it("returns empty string when numeric value is null", () => {
    // Arrange
    const attr: Attr = {
      __typename: "AssignedNumericAttribute",
      numericValue: null,
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("");
  });

  // Arrange — plain text
  it("returns plain text value like care instructions", () => {
    const attr: Attr = {
      __typename: "AssignedPlainTextAttribute",
      plainTextValue: "Machine wash cold, tumble dry low",
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("Machine wash cold, tumble dry low");
  });

  it("returns empty string when plain text value is null", () => {
    // Arrange
    const attr: Attr = {
      __typename: "AssignedPlainTextAttribute",
      plainTextValue: null,
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("");
  });

  // Arrange — boolean
  it("returns 'true' for boolean attribute like 'is gift wrappable'", () => {
    const attr: Attr = {
      __typename: "AssignedBooleanAttribute",
      booleanValue: true,
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("true");
  });

  it("returns 'false' for boolean attribute like 'contains allergens'", () => {
    // Arrange
    const attr: Attr = {
      __typename: "AssignedBooleanAttribute",
      booleanValue: false,
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("false");
  });

  it("returns empty string when boolean value is null", () => {
    // Arrange
    const attr: Attr = {
      __typename: "AssignedBooleanAttribute",
      booleanValue: null,
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("");
  });

  // Arrange — date
  it("returns date for date attribute like production date", () => {
    const attr: Attr = {
      __typename: "AssignedDateAttribute",
      dateValue: "2026-01-15",
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("2026-01-15");
  });

  // Arrange — datetime
  it("returns datetime for datetime attribute like last restocked at", () => {
    const attr: Attr = {
      __typename: "AssignedDateTimeAttribute",
      dateTimeValue: "2026-03-10T14:30:00Z",
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("2026-03-10T14:30:00Z");
  });

  // Arrange — swatch
  it("returns swatch name for swatch attribute like color", () => {
    const attr: Attr = {
      __typename: "AssignedSwatchAttribute",
      swatchValue: { __typename: "AssignedSwatchAttributeValue", name: "Midnight Blue" },
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("Midnight Blue");
  });

  // Arrange — single page reference
  it("returns page title for single page reference like size guide", () => {
    const attr: Attr = {
      __typename: "AssignedSinglePageReferenceAttribute",
      pageReferenceValue: { __typename: "Page", title: "Men's Shoe Size Guide" },
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("Men's Shoe Size Guide");
  });

  // Arrange — single product reference
  it("returns product name for single product reference like 'goes well with'", () => {
    const attr: Attr = {
      __typename: "AssignedSingleProductReferenceAttribute",
      productReferenceValue: { __typename: "Product", name: "Leather Belt - Brown" },
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("Leather Belt - Brown");
  });

  // Arrange — single variant reference
  it("returns variant name for single variant reference like recommended variant", () => {
    const attr: Attr = {
      __typename: "AssignedSingleProductVariantReferenceAttribute",
      variantReferenceValue: { __typename: "ProductVariant", name: "Running Shoe - US 10 / Black" },
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("Running Shoe - US 10 / Black");
  });

  // Arrange — single category reference
  it("returns category name for single category reference like primary category", () => {
    const attr: Attr = {
      __typename: "AssignedSingleCategoryReferenceAttribute",
      categoryReferenceValue: { __typename: "Category", name: "Women's Activewear" },
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("Women's Activewear");
  });

  // Arrange — single collection reference
  it("returns collection name for single collection reference like featured collection", () => {
    const attr: Attr = {
      __typename: "AssignedSingleCollectionReferenceAttribute",
      collectionReferenceValue: { __typename: "Collection", name: "Summer Sale 2026" },
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("Summer Sale 2026");
  });

  // Arrange — multi page reference
  it("returns comma-separated page titles for multi page reference like related guides", () => {
    const attr: Attr = {
      __typename: "AssignedMultiPageReferenceAttribute",
      multiPageReferenceValue: [
        { __typename: "Page", title: "Return Policy" },
        { __typename: "Page", title: "Warranty Information" },
      ],
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("Return Policy, Warranty Information");
  });

  // Arrange — multi product reference
  it("returns comma-separated product names for cross-sell products", () => {
    const attr: Attr = {
      __typename: "AssignedMultiProductReferenceAttribute",
      multiProductReferenceValue: [
        { __typename: "Product", name: "Wireless Mouse" },
        { __typename: "Product", name: "USB-C Hub" },
        { __typename: "Product", name: "Monitor Stand" },
      ],
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe(
      "Wireless Mouse, USB-C Hub, Monitor Stand",
    );
  });

  // Arrange — multi variant reference
  it("returns comma-separated variant names for bundle variants", () => {
    const attr: Attr = {
      __typename: "AssignedMultiProductVariantReferenceAttribute",
      multiVariantReferenceValue: [
        { __typename: "ProductVariant", name: "Espresso Beans - 250g" },
        { __typename: "ProductVariant", name: "Espresso Beans - 1kg" },
      ],
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe(
      "Espresso Beans - 250g, Espresso Beans - 1kg",
    );
  });

  // Arrange — multi category reference
  it("returns comma-separated category names for multi-category assignment", () => {
    const attr: Attr = {
      __typename: "AssignedMultiCategoryReferenceAttribute",
      multiCategoryReferenceValue: [
        { __typename: "Category", name: "Electronics" },
        { __typename: "Category", name: "Home Office" },
      ],
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe("Electronics, Home Office");
  });

  // Arrange — multi collection reference
  it("returns comma-separated collection names for product in multiple collections", () => {
    const attr: Attr = {
      __typename: "AssignedMultiCollectionReferenceAttribute",
      multiCollectionReferenceValue: [
        { __typename: "Collection", name: "New Arrivals" },
        { __typename: "Collection", name: "Best Sellers" },
        { __typename: "Collection", name: "Staff Picks" },
      ],
      attribute: baseAttribute,
    };

    // Act & Assert
    expect(getDisplayValueFromAssignedAttribute(attr)).toBe(
      "New Arrivals, Best Sellers, Staff Picks",
    );
  });
});
