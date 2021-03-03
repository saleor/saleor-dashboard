import { cycleErrorMessage } from "graphql/validation/rules/NoFragmentCycles";

Cypress.Commands.add("getTextFromElement", element =>
  cy.get(element).invoke("text")
);
