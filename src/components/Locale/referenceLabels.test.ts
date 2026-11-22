import { gql, InMemoryCache } from "@apollo/client";

import { referenceLabelsLocale, referenceLabelTypePolicies } from "./referenceLabels";

const query = gql`
  query ReferenceLabels {
    shop {
      countries {
        code
        country
      }
      languages {
        code
        language
      }
    }
  }
`;

interface ReferenceLabelsData {
  shop: {
    __typename: "Shop";
    countries: Array<{ __typename: "CountryDisplay"; code: string; country: string }>;
    languages: Array<{ __typename: "LanguageDisplay"; code: string; language: string }>;
  };
}

const data: ReferenceLabelsData = {
  shop: {
    __typename: "Shop",
    countries: [
      { __typename: "CountryDisplay", code: "FR", country: "France" },
      { __typename: "CountryDisplay", code: "DE", country: "Germany" },
    ],
    languages: [{ __typename: "LanguageDisplay", code: "FR", language: "French" }],
  },
};

const createCache = (cached: ReferenceLabelsData = data): InMemoryCache => {
  const cache = new InMemoryCache({ typePolicies: referenceLabelTypePolicies });

  cache.writeQuery({ query, data: cached });

  return cache;
};

const read = (cache: InMemoryCache): ReferenceLabelsData["shop"] =>
  (cache.readQuery<ReferenceLabelsData>({ query }) as ReferenceLabelsData).shop;

describe("referenceLabelTypePolicies", () => {
  afterEach(() => {
    referenceLabelsLocale("en");
  });

  it("keeps the API's English names in English", () => {
    // Arrange
    const cache = createCache();

    // Act
    const shop = read(cache);

    // Assert
    expect(shop.countries.map(({ country }) => country)).toEqual(["France", "Germany"]);
    expect(shop.languages[0].language).toBe("French");
  });

  it.each([
    ["pt", ["França", "Alemanha"], "francês"],
    ["de", ["Frankreich", "Deutschland"], "Französisch"],
  ])(
    "names countries and languages in the Dashboard language (%s)",
    (locale, countries, language) => {
      // Arrange
      const cache = createCache();

      // Act
      referenceLabelsLocale(locale);

      // Assert
      const shop = read(cache);

      expect(shop.countries.map(({ country }) => country)).toEqual(countries);
      expect(shop.languages[0].language).toBe(language);
      expect(shop.countries.map(({ code }) => code)).toEqual(["FR", "DE"]);
    },
  );

  it("updates watched queries when the language changes, without rewriting cached data", () => {
    // Arrange
    const cache = createCache();
    const raw = cache.extract();
    const callback = jest.fn();
    const stop = cache.watch({ query, callback, optimistic: false });

    read(cache);

    // Act
    referenceLabelsLocale("pt");

    // Assert
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0].result.shop.countries[0].country).toBe("França");
    expect(cache.extract()).toEqual(raw);
    stop();
  });

  it("keeps the API's name when a code has no name in the browser", () => {
    // Arrange
    const unknown: ReferenceLabelsData = {
      shop: {
        __typename: "Shop",
        countries: [{ __typename: "CountryDisplay", code: "invalid-code", country: "Original" }],
        languages: [{ __typename: "LanguageDisplay", code: "zz", language: "Unknown language" }],
      },
    };
    const cache = createCache(unknown);

    // Act
    referenceLabelsLocale("pt");

    // Assert
    expect(read(cache)).toEqual(unknown.shop);
  });
});
