import {
  getAddressCityLine,
  getAddressCountryLine,
  getAddressDisplayName,
  getAddressStreetLine,
} from "./formatAddressLines";
import { type ReadonlyAddressData } from "./types";

const sampleAddress: ReadonlyAddressData = {
  firstName: "Miroslaw",
  lastName: "Mencel",
  companyName: "Saleor Commerce, Inc.",
  streetAddress1: "South Dupont Highway",
  streetAddress2: "Suite GW-101",
  city: "DOVER",
  postalCode: "19901",
  countryArea: "DE",
  country: {
    code: "US",
    country: "United States of America",
  },
};

describe("formatAddressLines", () => {
  it("formats display name from first and last name", () => {
    // Arrange
    // Act
    const displayName = getAddressDisplayName(sampleAddress);

    // Assert
    expect(displayName).toBe("Miroslaw Mencel");
  });

  it("joins street lines with a comma", () => {
    // Arrange
    // Act
    const streetLine = getAddressStreetLine(sampleAddress);

    // Assert
    expect(streetLine).toBe("South Dupont Highway, Suite GW-101");
  });

  it("formats city line with postal code and city", () => {
    // Arrange
    // Act
    const cityLine = getAddressCityLine(sampleAddress);

    // Assert
    expect(cityLine).toBe("19901 DOVER");
  });

  it("includes country area in country line when present", () => {
    // Arrange
    // Act
    const countryLine = getAddressCountryLine(sampleAddress);

    // Assert
    expect(countryLine).toBe("DE, United States of America");
  });
});
