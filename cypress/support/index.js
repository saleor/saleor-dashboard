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
    const requestBody = req.body;
    if (Array.isArray(requestBody)) {
      requestBody.forEach(element => {
        if (element.operationName.includes(operationName)) {
          req.alias = "graphqlRequest";
        }
      });
    } else {
      if (req.body.operationName.contains(operationName)) {
        req.alias = "graphqlRequest";
      }
    }
  });
  cy.wait("@graphqlRequest");
});

Cypress.Commands.add("sendRequestWithQuery", query =>
  cy.request({
    method: "POST",
    url: Cypress.env("API_URI"),
    headers: {
      Authorization: `JWT ${window.sessionStorage.getItem("auth")}`
    },
    body: {
      method: "POST",
      url: Cypress.env("API_URI"),
      query
    }
  })
);
