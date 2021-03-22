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
