/// <reference types="cypress"/>
/// <reference types="../support"/>

import faker from "faker";

import { APP_DETAILS } from "../elements/apps/appDetails";
import { APPS_LIST } from "../elements/apps/appsList";
import { WEBHOOK_DETAILS } from "../elements/apps/webhookDetails";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { appDetailsUrl, urlList } from "../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../fixtures/users";
import { createApp, getApp } from "../support/api/requests/Apps";
import { deleteAppsStartsWith } from "../support/api/utils/appUtils";
import filterTests from "../support/filterTests";

filterTests({ definedTags: ["all"] }, () => {
  describe("Tests for apps", () => {
    const startsWith = "Apps";
    const name = `${startsWith}${faker.datatype.number()}`;

    let createdApp;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteAppsStartsWith(startsWith);
      createApp(name, "MANAGE_APPS").then(app => {
        createdApp = app;
      });
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest(
        "auth",
        ONE_PERMISSION_USERS.app
      );
    });

    it("should create app", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;

      cy.visit(urlList.apps)
        .get(APPS_LIST.createLocalAppButton)
        .click()
        .get(APP_DETAILS.nameInput)
        .type(randomName)
        .get(APP_DETAILS.manageAppsPermissionCheckbox)
        .click()
        .addAliasToGraphRequest("AppCreate")
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .waitForRequestAndCheckIfNoErrors("@AppCreate")
        .its("response.body.data.appCreate.app")
        .then(app => {
          getApp(app.id);
        })
        .then(app => {
          expect(app.name).to.eq(randomName);
          const token = app.tokens.find(element => element.name === "Default");
          expect(token).to.be.ok;
        });
    });

    it("should create webhook", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      const targetUrl = `http://example.${randomName}`;

      cy.visit(appDetailsUrl(createdApp.id))
        .get(APP_DETAILS.createWebhookButton)
        .click()
        .get(WEBHOOK_DETAILS.nameInput)
        .type(randomName)
        .get(WEBHOOK_DETAILS.targetUrlInput)
        .type(targetUrl)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
      getApp(createdApp.id).then(({ webhooks }) => {
        expect(webhooks[0].name).to.eq(randomName);
        expect(webhooks[0].targetUrl).to.eq(targetUrl);
      });
    });

    it("should create token", () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;
      let expectedToken;

      cy.visit(appDetailsUrl(createdApp.id))
        .get(APP_DETAILS.createTokenButton)
        .click()
        .get(APP_DETAILS.createTokenForm.tokenDialog)
        .find(APP_DETAILS.createTokenForm.nameInput)
        .type(randomName)
        .get(BUTTON_SELECTORS.submit)
        .click()
        .get(APP_DETAILS.createTokenForm.tokenToCopy)
        .invoke("text")
        .then(text => {
          expectedToken = text;
          cy.get(APP_DETAILS.createTokenForm.doneButton).click();
          getApp(createdApp.id);
        })
        .then(app => {
          const token = app.tokens.find(element => element.name === randomName);
          const tokenLastFourDigits = expectedToken.slice(
            expectedToken.length - 4
          );
          expect(token.authToken).to.eq(tokenLastFourDigits);
        });
    });
  });
});
