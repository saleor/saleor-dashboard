import { deleteCategory, getCategories } from "../../requests/Category";

export function deleteCategoriesStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteCategory, getCategories, startsWith);
}
