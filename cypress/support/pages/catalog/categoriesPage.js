import { CATEGORY_DETAILS_SELECTORS } from "../../../elements/catalog/categories/category-details";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";

export function createCategory({ name, description }) {
  fillUpCategoryGeneralInfo({ name, description });
  return saveCategory();
}

export function updateCategory({ name, description }) {
  fillUpCategoryGeneralInfo({ name, description });
  return saveCategory("CategoryUpdate");
}

export function fillUpCategoryGeneralInfo({ name, description }) {
  return cy
    .get(CATEGORY_DETAILS_SELECTORS.nameInput)
    .clearAndType(name)
    .get(CATEGORY_DETAILS_SELECTORS.descriptionInput)
    .find(SHARED_ELEMENTS.contentEditable)
    .should("be.visible")

    .get(CATEGORY_DETAILS_SELECTORS.descriptionInput)
    .click()
    .get(CATEGORY_DETAILS_SELECTORS.descriptionInput)
    .clearAndType(description);
}

export function saveCategory(alias = "CategoryCreate") {
  return cy
    .addAliasToGraphRequest(alias)
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .waitForRequestAndCheckIfNoErrors(`@${alias}`);
}
