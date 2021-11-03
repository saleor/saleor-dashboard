export const getValueWithDefault = (condition, value, defaultValue = "") =>
  condition ? value : defaultValue;

export function getDefaultAddress(address, addressType, withName = true) {
  if (!address) {
    return "";
  }
  const defaultAddress = `city: "${address.city}" 
    country: ${address.country}
    countryArea: "${address.countryArea}"
    phone: "${address.phone}"
    postalCode: "${address.postalCode}"
    streetAddress1: "${address.streetAddress1}"
    streetAddress2: "${address.streetAddress2}"`;
  if (withName) {
    defaultAddress.concat(`firstName: "Test"
    lastName: "Test"
    companyName: "${address.companyName}"`);
  }
  return `${addressType}:{${defaultAddress}}`;
}

export function getVariantsLines(variantsList, quantity) {
  return variantsList.map(
    variant => `{quantity:${quantity}
                    variantId:"${variant.id}"}`
  );
}

export function getVariantsIdsLines(variantsList) {
  return variantsList.map(variant => `${variant.id}`);
}

export function getVariantsListIds(variantsList) {
  return variantsList.map(variant => `"${variant.id}"`).join();
}

export const getPaymentDataLine = paymentData =>
  paymentData
    ? `, paymentData:"{\\"riskData\\":{\\"clientData\\":\\"${paymentData.clientData}\\"}, \\"paymentMethod\\":{\\"type\\":\\"scheme\\", \\"encryptedCardNumber\\":\\"${paymentData.encryptedCardNumber}\\", \\"encryptedExpiryMonth\\":\\"${paymentData.encryptedExpiryMonth}\\", \\"encryptedExpiryYear\\":\\"${paymentData.encryptedExpiryYear}\\", \\"encryptedSecurityCode\\":\\"${paymentData.encryptedSecurityCode}\\", \\"brand\\":\\"${paymentData.brand}\\"}}"`
    : "";

export const getValuesInArray = array =>
  getValueWithDefault(array.length === 1, `["${array}"]`, `${array}`);
