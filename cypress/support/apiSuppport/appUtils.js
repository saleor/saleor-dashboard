import { deleteApp, getApps } from "../apiRequests/Apps";

export function deleteAppsStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteApp, getApps, startsWith);
}
