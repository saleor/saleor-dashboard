/// <reference types="cypress"/>
/// <reference types="../support"/>

import { APPS_LIST } from "../elements/apps/appsList";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";

describe("should display mocked list", () => {
  beforeEach(() => {
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
    cy.visit("/new-apps");
  });

  it("should show deactivate dialog for active app", () => {
    cy.get(APPS_LIST.activeSwitch)
      .first()
      .click();
    cy.get(BUTTON_SELECTORS.submit).contains("Deactivate");
    cy.get(APPS_LIST.dialogText).contains("Are you sure you want to disable");
  });

  it("should show activate dialog for deactived app", () => {
    cy.get(APPS_LIST.activeSwitch)
      .last()
      .click();
    cy.get(BUTTON_SELECTORS.submit).contains("Activate");
    cy.get(APPS_LIST.dialogText).contains("Are you sure you want to activate");
  });
});
