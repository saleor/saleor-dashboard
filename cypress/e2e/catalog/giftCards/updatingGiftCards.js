/// <reference types="cypress" />
/// <reference types="../../../support"/>

import faker from "faker";

import { GIFT_CARD_UPDATE } from "../../../elements/catalog/giftCard/giftCardUpdate";
import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { ASSIGN_ELEMENTS_SELECTORS } from "../../../elements/shared/assign-elements-selectors.js";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { giftCardDetailsUrl, urlList } from "../../../fixtures/urlList";
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

  it.skip(
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

  it.skip(
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
    "should be able to delete several gift cards. TC: SALEOR_1009",
    { tags: ["@giftCard", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const name2 = `${startsWith}${faker.datatype.number()}`;

      let giftCard01;
      let giftCard02;

      createGiftCard({
        tag: name,
        amount: 3,
        currency: "THB",
      })
        .then(giftCard01resp => {
          giftCard01 = giftCard01resp;
          cy.log(giftCardDetailsUrl(giftCard01.id));
          createGiftCard({
            tag: name2,
            amount: 7,
            currency: "THB",
          });
        })
        .then(giftCard02resp => {
          giftCard02 = giftCard02resp;
          cy.log(giftCardDetailsUrl(giftCard01.id))
            .log(giftCardDetailsUrl(giftCard02.id))
            .log(`name: ${name}, name2: ${name2}`);
        })
        .then(() => {
          cy.visit(urlList.giftCards)
            .get(PRODUCTS_LIST.showFiltersButton)
            .click()
            .get(PRODUCTS_LIST.filters.filterBy.currency)
            .click()
            .get("[class^=FilterOptionField")
            .contains("THB")
            .click()
            .get(BUTTON_SELECTORS.submit)
            .click()
            .get("[data-test-id^=gift-card-row]")
            .eq(1)
            .should("be.visible")
            .get(ASSIGN_ELEMENTS_SELECTORS.checkbox)
            .first()
            .click()
            .get(BUTTON_SELECTORS.deleteButton)
            .click();

          cy.get(".MuiTypography-root MuiTypography-body1")
            .contains("Selected 2 items")
            .should("be.visible");
          cy.get(BUTTON_SELECTORS.deleteButton).click();
        });
    },
  );
}); // cla test3
