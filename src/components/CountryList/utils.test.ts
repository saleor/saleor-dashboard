import { CountryFragment } from "@dashboard/graphql";

import { groupCountriesByStartingLetter } from "./utils";

describe("CountryList / utils / groupCountriesByStartingLetter", () => {
  it("should group countries by starting letter", () => {
    // Arrange
    const countries = [
      { country: "Poland" },
      { country: "Portugal" },
      { country: "Germany" },
      { country: "France" },
    ] as unknown as CountryFragment[];
    // Act
    const result = groupCountriesByStartingLetter(countries);

    // Assert
    expect(result).toEqual({
      P: [{ country: "Poland" }, { country: "Portugal" }],
      G: [{ country: "Germany" }],
      F: [{ country: "France" }],
    });
  });

  it("should handle empty array", () => {
    // Arrange
    const countries = [] as CountryFragment[];

    // Act
    const result = groupCountriesByStartingLetter(countries);

    // Assert
    expect(result).toEqual({});
  });
});
