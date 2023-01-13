/// <reference types="cypress"/>
/// <reference types="../support"/>

describe("should display mocked list", () => {
  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    cy.mockMutation("POST", "AppsList", "AppsListMutation");

    cy.visit("/");
  });

  it("should show list of mocked apps", () => {
    cy.visit("/apps");
  });
});

// TODO - change urlList.app, now it points to /custom-apps
