import { CATEGORY_DETAILS } from "../elements/catalog/categories/category-details";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { confirmationMessageShouldDisappear } from "./shared/confirmationMessages";

export function createCategory({ name, description }) {
  cy.get(CATEGORY_DETAILS.nameInput)
    .type(name)
    .get(CATEGORY_DETAILS.descriptionInput)
    .type(description)
    .addAliasToGraphRequest("CategoryCreate")
    .get(BUTTON_SELECTORS.confirm)
    .click();
  confirmationMessageShouldDisappear();
  return cy.wait("@CategoryCreate");
}
