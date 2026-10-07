import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";

import { buildWarehouseSaveComposition, hasWarehouseSaveComposition } from "./saveComposition";
import { type WarehouseDetailsPageFormData } from "./types";

const baseFormData: WarehouseDetailsPageFormData = {
  name: "Main",
  email: "ops@example.com",
  city: "Wrocław",
  companyName: "Saleor",
  country: "PL",
  countryArea: "",
  phone: "",
  postalCode: "50-001",
  streetAddress1: "Street 1",
  streetAddress2: "",
  isPrivate: true,
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum.DISABLED,
};

describe("buildWarehouseSaveComposition", () => {
  it("returns general when name or email changes", () => {
    // Arrange
    const composition = buildWarehouseSaveComposition(
      { ...baseFormData, name: "Updated" },
      baseFormData,
    );

    // Assert
    expect(composition.hasGeneral).toBe(true);
    expect(composition.hasAddress).toBe(false);
    expect(hasWarehouseSaveComposition(composition)).toBe(true);
  });

  it("returns address when an address field changes", () => {
    // Arrange
    const composition = buildWarehouseSaveComposition(
      { ...baseFormData, city: "Kraków" },
      baseFormData,
    );

    // Assert
    expect(composition.hasAddress).toBe(true);
    expect(composition.hasGeneral).toBe(false);
  });

  it("returns pickup when pickup settings change", () => {
    // Arrange
    const composition = buildWarehouseSaveComposition(
      {
        ...baseFormData,
        isPrivate: false,
        clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL,
      },
      baseFormData,
    );

    // Assert
    expect(composition.hasPickup).toBe(true);
  });

  it("returns nothing when the form matches the saved warehouse", () => {
    // Arrange
    const composition = buildWarehouseSaveComposition(baseFormData, baseFormData);

    // Assert
    expect(hasWarehouseSaveComposition(composition)).toBe(false);
  });
});
