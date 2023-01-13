/// <reference types="cypress"/>
/// <reference types="../support"/>

describe("should display mocked list", () => {
  before(() => {
    cy.loginUserViaMockedToken();

    cy.mockMutation(
      "POST",
      "refreshTokenWithUser",
      "app/refreshTokenWithUser.json",
    );
    cy.mockMutation("POST", "UserDetails", "app/UserDetails.json");
    cy.mockMutation("POST", "BaseChannels", "app/BaseChannels.json");
    cy.mockMutation("POST", "ShopInfo", "app/ShopInfo.json");
    cy.mockMutation("POST", "AppsInstallations", "app/AppsInstallations.json");
    cy.mockMutation("POST", "ExtensionList", "app/ExtensionList.json");
    cy.mockMutation("POST", "AppsList", "app/AppsList.json");
  });

  it("should show list of mocked apps", () => {
    cy.visit("/apps");
  });
});
