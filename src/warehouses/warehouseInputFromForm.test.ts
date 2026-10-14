import { type AddressTypeInput } from "@dashboard/customers/types";
import { CountryCode } from "@dashboard/graphql";

import { warehouseInputFromForm } from "./warehouseInputFromForm";

describe("warehouseInputFromForm", () => {
  it("maps the form's name and address, with the country as a code", () => {
    // Arrange
    const data: AddressTypeInput & { name: string } = {
      name: "Berlin",
      companyName: "Saleor",
      city: "Berlin",
      country: "DE",
      phone: "+4930123456",
      postalCode: "10115",
      streetAddress1: "Invalidenstrasse 1",
    };

    // Act
    const input = warehouseInputFromForm(data);

    // Assert
    expect(input).toEqual({
      name: "Berlin",
      address: {
        companyName: "Saleor",
        city: "Berlin",
        cityArea: undefined,
        country: CountryCode.DE,
        countryArea: undefined,
        phone: "+4930123456",
        postalCode: "10115",
        streetAddress1: "Invalidenstrasse 1",
        streetAddress2: undefined,
      },
    });
  });
});
