// / <reference types="cypress" />

import { urlList } from "../../../../fixtures/urlList";

Cypress.Commands.add(
  "sendRequestWithQuery",
  (query, authorization = "auth", variables = "") => {
    if (authorization.length !== 30) {
      cy.request({
        body: {
          variables,
          query,
        },
        headers: {
          Authorization: `JWT ${window.sessionStorage.getItem(authorization)}`,
        },
        method: "POST",
        url: urlList.apiUri,
        log: true,
      }).then(response => {
        const respInSting = JSON.stringify(response.body);
        if (respInSting.includes(`"errors":[{`)) {
          cy.log(query).log(JSON.stringify(response.body));
        }
      });
    } else {
      cy.request({
        body: {
          variables,
          query,
        },
        headers: {
          Authorization: `Bearer ${authorization}`,
        },
        method: "POST",
        url: urlList.apiUri,
        log: true,
      }).then(response => {
        const respInSting = JSON.stringify(response.body);
        if (respInSting.includes(`"errors":[{`)) {
          cy.log(query).log(JSON.stringify(response.body));
        }
      });
    }
  },
);
