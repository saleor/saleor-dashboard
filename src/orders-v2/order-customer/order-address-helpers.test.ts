import { AddressFragment } from "@dashboard/graphql";

import { prepareAddressForClipboard } from "./order-address-helpers";

const createMockAddress = (overrides: Partial<AddressFragment> = {}): AddressFragment => ({
  __typename: "Address",
  id: "test-id",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  companyName: "Test Company",
  streetAddress1: "123 Main St",
  streetAddress2: "Apt 4B",
  city: "New York",
  cityArea: "",
  postalCode: "10001",
  countryArea: "NY",
  country: {
    __typename: "CountryDisplay",
    code: "US",
    country: "United States",
  },
  ...overrides,
});

describe("prepareAddressForClipboard", () => {
  it("should format a complete address correctly", () => {
    const address = createMockAddress();
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John Doe
+1234567890
Test Company
123 Main St Apt 4B
10001 New York
NY United States"
`);
  });

  it("should handle missing first name", () => {
    const address = createMockAddress({ firstName: "" });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"Doe
+1234567890
Test Company
123 Main St Apt 4B
10001 New York
NY United States"
`);
  });

  it("should handle missing last name", () => {
    const address = createMockAddress({ lastName: "" });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John
+1234567890
Test Company
123 Main St Apt 4B
10001 New York
NY United States"
`);
  });

  it("should handle missing both first and last name", () => {
    const address = createMockAddress({ firstName: "", lastName: "" });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"+1234567890
Test Company
123 Main St Apt 4B
10001 New York
NY United States"
`);
  });

  it("should handle missing phone number", () => {
    const address = createMockAddress({ phone: null });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John Doe
Test Company
123 Main St Apt 4B
10001 New York
NY United States"
`);
  });

  it("should handle missing company name", () => {
    const address = createMockAddress({ companyName: "" });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John Doe
+1234567890
123 Main St Apt 4B
10001 New York
NY United States"
`);
  });

  it("should handle missing streetAddress2", () => {
    const address = createMockAddress({ streetAddress2: "" });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John Doe
+1234567890
Test Company
123 Main St
10001 New York
NY United States"
`);
  });

  it("should handle missing streetAddress1", () => {
    const address = createMockAddress({ streetAddress1: "" });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John Doe
+1234567890
Test Company
Apt 4B
10001 New York
NY United States"
`);
  });

  it("should handle missing both street addresses", () => {
    const address = createMockAddress({ streetAddress1: "", streetAddress2: "" });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John Doe
+1234567890
Test Company
10001 New York
NY United States"
`);
  });

  it("should handle missing postal code", () => {
    const address = createMockAddress({ postalCode: "" });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John Doe
+1234567890
Test Company
123 Main St Apt 4B
New York
NY United States"
`);
  });

  it("should handle missing city", () => {
    const address = createMockAddress({ city: "" });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John Doe
+1234567890
Test Company
123 Main St Apt 4B
10001
NY United States"
`);
  });

  it("should handle missing both postal code and city", () => {
    const address = createMockAddress({ postalCode: "", city: "" });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John Doe
+1234567890
Test Company
123 Main St Apt 4B
NY United States"
`);
  });

  it("should handle missing country area", () => {
    const address = createMockAddress({ countryArea: "" });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John Doe
+1234567890
Test Company
123 Main St Apt 4B
10001 New York
United States"
`);
  });

  it("should handle missing country", () => {
    const address = createMockAddress({
      country: {
        __typename: "CountryDisplay",
        code: "US",
        country: "",
      },
    });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John Doe
+1234567890
Test Company
123 Main St Apt 4B
10001 New York
NY"
`);
  });

  it("should handle missing both country area and country", () => {
    const address = createMockAddress({
      countryArea: "",
      country: {
        __typename: "CountryDisplay",
        code: "US",
        country: "",
      },
    });
    const result = prepareAddressForClipboard(address);

    expect(result).toMatchInlineSnapshot(`
"John Doe
+1234567890
Test Company
123 Main St Apt 4B
10001 New York"
`);
  });

  it("should handle completely empty address", () => {
    const address = createMockAddress({
      firstName: "",
      lastName: "",
      phone: null,
      companyName: "",
      streetAddress1: "",
      streetAddress2: "",
      city: "",
      postalCode: "",
      countryArea: "",
      country: {
        __typename: "CountryDisplay",
        code: "",
        country: "",
      },
    });
    const result = prepareAddressForClipboard(address);

    expect(result).toBe("");
  });
});
