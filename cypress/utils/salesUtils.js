import { deleteSale, getSales } from "../apiRequests/Sales";

export function deleteSalesStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteSale, getSales, startsWith, "sales");
}
