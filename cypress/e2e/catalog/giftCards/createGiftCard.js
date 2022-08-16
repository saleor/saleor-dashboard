/// <reference types="cypress" />
/// <reference types="../../../support"/>

import faker from "faker";

import { getGiftCardsWithCode } from "../../../support/api/requests/GiftCard";
import { deleteGiftCardsWithTagStartsWith } from "../../../support/api/utils/catalog/giftCardUtils";
import { addToDate } from "../../../support/api/utils/misc";
import { formatDate } from "../../../support/formatData/formatDate";
import {
  expiryPeriods,
  openAndFillUpCreateGiftCardDialog,
  saveGiftCard,
  setExpiryDate,
  setExpiryPeriod,
} from "../../../support/pages/catalog/giftCardPage";

describe("As an admin I want to create gift card", () => {
  const startsWith = "CreateGCards";
  const amount = 50;
  const currency = "USD";

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteGiftCardsWithTagStartsWith(startsWith);
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should be able to create never expire gift card. TC: SALEOR_1001",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let giftCard;

      openAndFillUpCreateGiftCardDialog({
        note: name,
        tag: name,
        amount,
        currency,
      });
      saveGiftCard()
        .then(giftCardResp => {
          giftCard = giftCardResp;
          getGiftCardsWithCode(giftCard.code);
        })
        .then(giftCardsResp => {
          expect(giftCardsResp[0].node.code).to.eq(giftCard.code);
          expect(giftCardsResp[0].node.initialBalance.amount).to.eq(amount);
          expect(giftCardsResp[0].node.initialBalance.currency).to.eq(currency);
        });
    },
  );

  it(
    "should be able to create gift card with two moths expiry. TC: SALEOR_1002",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let giftCard;
      const expectedExpiryDate = addToDate(new Date(), 2, "M");

      openAndFillUpCreateGiftCardDialog({
        note: name,
        tag: name,
        amount,
        currency,
      });
      setExpiryPeriod(2, expiryPeriods.MONTH);
      saveGiftCard()
        .then(giftCardResp => {
          giftCard = giftCardResp;
          getGiftCardsWithCode(giftCard.code);
        })
        .then(giftCardsResp => {
          expect(giftCardsResp[0].node.code).to.eq(giftCard.code);
          expect(giftCardsResp[0].node.initialBalance.amount).to.eq(amount);
          expect(giftCardsResp[0].node.initialBalance.currency).to.eq(currency);
          expect(giftCardsResp[0].node.expiryDate).to.eq(expectedExpiryDate);
        });
    },
  );

  it(
    "should be able to create gift card with date expiry. TC: SALEOR_1003",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const date = formatDate(new Date(new Date().getFullYear() + 2, 1, 1));
      let giftCard;

      openAndFillUpCreateGiftCardDialog({
        note: name,
        tag: name,
        amount,
        currency,
      });
      setExpiryDate(date);
      saveGiftCard()
        .then(giftCardResp => {
          giftCard = giftCardResp;
          getGiftCardsWithCode(giftCard.code);
        })
        .then(giftCardsResp => {
          expect(giftCardsResp[0].node.code).to.eq(giftCard.code);
          expect(giftCardsResp[0].node.initialBalance.amount).to.eq(amount);
          expect(giftCardsResp[0].node.initialBalance.currency).to.eq(currency);
          expect(giftCardsResp[0].node.expiryDate).to.eq(date);
        });
    },
  );
});
