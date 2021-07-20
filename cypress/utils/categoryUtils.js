import { deleteCategory, getCategories } from "../apiRequests/Category";

export function deleteCategoriesStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteCategory, getCategories, startsWith);
}
