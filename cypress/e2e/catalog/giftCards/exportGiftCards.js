/// <reference types="cypress" />
/// <reference types="../../../support"/>

import faker from "faker";

import { GIFT_CARD_LIST } from "../../../elements/catalog/giftCard/giftCardList";
import { GIFT_CARD_SHOW_MORE } from "../../../elements/catalog/giftCard/giftCardShowMore";
import { ASSIGN_ELEMENTS_SELECTORS } from "../../../elements/shared/assign-elements-selectors.js";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { TEST_ADMIN_USER } from "../../../fixtures/users";
import { createGiftCard } from "../../../support/api/requests/GiftCard";
import {
  activatePlugin,
  updatePlugin,
} from "../../../support/api/requests/Plugins";
import { getMailWithGiftCardExportWithAttachment } from "../../../support/api/utils/users";
import { enterAndSelectGiftCards } from "../../../support/pages/catalog/giftCardPage";

describe("As an admin I want to export gift card", () => {
  const startsWith = "updateGCard";

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    activatePlugin({ id: "mirumee.notifications.admin_email" });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should be able to export several gift cards to csv file. TC: SALEOR_1010",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      const giftCard01 = `${startsWith}${faker.datatype.number()}`;
      const giftCard02 = `${startsWith}${faker.datatype.number()}`;
      const exportId = `${faker.datatype.number()}`;
      let giftCard01hash;
      let giftCard02hash;

      updatePlugin(
        "mirumee.notifications.admin_email",
        "csv_export_success_subject",
        `Your exported {{ data_type }} data #${exportId} is ready`,
      );
      createGiftCard({
        tag: giftCard01,
        amount: 5,
        currency: "THB",
      })
        .then(hash => {
          giftCard01hash = hash.id;
          createGiftCard({
            tag: giftCard02,
            amount: 10,
            currency: "THB",
          });
        })
        .then(hash2 => {
          giftCard02hash = hash2.id;
          enterAndSelectGiftCards([giftCard01hash, giftCard02hash]);
          cy
            .get(ASSIGN_ELEMENTS_SELECTORS.checkbox)
            .first()
            .check()
            .should("be.checked")
            .get(GIFT_CARD_LIST.selectedAmount)
            .contains("Selected 2 items")
            .should("be.visible")
            .get(BUTTON_SELECTORS.showMoreButton)
            .click({ force: true })
            .get(GIFT_CARD_SHOW_MORE.exportCodesMenu)
            .click()
            .get(GIFT_CARD_SHOW_MORE.exportAsRadioBtn.csv)
            .click()
            .get(BUTTON_SELECTORS.submit)
            .click().confirmationMessageShouldDisappear;
          getMailWithGiftCardExportWithAttachment(
            TEST_ADMIN_USER.email,
            `Your exported gift cards data #${exportId} is ready`,
            "csv",
          ).then(body => {
            expect(body).to.contain(".csv");
          });
        });
    },
  );

  it(
    "should be able to export several gift cards to xlsx file. TC: SALEOR_1014",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      const giftCard01 = `${startsWith}${faker.datatype.number()}`;
      const giftCard02 = `${startsWith}${faker.datatype.number()}`;
      const exportId = `${faker.datatype.number()}`;
      let giftCard01hash;
      let giftCard02hash;

      updatePlugin(
        "mirumee.notifications.admin_email",
        "csv_export_success_subject",
        `Your exported {{ data_type }} data #${exportId} is ready`,
      );
      createGiftCard({
        tag: giftCard01,
        amount: 5,
        currency: "THB",
      })
        .then(hash => {
          giftCard01hash = hash.id;
          createGiftCard({
            tag: giftCard02,
            amount: 10,
            currency: "THB",
          });
        })
        .then(hash2 => {
          giftCard02hash = hash2.id;
          enterAndSelectGiftCards([giftCard01hash, giftCard02hash]);
          cy
            .get(ASSIGN_ELEMENTS_SELECTORS.checkbox)
            .first()
            .check()
            .should("be.checked")
            .get(GIFT_CARD_LIST.selectedAmount)
            .contains("Selected 2 items")
            .should("be.visible")
            .get(BUTTON_SELECTORS.showMoreButton)
            .click({ force: true })
            .get(GIFT_CARD_SHOW_MORE.exportCodesMenu)
            .click()
            .get(GIFT_CARD_SHOW_MORE.exportAsRadioBtn.xlsx)
            .click()
            .get(BUTTON_SELECTORS.submit)
            .click().confirmationMessageShouldDisappear;
          getMailWithGiftCardExportWithAttachment(
            TEST_ADMIN_USER.email,
            `Your exported gift cards data #${exportId} is ready`,
            "xlsx",
          ).then(body => {
            expect(body).to.contain(".xlsx");
          });
        });
    },
  );
});
