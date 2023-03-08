import { CONFIGURATION_SELECTORS } from "../../elements";

export function expectConfigurationAvailableSectionsNumber(sectionsNumber) {
  cy.get(CONFIGURATION_SELECTORS.configurationMenu)
    .find("[data-test-id*=subsection]")
    .should("have.length", sectionsNumber);
}
export function expectConfigurationSectionsToBeVisible(...sections) {
  sections.forEach(selector => {
    cy.get(selector).scrollIntoView().should("be.visible");
  });
}
