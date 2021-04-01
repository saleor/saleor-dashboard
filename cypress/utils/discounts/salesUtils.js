import { deleteSale, getSales } from "../../apiRequests/Discounts/Sales";

export function deleteSalesStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteSale, getSales, startsWith);
}
