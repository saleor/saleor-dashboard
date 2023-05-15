// / <reference types="cypress" />

import "cypress-file-upload";
import "./customCommands/basicOperations/mailpit";
import "cypress-mochawesome-reporter/register";
import "./customCommands/basicOperations";
import "./customCommands/deleteElementsViaApi";
import "./customCommands/sharedElementsOperations/addressForm.js";
import "./customCommands/sharedElementsOperations/assignElementsForm.js";
import "./customCommands/sharedElementsOperations/confirmationMessages.js";
import "./customCommands/sharedElementsOperations/deleteElement";
import "./customCommands/sharedElementsOperations/progressBar.js";
import "./customCommands/sharedElementsOperations/selects.js";
import "./customCommands/sharedElementsOperations/tables";
import "./customCommands/softAssertions";
import "./customCommands/user";
import "@percy/cypress";

import { commandTimings } from "cypress-timings";

import { SHARED_ELEMENTS } from "../elements/shared/sharedElements";
import { urlList } from "../fixtures/urlList";
import cypressGrep from "../support/cypress-grep/support";

commandTimings();
cypressGrep();

Cypress.Commands.add("clearSessionData", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  window.sessionStorage.clear();
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

Cypress.Commands.add(
  "addAliasToGraphRequestAndUseMockedResponseBody",
  (operationName, bodyMock) => {
    cy.intercept("POST", urlList.apiUri, req => {
      req.statusCode = 200;
      const requestBody = req.body;
      if (Array.isArray(requestBody)) {
        requestBody.forEach(element => {
          if (element.operationName === operationName) {
            req.alias = operationName;
            req.reply({
              body: bodyMock,
            });
          }
        });
      } else {
        if (requestBody.operationName === operationName) {
          req.alias = operationName;
          req.reply({
            body: bodyMock,
          });
        }
      }
    });
  },
);

Cypress.Commands.add("getGridCellInfo", (col, row) =>
  /*
    It seeks for react fiber node to obtain Glide grid instance.
    Within its ref, we have getBounds API which returns an info about given cell.

    Browsing over the three starts from canvas. In case of changing that selector,
    this function must be adjusted as well.
  */
  cy
    .get(SHARED_ELEMENTS.dataGridTable)
    .should("be.visible")
    .wait(3000)
    .then(node => {
      const fiberKey = Object.keys(node[0]).find(x =>
        x.includes("__reactFiber"),
      );

      const bounds = node[0].parentNode[
        fiberKey
      ].pendingProps.children.props.gridRef.current.getBounds(col, row);

      return {
        ...bounds,
        center: {
          x: bounds.x + bounds.width / 2,
          y: bounds.y + bounds.height / 2,
        },
      };
    }),
);

Cypress.Commands.add("clickGridCell", (col, row) => {
  cy.getGridCellInfo(col, row).then(bounds => {
    cy.get("body").click(bounds.center.x, bounds.center.y);
  });
});

Cypress.Commands.add("clickGridHeader", col => {
  cy.getGridCellInfo(col, 0).then(bounds => {
    const headerXCenter = bounds.x + bounds.width / 2;
    const headerYCenter = bounds.y - bounds.height / 2;

    cy.get("body").click(headerXCenter, headerYCenter);
  });
});

Cypress.on(
  "uncaught:exception",
  (_err, _runnable) =>
    // returning false here prevents Cypress from
    // failing the test
    false,
);
