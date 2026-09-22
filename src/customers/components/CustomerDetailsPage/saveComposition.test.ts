import { buildCustomerSaveComposition, hasCustomerSaveComposition } from "./saveComposition";

const initial = {
  customerTypeId: "type-1",
  email: "tom@example.com",
  firstName: "Tom",
  lastName: "Cooper",
  note: "",
};

describe("buildCustomerSaveComposition", () => {
  it("is empty when the form matches the saved customer", () => {
    // Arrange & Act
    const composition = buildCustomerSaveComposition({
      attributesDirty: false,
      data: initial,
      initial,
    });

    // Assert
    expect(hasCustomerSaveComposition(composition)).toBe(false);
  });

  it("flags general identity fields separately from type and attributes", () => {
    // Arrange & Act
    const composition = buildCustomerSaveComposition({
      attributesDirty: true,
      data: { ...initial, firstName: "Thomas", customerTypeId: "type-2" },
      initial,
    });

    // Assert
    expect(composition).toEqual({
      hasAttributes: true,
      hasGeneral: true,
      hasType: true,
    });
  });
});
