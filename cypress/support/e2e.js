// / <reference types="cypress" />

import "./customCommands/user";
import "./customCommands/basicOperations";
import "./customCommands/deleteElementsViaApi";
import "./customCommands/softAssertions";
import "./customCommands/sharedElementsOperations/addressForm.js";
import "./customCommands/sharedElementsOperations/assignElementsForm.js";
import "./customCommands/sharedElementsOperations/confirmationMessages.js";
import "./customCommands/sharedElementsOperations/progressBar.js";
import "./customCommands/sharedElementsOperations/selects.js";
import "./customCommands/sharedElementsOperations/tables";
import "./customCommands/sharedElementsOperations/deleteElement";
import "cypress-mailhog";
import "cypress-file-upload";
import "cypress-mochawesome-reporter/register";

import { commandTimings } from "cypress-timings";

import cypressGrep from "../support/cypress-grep/support";
commandTimings();

import { urlList } from "../fixtures/urlList";

cypressGrep();

Cypress.Commands.add("clearSessionData", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

Cypress.Commands.add("addAliasToGraphRequest", operationName => {
  cy.intercept("POST", urlList.apiUri, req => {
    req.statusCode = 200;
    const requestBody = req.body;
    if (Array.isArray(requestBody)) {
      requestBody.forEach(element => {
        if (element.operationName === operationName) {
          req.alias = operationName;
        }
      });
    } else {
      if (requestBody.operationName === operationName) {
        req.alias = operationName;
      }
    }
  });
});

Cypress.on(
  "uncaught:exception",
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test
    false,
);
