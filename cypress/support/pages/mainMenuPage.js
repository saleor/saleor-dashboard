import { MENU_SELECTORS } from "../../elements";

export function expectMainMenuAvailableSections(sectionsNumber) {
  cy.get(MENU_SELECTORS.MENU.list)
    .find(MENU_SELECTORS.MENU.menuItem)
    .should("have.length", sectionsNumber);
}
export function expectMainMenuSectionsToBeVisible(...sections) {
  cy.log(sections);
  sections.forEach(selector => {
    cy.get(selector).should("be.visible");
  });
}
