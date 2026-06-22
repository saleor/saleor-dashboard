import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import { AttributeInputTypeEnum, AttributeTypeEnum } from "@dashboard/graphql";

import {
  getAttributePageInitialForm,
  getAttributeUpdateComparableData,
  isAttributeUpdateFormPristine,
} from "./attributePageForm";

const baseFormData: AttributePageFormData = {
  availableInGrid: true,
  entityType: null,
  filterableInDashboard: true,
  filterableInStorefront: true,
  inputType: AttributeInputTypeEnum.DROPDOWN,
  metadata: [],
  name: "Color",
  privateMetadata: [],
  slug: "color",
  storefrontSearchPosition: "0",
  type: AttributeTypeEnum.PRODUCT_TYPE,
  valueRequired: true,
  visibleInStorefront: true,
  unit: null,
  referenceTypes: [],
};

describe("getAttributePageInitialForm", () => {
  it("should default to product type when creating without default type", () => {
    // Arrange & Act
    const form = getAttributePageInitialForm(null);

    // Assert
    expect(form.type).toBe(AttributeTypeEnum.PRODUCT_TYPE);
  });

  it("should use provided default type when creating", () => {
    // Arrange & Act
    const form = getAttributePageInitialForm(null, AttributeTypeEnum.PAGE_TYPE);

    // Assert
    expect(form.type).toBe(AttributeTypeEnum.PAGE_TYPE);
  });
});

describe("getAttributeUpdateComparableData", () => {
  it("normalizes slug from name when slug is empty", () => {
    // Arrange
    const data: AttributePageFormData = {
      ...baseFormData,
      name: "My Attribute",
      slug: "",
    };

    // Act
    const comparable = getAttributeUpdateComparableData(data);

    // Assert
    expect(comparable.slug).toBe("my-attribute");
  });

  it("sorts reference type ids for stable comparison", () => {
    // Arrange
    const data: AttributePageFormData = {
      ...baseFormData,
      referenceTypes: [
        { value: "b", label: "B" },
        { value: "a", label: "A" },
      ],
    };

    // Act
    const comparable = getAttributeUpdateComparableData(data);

    // Assert
    expect(comparable.referenceTypes).toEqual(["a", "b"]);
  });
});

describe("isAttributeUpdateFormPristine", () => {
  it("returns true when comparable values match", () => {
    // Arrange
    const initial = baseFormData;
    const current: AttributePageFormData = {
      ...baseFormData,
      metadata: [{ key: "ignored", value: "value" }],
      privateMetadata: [{ key: "ignored", value: "value" }],
    };

    // Act
    const pristine = isAttributeUpdateFormPristine(current, initial);

    // Assert
    expect(pristine).toBe(true);
  });

  it("returns false when a savable field changes", () => {
    // Arrange
    const initial = baseFormData;
    const current: AttributePageFormData = {
      ...baseFormData,
      name: "Size",
    };

    // Act
    const pristine = isAttributeUpdateFormPristine(current, initial);

    // Assert
    expect(pristine).toBe(false);
  });

  it("treats empty slug as equal to slug generated from name", () => {
    // Arrange
    const initial: AttributePageFormData = {
      ...baseFormData,
      name: "Color",
      slug: "color",
    };
    const current: AttributePageFormData = {
      ...baseFormData,
      name: "Color",
      slug: "",
    };

    // Act
    const pristine = isAttributeUpdateFormPristine(current, initial);

    // Assert
    expect(pristine).toBe(true);
  });
});
