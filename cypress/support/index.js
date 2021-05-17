import "./user";
import "./softAssertions";
import "./deleteElement/index.js";
import "./elements/index";
import "cypress-mailhog";

import { urlList } from "../url/urlList";

Cypress.Commands.add("clearSessionData", () => {
  // Because of known cypress bug, not all local storage data are cleared.
  // Here is workaround to ensure tests have no side effects.
  // Suggested usage:
  // beforeEach(() => {
  //   cy.clearSessionData();
  // });

  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(urlList.homePage, {
    onBeforeLoad: win => {
      win.sessionStorage.clear();
    }
  });
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

Cypress.Commands.add("sendRequestWithQuery", (query, authorization = "auth") =>
  cy.request({
    body: {
      method: "POST",
      query,
      url: urlList.apiUri
    },
    headers: {
      Authorization: `JWT ${window.sessionStorage.getItem(authorization)}`
    },
    method: "POST",
    url: urlList.apiUri
  })
);
Cypress.on(
  "uncaught:exception",
  (err, runnable) =>
    // returning false here prevents Cypress from
    // failing the test
    false
);
