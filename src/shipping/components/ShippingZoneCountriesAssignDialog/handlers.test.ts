import { type CountryWithCodeFragment } from "@dashboard/graphql";

import { toggleRestOfTheWorldSelection } from "./handlers";

const countries: CountryWithCodeFragment[] = [
  { __typename: "CountryDisplay", code: "PL", country: "Poland" },
  { __typename: "CountryDisplay", code: "DE", country: "Germany" },
  { __typename: "CountryDisplay", code: "US", country: "United States" },
];

describe("toggleRestOfTheWorldSelection", () => {
  it("adds unassigned rest-of-world countries when enabled", () => {
    // Arrange
    const selectedCountries = ["PL"];
    const restWorldCountries = ["DE", "US"];

    // Act
    const result = toggleRestOfTheWorldSelection(
      selectedCountries,
      restWorldCountries,
      countries,
      true,
    );

    // Assert
    expect(result.sort()).toEqual(["DE", "PL", "US"].sort());
  });

  it("removes rest-of-world countries when disabled", () => {
    // Arrange
    const selectedCountries = ["PL", "DE", "US"];
    const restWorldCountries = ["DE", "US"];

    // Act
    const result = toggleRestOfTheWorldSelection(
      selectedCountries,
      restWorldCountries,
      countries,
      false,
    );

    // Assert
    expect(result).toEqual(["PL"]);
  });
});
