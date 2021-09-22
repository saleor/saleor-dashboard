import { CATEGORY_DETAILS } from "../../../elements/catalog/categories/category-details";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";

export function createCategory({ name, description }) {
  return cy
    .get(CATEGORY_DETAILS.nameInput)
    .type(name)
    .get(CATEGORY_DETAILS.descriptionInput)
    .type(description)
    .addAliasToGraphRequest("CategoryCreate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear()
    .waitForRequestAndCheckIfNoErrors("@CategoryCreate");
}
