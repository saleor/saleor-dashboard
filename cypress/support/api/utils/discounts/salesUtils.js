import { deleteSale, getSales } from "../../requests/Discounts/Sales";

export function deleteSalesStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteSale, getSales, startsWith);
}
