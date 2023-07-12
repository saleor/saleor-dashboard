import { PAGE_DETAILS_SELECTORS } from "../../elements/pages/page-details";

export function typePageName(pageName) {
  return cy.get(PAGE_DETAILS_SELECTORS.nameInput).type(pageName);
}
