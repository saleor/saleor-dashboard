import { AttributeEntityTypeEnum, AttributeInputTypeEnum } from "@dashboard/graphql";

import { getExcludeAssignedAttributeValue } from "./utils";

describe("getExcludeAssignedAttributeValue", () => {
  it("should not exclude for SINGLE_REFERENCE so the current selection stays visible", () => {
    // Act
    const exclude = getExcludeAssignedAttributeValue({
      inputType: AttributeInputTypeEnum.SINGLE_REFERENCE,
      entityType: AttributeEntityTypeEnum.PRODUCT,
      value: ["prod-1"],
    });

    // Assert
    expect(exclude).toBeUndefined();
  });

  it("should not exclude PRODUCT_VARIANT rows — AssignVariantDialog disables them via selectedIds", () => {
    // Act
    const exclude = getExcludeAssignedAttributeValue({
      inputType: AttributeInputTypeEnum.REFERENCE,
      entityType: AttributeEntityTypeEnum.PRODUCT_VARIANT,
      value: ["var-1", "var-3"],
    });

    // Assert
    expect(exclude).toBeUndefined();
  });

  it("should return undefined when nothing is assigned yet", () => {
    // Act
    const exclude = getExcludeAssignedAttributeValue({
      inputType: AttributeInputTypeEnum.REFERENCE,
      entityType: AttributeEntityTypeEnum.PRODUCT,
      value: [],
    });

    // Assert
    expect(exclude).toBeUndefined();
  });

  it("should exclude already-assigned products for REFERENCE type", () => {
    // Act
    const exclude = getExcludeAssignedAttributeValue({
      inputType: AttributeInputTypeEnum.REFERENCE,
      entityType: AttributeEntityTypeEnum.PRODUCT,
      value: ["prod-1", "prod-3"],
    });

    // Assert
    expect(exclude).toBeDefined();
    expect(exclude!({ id: "prod-1" })).toBe(true);
    expect(exclude!({ id: "prod-2" })).toBe(false);
    expect(exclude!({ id: "prod-3" })).toBe(true);
  });

  it("should exclude already-assigned pages for REFERENCE type", () => {
    // Act
    const exclude = getExcludeAssignedAttributeValue({
      inputType: AttributeInputTypeEnum.REFERENCE,
      entityType: AttributeEntityTypeEnum.PAGE,
      value: ["page-2"],
    });

    // Assert
    expect(exclude!({ id: "page-1" })).toBe(false);
    expect(exclude!({ id: "page-2" })).toBe(true);
  });
});
