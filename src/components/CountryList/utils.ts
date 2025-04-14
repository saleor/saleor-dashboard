import { CountryFragment } from "@dashboard/graphql";

export const groupCountriesByStartingLetter = (countries: CountryFragment[]) =>
  countries.reduce(
    (acc, country) => {
      const firstLetter = country.country[0];

      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }

      acc[firstLetter].push(country);

      return acc;
    },
    {} as Record<string, CountryFragment[]>,
  );
