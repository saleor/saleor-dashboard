import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { waitForProgressBarToNotExist } from "./progressBar";

export function searchInTable(query) {
  cy.get(SHARED_ELEMENTS.searchInput).type(query);
  waitForProgressBarToNotExist();
}
