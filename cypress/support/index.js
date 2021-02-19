import "./user";
import "./softAssertions";
import "./deleteElement/index.js";

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

Cypress.Commands.add("waitForGraph", operationName => {
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
  cy.wait(`@${operationName}`);
});

Cypress.Commands.add("sendRequestWithQuery", query => {
  const body = {
    method: "POST",
    query,
    url: urlList.apiUri
  };
  return cy.sendRequest(body, "auth");
});

Cypress.Commands.add(
  "sendFrontShopRequestWithQuery",
  (operationName, variables, query) => {
    const body = {
      operationName,
      query,
      variables
    };
    return cy.sendRequest(body, "token");
  }
);
Cypress.Commands.add("sendRequest", (body, authorization) =>
  cy.request({
    body,
    headers: {
      Authorization: `JWT ${window.sessionStorage.getItem(authorization)}`
    },
    method: "POST",
    url: urlList.apiUri
  })
);
