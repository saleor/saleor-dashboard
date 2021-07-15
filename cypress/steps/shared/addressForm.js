import { ADDRESS_SELECTORS } from "../../elements/shared/addressForm";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { fillAutocompleteSelect } from "./selects";

export function fillUpAddressFormAndSubmit(address) {
  fillUpAddressForm();
  cy.get(BUTTON_SELECTORS.submit).click();
}

export function fillUpAddressForm(address) {
  cy.get(ADDRESS_SELECTORS.firstName)
    .type(address.firstName)
    .get(ADDRESS_SELECTORS.lastName)
    .type(address.lastName);
  fillUpBasicAddress(address);
}

export function fillUpBasicAddress(address) {
  cy.get(ADDRESS_SELECTORS.companyName)
    .type(address.companyName)
    .get(ADDRESS_SELECTORS.phone)
    .type(address.phone)
    .get(ADDRESS_SELECTORS.streetAddress1)
    .type(address.streetAddress1)
    .get(ADDRESS_SELECTORS.streetAddress2)
    .type(address.streetAddress2)
    .get(ADDRESS_SELECTORS.city)
    .type(address.city)
    .get(ADDRESS_SELECTORS.postalCode)
    .type(address.postalCode);
  fillAutocompleteSelect(ADDRESS_SELECTORS.country, address.countryFullName);
  cy.get(ADDRESS_SELECTORS.countryArea).type(address.countryArea);
}
