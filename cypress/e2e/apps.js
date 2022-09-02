/// <reference types="cypress"/>
/// <reference types="../support"/>

import faker from "faker";

import { APP_DETAILS } from "../elements/apps/appDetails";
import { APPS_LIST } from "../elements/apps/appsList";
import { WEBHOOK_DETAILS } from "../elements/apps/webhookDetails";
import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { appDetailsUrl, urlList } from "../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../fixtures/users";
import { createApp, getApp, updateApp } from "../support/api/requests/Apps";
import {
  addShippingMethod,
  createCheckout,
  orderCreateFromCheckout,
} from "../support/api/requests/Checkout";
import { createVoucher } from "../support/api/requests/Discounts/Vouchers";
import { createGiftCard } from "../support/api/requests/GiftCard";
import { deleteAppsStartsWith } from "../support/api/utils/appUtils";
import { getDefaultChannel } from "../support/api/utils/channelsUtils";
import { getShippingMethodIdFromCheckout } from "../support/api/utils/ordersUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith,
} from "../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith,
} from "../support/api/utils/shippingUtils";
import { discountOptions } from "../support/pages/discounts/vouchersPage";

describe("As a staff user I want to manage apps", () => {
  const startsWith = "Apps";
  const name = `${startsWith}${faker.datatype.number()}`;

  let createdApp;
  let defaultChannel;
  let address;
  let warehouse;
  let shippingMethod;
  let variantsList;
  let checkout;
  const email = `example@example.com`;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteAppsStartsWith(startsWith);
    deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);

    createApp(name, "MANAGE_APPS").then(app => {
      createdApp = app;
    });
    cy.fixture("addresses")
      .then(addresses => {
        address = addresses.usAddress;
        getDefaultChannel();
      })
      .then(channelResp => {
        defaultChannel = channelResp;
        createShipping({
          channelId: defaultChannel.id,
          name,
          address,
          price: 10,
        });
      })
      .then(
        ({ warehouse: warehouseResp, shippingMethod: shippingMethodResp }) => {
          warehouse = warehouseResp;
          shippingMethod = shippingMethodResp;
        },
      );
    createTypeAttributeAndCategoryForProduct({ name })
      .then(({ productType, attribute, category }) => {
        createProductInChannel({
          name,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          productTypeId: productType.id,
          attributeId: attribute.id,
          categoryId: category.id,
        });
      })
      .then(({ variantsList: variants }) => (variantsList = variants));
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest("auth", ONE_PERMISSION_USERS.app);
  });

  it(
    "should be able to create app. TC: SALEOR_3001",
    { tags: ["@app", "@allEnv", "@stable"] },
    () => {
      const randomAppName = `${startsWith}${faker.datatype.number()}`;

      cy.visit(urlList.apps)
        .get(APPS_LIST.createLocalAppButton)
        .click()
        .get(APP_DETAILS.nameInput)
        .type(randomAppName)
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
          expect(app.name).to.eq(randomAppName);
          const token = app.tokens.find(element => element.name === "Default");
          expect(token).to.be.ok;
        });
    },
  );

  it(
    "should be able to create webhook. TC: SALEOR_3002",
    { tags: ["@app", "@allEnv", "@stable"] },
    () => {
      const randomWebhookName = `${startsWith}${faker.datatype.number()}`;
      const targetUrl = `http://example.${randomWebhookName}`;

      cy.visit(appDetailsUrl(createdApp.app.id))
        .get(APP_DETAILS.createWebhookButton)
        .click()
        .get(WEBHOOK_DETAILS.nameInput)
        .type(randomWebhookName)
        .get(WEBHOOK_DETAILS.targetUrlInput)
        .type(targetUrl)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
      getApp(createdApp.app.id).then(({ webhooks }) => {
        expect(webhooks[0].name).to.eq(randomWebhookName);
        expect(webhooks[0].targetUrl).to.eq(targetUrl);
      });
    },
  );

  it(
    "should be able to create token. TC: SALEOR_3003",
    { tags: ["@app", "@allEnv", "@stable"] },
    () => {
      const randomTokenName = `${startsWith}${faker.datatype.number()}`;
      let expectedToken;

      cy.visit(appDetailsUrl(createdApp.app.id))
        .get(APP_DETAILS.createTokenButton)
        .click()
        .get(APP_DETAILS.createTokenForm.tokenDialog)
        .find(APP_DETAILS.createTokenForm.nameInput)
        .type(randomTokenName)
        .get(BUTTON_SELECTORS.submit)
        .click()
        .get(APP_DETAILS.createTokenForm.tokenToCopy)
        .invoke("text")
        .then(text => {
          expectedToken = text;
          cy.get(APP_DETAILS.createTokenForm.doneButton).click();
          getApp(createdApp.app.id);
        })
        .then(app => {
          const token = app.tokens.find(
            element => element.name === randomTokenName,
          );
          const tokenLastFourDigits = expectedToken.slice(
            expectedToken.length - 4,
          );
          expect(token.authToken).to.eq(tokenLastFourDigits);
        });
    },
  );

  it(
    "should be able to use app only to manage giftCards. TC: SALEOR_3004",
    { tags: ["@app", "@allEnv", "@stable"] },
    () => {
      const startsWith = "AppPermission-";
      const token = createdApp.authToken;
      const voucherData = {
        voucherCode: `${startsWith}${faker.datatype.number()}`,
        voucherValue: 10,
        discountOption: discountOptions.PERCENTAGE,
        channelName: defaultChannel.name,
      };
      const giftCardData = {
        tag: `${startsWith}${faker.datatype.number()}`,
        amount: 150,
        currency: "USD",
      };

      cy.clearSessionData().loginUserViaRequest();
      updateApp(createdApp.app.id, "MANAGE_GIFT_CARD");
      cy.clearSessionData();

      createVoucher(voucherData, token).then(resp => {
        expect(resp.voucherCreate).to.be.null;
      });
      createGiftCard(giftCardData, token).then(resp => {
        expect(resp.code).to.be.not.empty;
        expect(resp.isActive).to.eq(true);
      });
    },
  );

  it(
    "should be able to use app to create order from checkout. TC: SALEOR_3005",
    { tags: ["@app", "@allEnv", "@stable"] },
    () => {
      const token = createdApp.authToken;

      cy.clearSessionData().loginUserViaRequest();
      updateApp(createdApp.app.id, "HANDLE_CHECKOUTS");

      cy.clearSessionData();

      createCheckout({
        channelSlug: defaultChannel.slug,
        email,
        variantsList,
        address,
        billingAddress: address,
        auth: "token",
      }).then(({ checkout: checkoutResp }) => {
        const shippingMethodId = getShippingMethodIdFromCheckout(
          checkoutResp,
          shippingMethod.name,
        );
        checkout = checkoutResp;
        addShippingMethod(checkout.id, shippingMethodId);
        orderCreateFromCheckout(checkout.id, token).then(resp => {
          expect(resp.id).to.be.not.empty;
        });
      });
    },
  );
});
