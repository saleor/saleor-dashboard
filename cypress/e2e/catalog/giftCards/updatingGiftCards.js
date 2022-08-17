/// <reference types="cypress" />
/// <reference types="../../../support"/>

import faker from "faker";

import { GIFT_CARD_UPDATE } from "../../../elements/catalog/giftCard/giftCardUpdate";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { giftCardDetailsUrl } from "../../../fixtures/urlList";
import {
  createGiftCard,
  getGiftCardWithId,
} from "../../../support/api/requests/GiftCard";
import { deleteGiftCardsWithTagStartsWith } from "../../../support/api/utils/catalog/giftCardUtils";
import { formatDate } from "../../../support/formatData/formatDate";

describe("As an admin I want to update gift card", () => {
  const startsWith = "updateGCard";

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteGiftCardsWithTagStartsWith(startsWith);
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
});
