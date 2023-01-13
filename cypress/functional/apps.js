/// <reference types="cypress"/>
/// <reference types="../support"/>
import { urlList } from "../fixtures/urlList";

describe("should display mocked list", () => {
  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    // cy.mockMutation("POST", "refreshTokenWithUser", "app/refreshTokenWithUser.json");
    // cy.mockMutation("POST", "UserDetails", "app/UserDetails.json");
    // cy.mockMutation("POST", "BaseChannels", "app/BaseChannels.json");
    // cy.mockMutation("POST", "ShopInfo", "app/ShopInfo.json");
    // cy.mockMutation("POST", "AppsInstallations", "app/AppsInstallations.json");
    // cy.mockMutation("POST", "ExtensionList", "app/ExtensionList.json");
    cy.mockMutation("POST", "AppsList", "app/AppsList.json");
    cy.visit("/");
  });

  it("should show list of mocked apps", () => {
    cy.visit(urlList.apps3rdParty);
  });
});
