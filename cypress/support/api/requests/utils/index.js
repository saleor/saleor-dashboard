// / <reference types="cypress" />

import { urlList } from "../../../../fixtures/urlList";

Cypress.Commands.add(
  "sendRequestWithQuery",
  (query, authorization = "auth", variables = "") => {
    let headers;

    if (authorization && authorization.length !== 30) {
      headers = {
        Authorization: `JWT ${window.sessionStorage.getItem(authorization)}`,
      };
    } else if (authorization) {
      headers = { Authorization: `Bearer ${authorization}` };
    } else {
      headers = {};
    }

    cy.request({
      body: {
        variables,
        query,
      },
      headers,
      method: "POST",
      url: urlList.apiUri,
      log: true,
    }).then(response => {
      const respInSting = JSON.stringify(response.body);
      if (respInSting.includes(`"errors":[{`)) {
        cy.log(query).log(JSON.stringify(response.body));
      }
    });
  },
);
