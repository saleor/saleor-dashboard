import { type AddressType } from "@dashboard/customers/types";

import { formatAddressForClipboard } from "./formatForClipboard";

describe("formatAddressForClipboard", () => {
  it("formats address fields as newline-separated clipboard text", () => {
    // Arrange
    const address: AddressType = {
      id: "address-id",
      firstName: "Jane",
      lastName: "Doe",
      companyName: "ACME Inc.",
      streetAddress1: "Teczowa 7",
      streetAddress2: "Apt 4",
      postalCode: "53-601",
      city: "Wroclaw",
      countryArea: "Lower Silesia",
      country: {
        code: "PL",
        country: "Poland",
      },
      phone: "+48 123 456 789",
    };

    // Act
    const result = formatAddressForClipboard(address);

    // Assert
    expect(result).toBe(
      [
        "Jane Doe",
        "ACME Inc.",
        "Teczowa 7",
        "Apt 4",
        "53-601 Wroclaw",
        "Lower Silesia",
        "Poland",
        "+48 123 456 789",
      ].join("\n"),
    );
  });

  it("omits empty address fields without adding blank lines", () => {
    // Arrange
    const address: AddressType = {
      id: "address-id",
      firstName: "Jane",
      lastName: "",
      companyName: "",
      streetAddress1: "Teczowa 7",
      streetAddress2: "",
      postalCode: "",
      city: "Wroclaw",
      countryArea: "",
      country: {
        code: "PL",
        country: "Poland",
      },
      phone: null,
    };

    // Act
    const result = formatAddressForClipboard(address);

    // Assert
    expect(result).toBe(["Jane", "Teczowa 7", "Wroclaw", "Poland"].join("\n"));
  });
});
