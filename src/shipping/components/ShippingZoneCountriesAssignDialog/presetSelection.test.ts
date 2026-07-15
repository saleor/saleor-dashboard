import { EU_MEMBER_STATE_COUNTRY_CODES, NORTH_AMERICA_COUNTRY_CODES } from "./countryPresets";
import {
  getAvailablePresetCountryCodes,
  isPresetFullySelected,
  togglePresetSelection,
} from "./presetSelection";

describe("presetSelection", () => {
  const availableCountryCodes = ["PL", "DE", "US", "CA", "JP"];

  it("returns only preset countries that exist in the shop", () => {
    // Act
    const result = getAvailablePresetCountryCodes(
      EU_MEMBER_STATE_COUNTRY_CODES,
      availableCountryCodes,
    );

    // Assert
    expect(result.sort()).toEqual(["DE", "PL"]);
  });

  it("selects and clears a preset group", () => {
    // Arrange
    const selected = ["PL"];

    // Act
    const withNorthAmerica = togglePresetSelection(
      selected,
      NORTH_AMERICA_COUNTRY_CODES,
      availableCountryCodes,
      true,
    );
    const cleared = togglePresetSelection(
      withNorthAmerica,
      NORTH_AMERICA_COUNTRY_CODES,
      availableCountryCodes,
      false,
    );

    // Assert
    expect(withNorthAmerica.sort()).toEqual(["CA", "PL", "US"].sort());
    expect(cleared).toEqual(["PL"]);
    expect(
      isPresetFullySelected(NORTH_AMERICA_COUNTRY_CODES, withNorthAmerica, availableCountryCodes),
    ).toBe(true);
  });
});
