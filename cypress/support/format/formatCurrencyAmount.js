export function getFormattedCurrencyAmount(amount, currency) {
  const language = window.navigator.userLanguage || window.navigator.language;
  const formattedCurrencyAmount = amount.toLocaleString(language, {
    currency,
    style: "currency"
  });
  return formattedCurrencyAmount;
}

export function getCurrencyAndAmountInString(amount, currency) {
  return `${currency}${amount.toFixed(2)}`;
}
