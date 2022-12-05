/// <reference types="cypress" />
/// <reference types="../../../support"/>

import faker from "faker";

import { GIFT_CARD_LIST } from "../../../elements/catalog/giftCard/giftCardList";
import { GIFT_CARD_SHOWMORE } from "../../../elements/catalog/giftCard/giftCardShowMore";
import { ASSIGN_ELEMENTS_SELECTORS } from "../../../elements/shared/assign-elements-selectors.js";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { createGiftCard } from "../../../support/api/requests/GiftCard";
import { deleteGiftCardsWithTagStartsWith } from "../../../support/api/utils/catalog/giftCardUtils";
import { enterAndSelectGiftCards } from "../../../support/pages/catalog/giftCardPage";

describe("As an admin I want to export gift card", () => {
  const startsWith = "updateGCard";

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteGiftCardsWithTagStartsWith(startsWith);
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should be able to export several gift cards. TC: SALEOR_101010",
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
            .get(BUTTON_SELECTORS.showMoreButton)
            .click()
            .get(GIFT_CARD_SHOWMORE.exportCodesMenu)
            .click()
            .get(BUTTON_SELECTORS.submit)
            .click();
          //   .get(ASSIGN_ELEMENTS_SELECTORS.checkbox)
          //   .should("not.be.visible");
          // getGiftCardWithId(giftCard01.id).should("be.null");
          // getGiftCardWithId(giftCard02.id).should("be.null");
        });
    },
  );
});
