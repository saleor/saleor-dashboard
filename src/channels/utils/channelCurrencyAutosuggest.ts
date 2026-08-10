export interface ChannelCurrencyAutosuggestState {
  currencyManuallyEdited: boolean;
  pendingSuggestedCurrency: string | null;
}

/**
 * Macaw DynamicCombobox echoes programmatic value updates via onChange.
 * Track pending autosuggest values so those echoes do not lock manual mode.
 */
export const resolveCurrencyManualEditAfterChange = (
  state: ChannelCurrencyAutosuggestState,
  nextCurrencyCode: string,
): ChannelCurrencyAutosuggestState => {
  const trimmed = nextCurrencyCode.trim();

  if (state.pendingSuggestedCurrency === trimmed) {
    return {
      currencyManuallyEdited: state.currencyManuallyEdited,
      pendingSuggestedCurrency: null,
    };
  }

  return {
    currencyManuallyEdited: !!trimmed,
    pendingSuggestedCurrency: null,
  };
};

export const suggestCurrencyForCountry = (
  state: ChannelCurrencyAutosuggestState,
  countryCode: string,
  getSuggestedCurrencyCode: (code: string) => string | undefined,
): { state: ChannelCurrencyAutosuggestState; suggested?: string } => {
  if (state.currencyManuallyEdited || !countryCode.trim()) {
    return { state };
  }

  const suggested = getSuggestedCurrencyCode(countryCode.trim());

  if (!suggested) {
    return { state };
  }

  return {
    state: {
      ...state,
      pendingSuggestedCurrency: suggested,
    },
    suggested,
  };
};
