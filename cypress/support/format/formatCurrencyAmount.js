export function getFormattedCurrencyAmount(amount, currency) {
  const language = window.navigator.userLanguage || window.navigator.language;
  const formattedCurrencyAmount = createdChannelPrice.toLocaleString(language, {
    currency: createdChannelCurrency,
    style: "currency"
  });
  return formattedCurrencyAmount;
}
