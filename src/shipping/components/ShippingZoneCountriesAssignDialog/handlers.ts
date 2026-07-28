import { type CountryWithCodeFragment } from "@dashboard/graphql";
import { getCountrySelectionMap } from "@dashboard/shipping/handlers";

export function toggleRestOfTheWorldSelection(
  selectedCountries: string[],
  restWorldCountries: string[],
  countries: CountryWithCodeFragment[],
  restOfTheWorld: boolean,
): string[] {
  const countrySelectionMap = getCountrySelectionMap(countries, selectedCountries);

  if (restOfTheWorld) {
    return restWorldCountries
      .filter(countryCode => !countrySelectionMap[countryCode])
      .concat(selectedCountries);
  }

  return selectedCountries.filter(
    countryCode => !(countrySelectionMap[countryCode] && restWorldCountries.includes(countryCode)),
  );
}
