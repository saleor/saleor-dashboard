import { AddressValidationRulesQuery, useAddressValidationRulesQuery } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

import { selectRules, useAddressValidation } from "./useAddressValidation";

jest.mock("@dashboard/graphql", () => ({
  CountryCode: jest.requireActual("@dashboard/graphql").CountryCode,
  useAddressValidationRulesQuery: jest.fn(),
}));

describe("useAddressValidation", () => {
  it("skips loading validation rules when country is not provided", () => {
    // Arrange
    (useAddressValidationRulesQuery as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
    });

    // Act
    const {
      result: { current },
    } = renderHook(() => useAddressValidation());

    // Assert
    expect(current.areas).toEqual([]);
    expect(current.loading).toBeFalsy();
    expect(useAddressValidationRulesQuery).toBeCalledWith({
      skip: true,
      variables: { countryCode: undefined },
    });
    expect(current.isFieldAllowed("country")).toBeFalsy();
  });

  it("loads validation rules when country is provided", () => {
    // Arrange
    (useAddressValidationRulesQuery as jest.Mock).mockReturnValue({
      data: {
        addressValidationRules: {
          countryAreaChoices: [
            { raw: "AL", verbose: "Alabama" },
            { raw: "AN", verbose: "Ancona" },
          ],
          allowedFields: ["country"],
        },
      },
      loading: false,
    });

    // Act
    const {
      result: { current },
    } = renderHook(() => useAddressValidation("US"));

    // Assert
    expect(current.areas).toEqual([
      { label: "Alabama", value: "Alabama", raw: "AL" },
      { label: "Ancona", value: "Ancona", raw: "AN" },
    ]);
    expect(current.loading).toBeFalsy();
    expect(useAddressValidationRulesQuery).toBeCalledWith({
      skip: false,
      variables: { countryCode: "US" },
    });
    expect(current.isFieldAllowed("country")).toBeTruthy();
    expect(current.isFieldAllowed("countryArea")).toBeFalsy();
  });

  it("getDisplayValue should return display value for area code when valid", () => {
    // Arrange
    (useAddressValidationRulesQuery as jest.Mock).mockReturnValue({
      data: {
        addressValidationRules: {
          countryAreaChoices: [
            { raw: "AL", verbose: "Alabama" },
            { raw: "AN", verbose: "Ancona" },
          ],
          allowedFields: ["country"],
        },
      },
      loading: false,
    });

    const {
      result: { current },
    } = renderHook(() => useAddressValidation("US"));

    const displayValue = current.getDisplayValue("AL");

    // Assert
    expect(displayValue).toEqual("Alabama");
  });

  it("getDisplayValue should return value when area code invalid", () => {
    // Arrange
    (useAddressValidationRulesQuery as jest.Mock).mockReturnValue({
      data: {
        addressValidationRules: {
          countryAreaChoices: [
            { raw: "AL", verbose: "Alabama" },
            { raw: "AN", verbose: "Ancona" },
          ],
          allowedFields: ["country"],
        },
      },
      loading: false,
    });

    const {
      result: { current },
    } = renderHook(() => useAddressValidation("US"));

    const displayValue = current.getDisplayValue("XX");

    // Assert
    expect(displayValue).toEqual("XX");
  });

  it("getDisplayValue should return empty string when value is null", () => {
    // Arrange
    (useAddressValidationRulesQuery as jest.Mock).mockReturnValue({
      data: {
        addressValidationRules: {
          countryAreaChoices: [
            { raw: "AL", verbose: "Alabama" },
            { raw: "AN", verbose: "Ancona" },
          ],
          allowedFields: ["country"],
        },
      },
      loading: false,
    });

    const {
      result: { current },
    } = renderHook(() => useAddressValidation("US"));

    const displayValue = current.getDisplayValue(null);

    // Assert
    expect(displayValue).toEqual("");
  });
});

describe("selectRules", () => {
  it("should return select rules when available", () => {
    // Arrange
    const data = {
      addressValidationRules: {
        countryAreaChoices: [
          { raw: "AL", verbose: "Alabama" },
          { raw: "AN", verbose: "Ancona" },
        ],
        allowedFields: ["country"],
      },
    } as AddressValidationRulesQuery;

    // Act
    const rules = selectRules(data);

    // Assert
    expect(rules).toEqual({
      countryAreaChoices: [
        { raw: "AL", verbose: "Alabama" },
        { raw: "AN", verbose: "Ancona" },
      ],
      allowedFields: ["country"],
    });
  });

  it("should return empty array when addressValidationRules is not provided", () => {
    // Arrange
    const data = {
      addressValidationRules: null,
    } as AddressValidationRulesQuery;

    // Act
    const rules = selectRules(data);

    // Assert
    expect(rules).toEqual({ countryAreaChoices: [], allowedFields: [] });
  });

  it("should return empty array when data is not provided", () => {
    // Arrange
    const data = undefined;

    // Act
    const rules = selectRules(data);

    // Assert
    expect(rules).toEqual({ countryAreaChoices: [], allowedFields: [] });
  });
});
