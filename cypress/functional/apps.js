/// <reference types="cypress"/>
/// <reference types="../support"/>

// import { urlList } from "../fixtures/urlList";
import {
  aliasMutation,
  hasOperationName,
} from "../support/api/utils/graphqlMockUtils.ts";

describe("should display mocked list", () => {
  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.intercept("POST", "/graphql/", req => {
      aliasMutation(req, "AppsList");
    });
    cy.visit("/");
  });

  it("should delete first item from list", () => {
    cy.intercept("POST", "/graphql/", req => {
      aliasMutation(req, "AppsList");

      if (hasOperationName(req, "AppsList")) {
        req.alias = "AppsListMutation";

        req.reply({
          fixture: "../fixtures/mockedData/app/AppsList.json",
        });
      }
    });
    cy.visit("/apps");
  });
});

// TODO - change urlList.app, now it points to /custom-apps
