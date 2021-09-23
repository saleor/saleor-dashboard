// <reference types="cypress" />
import faker from "faker";

import { getGiftCardWithTag } from "../apiRequests/giftCards";
import {
  expiryPeriods,
  openAndFillUpCreateGiftCardDialog,
  saveGiftCard,
  setExpiryDate,
  setExpiryPeriod
} from "../steps/giftCardSteps";
import filterTests from "../support/filterTests";
import { formatDate } from "../support/format/formatDate";
import { deleteGiftCardsWithTagStartsWith } from "../utils/giftCardUtils";
import { addToDate } from "../utils/misc";

filterTests(["all"], () => {
  describe("Tests for gift cards", () => {
    const startsWith = "GiftCards";
    const amount = 50;
    const currency = "USD";

    before(() => {
      deleteGiftCardsWithTagStartsWith(startsWith);
      cy.clearSessionData().loginUserViaRequest();
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
          getGiftCardWithTag(name);
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
          getGiftCardWithTag(name);
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
          getGiftCardWithTag(name);
        })
        .then(giftCard => {
          expect(giftCard.code).to.eq(giftCardCode);
          expect(giftCard.initialBalance.amount).to.eq(amount);
          expect(giftCard.initialBalance.currency).to.eq(currency);
          expect(giftCard.expiryDate).to.eq(date);
        });
    });
  });
});
