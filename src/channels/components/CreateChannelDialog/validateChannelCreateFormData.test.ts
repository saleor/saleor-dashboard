import { ChannelErrorCode, CountryCode } from "@dashboard/graphql";

import { validateChannelCreateFormData } from "./validateChannelCreateFormData";

describe("validateChannelCreateFormData", () => {
  it("returns no errors for a complete form", () => {
    // Arrange / Act
    const errors = validateChannelCreateFormData({
      name: "EU",
      slug: "eu",
      currencyCode: "EUR",
      defaultCountry: CountryCode.DE,
    });

    // Assert
    expect(errors).toEqual([]);
  });

  it("requires name, slug, currency, and country", () => {
    // Arrange / Act
    const errors = validateChannelCreateFormData({
      name: "  ",
      slug: "",
      currencyCode: "",
      defaultCountry: "",
    });

    // Assert
    expect(errors.map(error => error.field).sort()).toEqual([
      "currencyCode",
      "defaultCountry",
      "name",
      "slug",
    ]);
    expect(errors.every(error => error.code === ChannelErrorCode.REQUIRED)).toBe(true);
  });
});
