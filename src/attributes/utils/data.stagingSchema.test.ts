import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import { AttributeInputTypeEnum, AttributeTypeEnum } from "@dashboard/graphql";

import { getAttributeData } from "./data";

jest.mock("@dashboard/graphql/schemaVersion", () => ({
  isMainSchema: () => false,
  isStagingSchema: () => true,
}));

const formData: AttributePageFormData = {
  availableInGrid: true,
  entityType: null,
  filterableInStorefront: true,
  inputType: AttributeInputTypeEnum.DROPDOWN,
  metadata: [],
  name: "Color",
  privateMetadata: [],
  slug: "color",
  storefrontSearchPosition: "3",
  type: AttributeTypeEnum.PRODUCT_TYPE,
  valueRequired: true,
  visibleInStorefront: true,
  unit: null,
  referenceTypes: [],
};

describe("getAttributeData with staging schema", () => {
  it("omits faceted navigation fields removed from the API in 3.24", () => {
    // Arrange
    const values = [{ name: "Red" }];

    // Act
    const input = getAttributeData(formData, values);

    // Assert
    expect(input.filterableInStorefront).toBeUndefined();
    expect(input.storefrontSearchPosition).toBeUndefined();
  });
});
