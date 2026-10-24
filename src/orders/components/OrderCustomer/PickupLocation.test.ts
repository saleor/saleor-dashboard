import { type ReadonlyAddressData } from "@dashboard/components/ReadonlyAddress/types";

import { formatPickupLocationForClipboard } from "./PickupLocation";

const warehouseAddress: ReadonlyAddressData = {
  firstName: "Regina",
  lastName: "Larson",
  companyName: "Saleor",
  phone: "+1 212 555 0142",
  streetAddress1: "799 Cedar Ln",
  streetAddress2: "Suite 2",
  city: "NEW YORK",
  cityArea: "Manhattan",
  postalCode: "10001",
  countryArea: "NY",
  country: {
    code: "US",
    country: "United States of America",
  },
};

describe("formatPickupLocationForClipboard", () => {
  it("copies the location name and the address shown, without the warehouse contact or stock rule", () => {
    // Arrange
    const location = {
      name: "Downtown warehouse",
      address: warehouseAddress,
    };

    // Act
    const result = formatPickupLocationForClipboard(location);

    // Assert
    expect(result).toBe(
      [
        "Downtown warehouse",
        "Saleor",
        "799 Cedar Ln, Suite 2",
        "10001 NEW YORK Manhattan",
        "NY, United States of America",
        "+1 212 555 0142",
      ].join("\n"),
    );
    expect(result).not.toContain("Regina Larson");
  });

  it("copies only the address when the location has no name", () => {
    // Arrange
    const location = {
      name: null,
      address: warehouseAddress,
    };

    // Act
    const result = formatPickupLocationForClipboard(location);

    // Assert
    expect(result.startsWith("Saleor")).toBe(true);
  });
});
