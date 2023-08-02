/// <reference types="cypress" />
/// <reference types="../../../support"/>

import faker from "faker";

import { urlList } from "../../../fixtures/urlList";
import { TEST_ADMIN_USER } from "../../../fixtures/users";
import { createGiftCard } from "../../../support/api/requests/GiftCard";
import {
  activatePlugin,
  updatePlugin,
} from "../../../support/api/requests/Plugins";
import {
  getMailWithGiftCardExportWithAttachment,
} from "../../../support/api/utils/users";
import { giftCardsPage } from "../../../support/pages";

describe("As an admin I want to export gift card", () => {
  const startsWith = "updateGCard";

  before(() => {
    cy.loginUserViaRequest();
    activatePlugin({ id: "mirumee.notifications.admin_email" });
  });

  beforeEach(() => {
    cy.loginUserViaRequest();
  });

  it(
    "should be able to export several gift cards to csv file. TC: SALEOR_1010",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      const firstGiftCardTag = faker.datatype.number();
      const secondGiftCardTag = faker.datatype.number();
      const exportId = `${faker.datatype.number()}`;
      let firstGiftCardId;
      let secondGiftCardId;
      let firstGiftCardCode;
      let secondGiftCardCode;

      updatePlugin(
        "mirumee.notifications.admin_email",
        "csv_export_success_subject",
        `Your exported {{ data_type }} data #${exportId} is ready`,
      );
      createGiftCard({
        tag: firstGiftCardTag,
        amount: 5,
        currency: "THB",
      })
        .then(firstGiftCard => {
          firstGiftCardId = firstGiftCard.id;
          firstGiftCardCode = firstGiftCard.code;
          createGiftCard({
            tag: secondGiftCardTag,
            amount: 10,
            currency: "THB",
          });
        })
        .then(secondGiftCard => {
          secondGiftCardCode = secondGiftCard.code;
          secondGiftCardId = secondGiftCard.id;
          cy.visit(
            giftCardsPage.getUrlWithFilteredTags(urlList.giftCards, [
              firstGiftCardTag,
              secondGiftCardTag,
            ]),
          );
          giftCardsPage.selectGiftCardOnListView(secondGiftCardCode);
          giftCardsPage.selectGiftCardOnListView(firstGiftCardCode);
          giftCardsPage.openExportGiftCardsDialog();
          giftCardsPage.selectSelectedRecordsButton();
          giftCardsPage.selectExportAsCSVButton();
          cy.clickSubmitButton();
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
      const firstGiftCardTag = faker.datatype.number();
      const secondGiftCardTag = faker.datatype.number();
      const exportId = `${faker.datatype.number()}`;
      let firstGiftCardId;
      let secondGiftCardId;
      let firstGiftCardCode;
      let secondGiftCardCode;

      updatePlugin(
        "mirumee.notifications.admin_email",
        "csv_export_success_subject",
        `Your exported {{ data_type }} data #${exportId} is ready`,
      );
      createGiftCard({
        tag: firstGiftCardTag,
        amount: 5,
        currency: "THB",
      })
        .then(firstGiftCard => {
          firstGiftCardId = firstGiftCard.id;
          firstGiftCardCode = firstGiftCard.code;
          createGiftCard({
            tag: secondGiftCardTag,
            amount: 10,
            currency: "THB",
          });
        })
        .then(secondGiftCard => {
          secondGiftCardId = secondGiftCard.id;
          secondGiftCardCode = secondGiftCard.code;
          cy.visit(
            giftCardsPage.getUrlWithFilteredTags(urlList.giftCards, [
              firstGiftCardTag,
              secondGiftCardTag,
            ]),
          );
          giftCardsPage.selectGiftCardOnListView(secondGiftCardCode);
          giftCardsPage.selectGiftCardOnListView(firstGiftCardCode);
          giftCardsPage.openExportGiftCardsDialog();
          giftCardsPage.selectSelectedRecordsButton();
          giftCardsPage.selectExportAsXLSXButton();
          cy.clickSubmitButton();
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
