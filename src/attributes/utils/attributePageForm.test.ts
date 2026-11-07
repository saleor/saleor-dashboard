import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage/AttributePage";
import { AttributeInputTypeEnum, AttributeTypeEnum } from "@dashboard/graphql";
import { isMainSchema } from "@dashboard/graphql/schemaVersion";

import {
  getAttributePageInitialForm,
  getAttributeUpdateComparableData,
  getDeprecatedAttributeInputEvents,
  isAttributeUpdateFormPristine,
} from "./attributePageForm";

jest.mock("@dashboard/graphql/schemaVersion", () => ({
  isMainSchema: jest.fn(() => true),
}));

const baseFormData: AttributePageFormData = {
  availableInGrid: true,
  entityType: null,
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

describe("getDeprecatedAttributeInputEvents", () => {
  it("returns no events when deprecated fields are unchanged", () => {
    // Arrange
    const current: AttributePageFormData = { ...baseFormData, name: "Size" };

    // Act
    const events = getDeprecatedAttributeInputEvents(current, baseFormData);

    // Assert
    expect(events).toEqual([]);
  });

  it("returns an event for each changed deprecated field", () => {
    // Arrange
    const current: AttributePageFormData = {
      ...baseFormData,
      filterableInStorefront: false,
      storefrontSearchPosition: "5",
    };

    // Act
    const events = getDeprecatedAttributeInputEvents(current, baseFormData);

    // Assert
    expect(events).toEqual([
      "attribute_filterable_in_storefront_submitted",
      "attribute_storefront_search_position_submitted",
    ]);
  });

  it("returns no events on the staging schema, which does not send these fields", () => {
    // Arrange
    (isMainSchema as jest.Mock).mockReturnValueOnce(false);

    const current: AttributePageFormData = { ...baseFormData, filterableInStorefront: false };

    // Act
    const events = getDeprecatedAttributeInputEvents(current, baseFormData);

    // Assert
    expect(events).toEqual([]);
  });
});
