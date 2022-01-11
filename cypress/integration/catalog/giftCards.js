/// <reference types="cypress" />
/// <reference types="../../support"/>

import faker from "faker";

import { GIFT_CARD_UPDATE } from "../../elements/giftCard/giftCardUpdate";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { giftCardDetailsUrl } from "../../fixtures/urlList";
import {
  createGiftCard,
  getGiftCardWithId,
  getGiftCardWithTag
} from "../../support/api/requests/GiftCard";
import { deleteGiftCardsWithTagStartsWith } from "../../support/api/utils/catalog/giftCardUtils";
import { addToDate } from "../../support/api/utils/misc";
import filterTests from "../../support/filterTests";
import { formatDate } from "../../support/formatData/formatDate";
import {
  expiryPeriods,
  openAndFillUpCreateGiftCardDialog,
  saveGiftCard,
  setExpiryDate,
  setExpiryPeriod
} from "../../support/pages/catalog/giftCardPage";

filterTests({ definedTags: ["all"], version: "3.1.0" }, () => {
  describe("Tests for gift cards", () => {
    const startsWith = "GiftCards";
    const amount = 50;
    const currency = "USD";

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteGiftCardsWithTagStartsWith(startsWith);
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should create never expire gift card", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let giftCardCode;

      openAndFillUpCreateGiftCardDialog({
        note: name,
        tag: name,
        amount,
        currency
      });
      saveGiftCard()
        .then(createdGiftCardCode => {
          giftCardCode = createdGiftCardCode;
          getGiftCardWithTag(name, true);
        })
        .then(giftCard => {
          expect(giftCard.code).to.eq(giftCardCode);
          expect(giftCard.initialBalance.amount).to.eq(amount);
          expect(giftCard.initialBalance.currency).to.eq(currency);
        });
    });

    it("should create gift card with two moths expiry", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let giftCardCode;
      const expectedExpiryDate = addToDate(new Date(), 2, "M");

      openAndFillUpCreateGiftCardDialog({
        note: name,
        tag: name,
        amount,
        currency
      });
      setExpiryPeriod(2, expiryPeriods.MONTH);
      saveGiftCard()
        .then(createdGiftCardCode => {
          giftCardCode = createdGiftCardCode;
          getGiftCardWithTag(name, true);
        })
        .then(giftCard => {
          expect(giftCard.code).to.eq(giftCardCode);
          expect(giftCard.initialBalance.amount).to.eq(amount);
          expect(giftCard.initialBalance.currency).to.eq(currency);
          expect(giftCard.expiryDate).to.eq(expectedExpiryDate);
        });
    });

    it("should create gift card with date expiry", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let giftCardCode;
      const date = formatDate(new Date(new Date().getFullYear() + 2, 1, 1));

      openAndFillUpCreateGiftCardDialog({
        note: name,
        tag: name,
        amount,
        currency
      });
      setExpiryDate(date);
      saveGiftCard()
        .then(createdGiftCardCode => {
          giftCardCode = createdGiftCardCode;
          getGiftCardWithTag(name, true);
        })
        .then(giftCard => {
          expect(giftCard.code).to.eq(giftCardCode);
          expect(giftCard.initialBalance.amount).to.eq(amount);
          expect(giftCard.initialBalance.currency).to.eq(currency);
          expect(giftCard.expiryDate).to.eq(date);
        });
    });

    it("should delete gift card", () => {
      const name = `${startsWith}${faker.datatype.number()}`;

      createGiftCard({
        tag: name,
        amount: 10,
        currency: "USD"
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
    });

    it("should update gift card", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const updatedName = `${startsWith}${faker.datatype.number()}`;
      const date = formatDate(new Date(new Date().getFullYear() + 2, 1, 1));

      createGiftCard({
        tag: name,
        amount: 10,
        currency: "USD"
      })
        .then(giftCard => {
          cy.visit(giftCardDetailsUrl(giftCard.id))
            .waitForProgressBarToNotBeVisible()
            .get(GIFT_CARD_UPDATE.expireCheckbox)
            .click()
            .get(GIFT_CARD_UPDATE.expireDateInput)
            .type(date)
            .get(GIFT_CARD_UPDATE.giftCardTagSelect)
            .find("input")
            .clear()
            .type(updatedName)
            .get(GIFT_CARD_UPDATE.autocompleteOption)
            .click()
            .addAliasToGraphRequest("GiftCardUpdate")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .waitForRequestAndCheckIfNoErrors("@GiftCardUpdate");
          getGiftCardWithId(giftCard.id);
        })
        .then(giftCard => {
          expect(giftCard.tag).to.eq(updatedName);
          expect(giftCard.expiryDate).to.eq(date);
        });
    });
  });
});
