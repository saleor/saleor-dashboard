import { deleteApp, getApps } from "../requests/Apps";

export function deleteAppsStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteApp, getApps, startsWith);
}
