import "./user";

Cypress.Commands.add("clearSessionData", () => {
  // Because of known cypress bug, not all local storage data are cleared.
  // Here is workaround to ensure tests have no side effects.
  // Suggested usage:

  // beforeEach(() => {
  //   cy.clearSessionData();
  // });

  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit("/", {
    onBeforeLoad: win => {
      win.sessionStorage.clear();
    }
  });
});

Cypress.Commands.add("waitForGraph", operationName => {
  const GRAPH_URL = "/graphql";
  cy.intercept("POST", GRAPH_URL, req => {
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

Cypress.Commands.add("sendRequestWithQuery", query =>
  cy.request({
    method: "POST",
    body: {
      method: "POST",
      url: Cypress.env("API_URI"),
      query
    },
    headers: {
      Authorization: `JWT ${window.sessionStorage.getItem("auth")}`
    },
    url: Cypress.env("API_URI")
  })
);
