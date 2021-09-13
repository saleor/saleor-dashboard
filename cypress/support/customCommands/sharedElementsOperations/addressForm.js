import { ADDRESS_SELECTORS } from "../../../elements/shared/addressForm";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";

Cypress.Commands.add("fillUpBasicAddress", address => {
  cy.get(ADDRESS_SELECTORS.companyName)
    .clearAndType(address.companyName)
    .get(ADDRESS_SELECTORS.phone)
    .clearAndType(address.phone)
    .get(ADDRESS_SELECTORS.streetAddress1)
    .clearAndType(address.streetAddress1)
    .get(ADDRESS_SELECTORS.streetAddress2)
    .clearAndType(address.streetAddress2)
    .get(ADDRESS_SELECTORS.city)
    .clearAndType(address.city)
    .get(ADDRESS_SELECTORS.postalCode)
    .clearAndType(address.postalCode)
    .fillAutocompleteSelect(ADDRESS_SELECTORS.country, address.countryFullName);
  cy.get(ADDRESS_SELECTORS.countryArea).clearAndType(address.countryArea);
});

Cypress.Commands.add("fillUpAddressForm", address => {
  cy.get(ADDRESS_SELECTORS.firstName)
    .type(address.firstName)
    .get(ADDRESS_SELECTORS.lastName)
    .type(address.lastName)
    .fillUpBasicAddress(address);
});

Cypress.Commands.add("fillUpAddressFormAndSubmit", address => {
  cy.fillUpAddressForm(address)
    .get(BUTTON_SELECTORS.submit)
    .click();
});
