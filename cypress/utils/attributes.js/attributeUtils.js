import { deleteAttribute, getAttributes } from "../../apiRequests/Attribute";

export function deleteAttributesStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteAttribute, getAttributes, startsWith);
}
