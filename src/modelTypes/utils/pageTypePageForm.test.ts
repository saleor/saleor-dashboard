import { type PageTypeForm } from "@dashboard/modelTypes/components/PageTypeDetailsPage/PageTypeDetailsPage";

import { isPageTypeUpdateFormPristine } from "./pageTypePageForm";

const initialData: PageTypeForm = {
  attributes: [{ label: "Title", value: "attr-1" }],
  metadata: [],
  name: "Blog",
  privateMetadata: [],
};

describe("isPageTypeUpdateFormPristine", () => {
  it("returns true when only non-form fields differ", () => {
    // Arrange
    const current: PageTypeForm = {
      ...initialData,
      attributes: [{ label: "Title", value: "attr-2" }],
    };

    // Act
    const pristine = isPageTypeUpdateFormPristine(current, initialData);

    // Assert
    expect(pristine).toBe(true);
  });

  it("returns false when name changes", () => {
    // Arrange
    const current: PageTypeForm = {
      ...initialData,
      name: "Landing Page",
    };

    // Act
    const pristine = isPageTypeUpdateFormPristine(current, initialData);

    // Assert
    expect(pristine).toBe(false);
  });

  it("returns true when name is reverted to initial value", () => {
    // Arrange
    const current: PageTypeForm = {
      ...initialData,
      name: "Blog",
    };

    // Act
    const pristine = isPageTypeUpdateFormPristine(current, initialData);

    // Assert
    expect(pristine).toBe(true);
  });
});
