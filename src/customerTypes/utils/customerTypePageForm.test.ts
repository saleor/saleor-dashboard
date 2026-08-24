import { type CustomerTypeForm } from "@dashboard/customerTypes/components/CustomerTypeDetailsPage/CustomerTypeDetailsPage";

import { isCustomerTypeUpdateFormPristine } from "./customerTypePageForm";

const initialData: CustomerTypeForm = {
  attributes: [{ label: "Loyalty level", value: "attr-1" }],
  metadata: [],
  name: "B2B",
  slug: "b2b",
  privateMetadata: [],
};

describe("isCustomerTypeUpdateFormPristine", () => {
  it("returns true when only non-form fields differ", () => {
    // Arrange
    const current: CustomerTypeForm = {
      ...initialData,
      attributes: [{ label: "Loyalty level", value: "attr-2" }],
    };

    // Act
    const pristine = isCustomerTypeUpdateFormPristine(current, initialData);

    // Assert
    expect(pristine).toBe(true);
  });

  it("returns false when name changes", () => {
    // Arrange
    const current: CustomerTypeForm = {
      ...initialData,
      name: "Wholesale",
    };

    // Act
    const pristine = isCustomerTypeUpdateFormPristine(current, initialData);

    // Assert
    expect(pristine).toBe(false);
  });

  it("returns false when slug changes", () => {
    // Arrange
    const current: CustomerTypeForm = {
      ...initialData,
      slug: "wholesale",
    };

    // Act
    const pristine = isCustomerTypeUpdateFormPristine(current, initialData);

    // Assert
    expect(pristine).toBe(false);
  });

  it("returns true when name and slug are reverted to initial values", () => {
    // Arrange
    const current: CustomerTypeForm = {
      ...initialData,
      name: "B2B",
      slug: "b2b",
    };

    // Act
    const pristine = isCustomerTypeUpdateFormPristine(current, initialData);

    // Assert
    expect(pristine).toBe(true);
  });
});
