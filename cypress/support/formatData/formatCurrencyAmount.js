export function getFormattedCurrencyAmount(amount, currency) {
  const language = window.navigator.userLanguage || window.navigator.language;
  return amount.toLocaleString(language, {
    currency,
    style: "currency"
  });
}

export function getCurrencyAndAmountInString(amount, currency) {
  return `${currency}${amount.toFixed(2)}`;
}
