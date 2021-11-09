import { deleteAttribute, getAttributes } from "../../requests/Attribute";

export function deleteAttributesStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteAttribute, getAttributes, startsWith);
}
