/// <reference types="cypress"/>
/// <reference types="../support"/>

// import { urlList } from "../fixtures/urlList";
import { aliasMutation } from "../support/api/utils/graphqlMockUtils.ts";

describe("Should display mocked list", () => {
  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.intercept("POST", "/graphql/", req => {
      aliasMutation(req, "UpdateUserMuation");
    });
    cy.visit("/");
  });

  it("should delete first item from list", () => {
    cy.visit("/apps");
  });
});

// TODO - change urlList.app, now it points to /custom-apps
