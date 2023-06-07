/// <reference types="cypress" />
/// <reference types="../../../support"/>

import faker from "faker";

import { GIFT_CARD_LIST } from "../../../elements/catalog/giftCard/giftCardList";
import { GIFT_CARD_UPDATE } from "../../../elements/catalog/giftCard/giftCardUpdate";
import { ASSIGN_ELEMENTS_SELECTORS } from "../../../elements/shared/assign-elements-selectors.js";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { giftCardDetailsUrl } from "../../../fixtures/urlList";
import {
  createGiftCard,
  getGiftCardWithId,
} from "../../../support/api/requests/GiftCard";
import { formatDate } from "../../../support/formatData/formatDate";
import { enterAndSelectGiftCards } from "../../../support/pages/catalog/giftCardPage";

describe("As an admin I want to update gift card", () => {
  const startsWith = "updateGCard";

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should be able to delete gift card. TC: SALEOR_1004",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createGiftCard({
        tag: name,
        amount: 10,
        currency: "USD",
      }).then(giftCard => {
        cy.visit(giftCardDetailsUrl(giftCard.id))
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
          .addAliasToGraphRequest("DeleteGiftCard")
          .get(GIFT_CARD_UPDATE.consentCheckbox)
          .click()
          .get(BUTTON_SELECTORS.submit)
          .click()
          .waitForRequestAndCheckIfNoErrors("@DeleteGiftCard");
        getGiftCardWithId(giftCard.id).should("be.null");
      });
    },
  );

  it(
    "should be able to update gift card. TC: SALEOR_1005",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const updatedName = `${startsWith}${faker.datatype.number()}`;
      const date = formatDate(new Date(new Date().getFullYear() + 2, 1, 1));

      createGiftCard({
        tag: name,
        amount: 10,
        currency: "USD",
      })
        .then(giftCard => {
          cy.visit(giftCardDetailsUrl(giftCard.id))
            .waitForProgressBarToNotBeVisible()
            .get(GIFT_CARD_UPDATE.expireCheckbox)
            .click()
            .get(GIFT_CARD_UPDATE.expireDateInput)
            .type(date)
            .get(GIFT_CARD_UPDATE.removeTagButton)
            .click()
            .get(GIFT_CARD_UPDATE.giftCardTagSelect)
            .find("input")
            .clear()
            .type(updatedName)
            .get(GIFT_CARD_UPDATE.autocompleteCustomOption)
            .click()
            .addAliasToGraphRequest("GiftCardUpdate")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .waitForRequestAndCheckIfNoErrors("@GiftCardUpdate");
          getGiftCardWithId(giftCard.id);
        })
        .then(giftCard => {
          expect(giftCard.tags[0].name.toLowerCase()).to.eq(
            updatedName.toLowerCase(),
          );
          expect(giftCard.expiryDate).to.eq(date);
        });
    },
  );

  it(
    "should be able to delete several gift cards. TC: SALEOR_1011",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      const giftCard01 = `${startsWith}${faker.datatype.number()}`;
      const giftCard02 = `${startsWith}${faker.datatype.number()}`;
      let giftCard01hash;
      let giftCard02hash;

      createGiftCard({
        tag: giftCard01,
        amount: 3,
        currency: "THB",
      })
        .then(hash => {
          giftCard01hash = hash.id;
          createGiftCard({
            tag: giftCard02,
            amount: 7,
            currency: "THB",
          });
        })
        .then(hash2 => {
          giftCard02hash = hash2.id;
          enterAndSelectGiftCards([giftCard01hash, giftCard02hash]);
          cy.get(ASSIGN_ELEMENTS_SELECTORS.checkbox)
            .first()
            .check()
            .should("be.checked")
            .get(GIFT_CARD_LIST.selectedAmount)
            .contains("Selected 2 items")
            .should("be.visible")
            .get(BUTTON_SELECTORS.deleteItemsButton)
            .first()
            .click()
            .get(GIFT_CARD_UPDATE.consentCheckbox)
            .click()
            .get(BUTTON_SELECTORS.submit)
            .click()
            .get(ASSIGN_ELEMENTS_SELECTORS.checkbox)
            .should("not.be.visible");
          getGiftCardWithId(giftCard01.id).should("be.null");
          getGiftCardWithId(giftCard02.id).should("be.null");
        });
    },
  );
});
