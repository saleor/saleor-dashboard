import { useAddressValidationRulesQuery } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";
import { Mock } from "vitest";

import { useAddressValidation } from "./useAddressValidation";

vi.mock("@dashboard/graphql", async () => {
  const actual = await vi.importActual<typeof import("@dashboard/graphql")>(
    "@dashboard/graphql",
  );

  return {
    CountryCode: actual.CountryCode,
    useAddressValidationRulesQuery: vi.fn(),
  };
});

describe("useAddressValidation", () => {
  it("skips loading validation rules when country is not provided", () => {
    // Arrange
    (useAddressValidationRulesQuery as Mock).mockReturnValue({
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
    (useAddressValidationRulesQuery as Mock).mockReturnValue({
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
});
