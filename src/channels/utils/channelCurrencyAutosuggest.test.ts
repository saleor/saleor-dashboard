import {
  resolveCurrencyManualEditAfterChange,
  suggestCurrencyForCountry,
} from "./channelCurrencyAutosuggest";

const getSuggested = (countryCode: string): string | undefined => {
  const map: Record<string, string> = {
    US: "USD",
    PL: "PLN",
    EU: "EUR",
  };

  return map[countryCode];
};

describe("channelCurrencyAutosuggest", () => {
  it("marks non-empty currency changes as manual unless they echo autosuggest", () => {
    // Arrange
    const autosuggestState = {
      currencyManuallyEdited: false,
      pendingSuggestedCurrency: "USD",
    };

    // Act / Assert
    expect(
      resolveCurrencyManualEditAfterChange(autosuggestState, "USD").currencyManuallyEdited,
    ).toBe(false);
    expect(
      resolveCurrencyManualEditAfterChange(
        { currencyManuallyEdited: false, pendingSuggestedCurrency: null },
        "EUR",
      ).currencyManuallyEdited,
    ).toBe(true);
    expect(
      resolveCurrencyManualEditAfterChange(
        { currencyManuallyEdited: true, pendingSuggestedCurrency: null },
        "",
      ).currencyManuallyEdited,
    ).toBe(false);
  });

  it("suggests currency for country until the user overrides it manually", () => {
    // Arrange
    const initialState = {
      currencyManuallyEdited: false,
      pendingSuggestedCurrency: null,
    };

    // Act
    const firstSuggestion = suggestCurrencyForCountry(initialState, "US", getSuggested);
    const manualState = resolveCurrencyManualEditAfterChange(firstSuggestion.state, "GBP");
    const blockedSuggestion = suggestCurrencyForCountry(manualState, "PL", getSuggested);
    const resumedSuggestion = suggestCurrencyForCountry(
      { currencyManuallyEdited: false, pendingSuggestedCurrency: null },
      "PL",
      getSuggested,
    );

    // Assert
    expect(firstSuggestion.suggested).toBe("USD");
    expect(firstSuggestion.state.pendingSuggestedCurrency).toBe("USD");
    expect(manualState.currencyManuallyEdited).toBe(true);
    expect(blockedSuggestion.suggested).toBeUndefined();
    expect(resumedSuggestion.suggested).toBe("PLN");
  });

  it("supports European Union country code", () => {
    // Arrange / Act / Assert
    expect(
      suggestCurrencyForCountry(
        { currencyManuallyEdited: false, pendingSuggestedCurrency: null },
        "EU",
        getSuggested,
      ).suggested,
    ).toBe("EUR");
  });
});
