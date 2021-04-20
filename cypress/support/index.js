import "./user";
import "./softAssertions";
import "./deleteElement/index.js";
import "./elements/index";
import "cypress-mochawesome-reporter/register";

import addContext from "mochawesome/addContext";

import { urlList } from "../url/urlList";

Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    let item = runnable;
    const nameParts = [runnable.title];

    // Iterate through all parents and grab the titles
    while (item.parent) {
      nameParts.unshift(item.parent.title);
      item = item.parent;
    }

    const fullTestName = nameParts.filter(Boolean).join(" -- "); // this is how cypress joins the test title fragments

    const imageUrl = `screenshots/${Cypress.spec.name}/${fullTestName} `;
    const imageUrlBeforeAll = `-- before all hook (failed).png`;

    addContext({ test }, imageUrlBeforeAll);
  }
});

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
