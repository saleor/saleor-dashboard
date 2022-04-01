import { GIFT_CARD_DIALOG } from "../../../elements/catalog/giftCard/giftCardDialog";
import {
  GIFT_CARD_LIST,
  giftCardRow
} from "../../../elements/catalog/giftCard/giftCardList";
import { GIFT_CARD_UPDATE } from "../../../elements/catalog/giftCard/giftCardUpdate";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { giftCardDetailsUrl, urlList } from "../../../fixtures/urlList";

export function openAndFillUpCreateGiftCardDialog({
  note,
  tag,
  amount,
  currency
}) {
  cy.visit(urlList.giftCards)
    .get(GIFT_CARD_LIST.issueCardButton)
    .click()
    .get(GIFT_CARD_DIALOG.currencySelectButton)
    .click();
  cy.contains(GIFT_CARD_DIALOG.currenciesOptions, currency)
    .click()
    .get(GIFT_CARD_DIALOG.amountInput)
    .clearAndType(amount)
    .createNewOption(GIFT_CARD_DIALOG.tagInput, tag)
    .get(GIFT_CARD_DIALOG.noteInput)
    .type(note);
}

export function saveGiftCard() {
  return cy
    .addAliasToGraphRequest("GiftCardCreate")
    .get(BUTTON_SELECTORS.submit)
    .click()
    .get(BUTTON_SELECTORS.submit)
    .click()
    .waitForRequestAndCheckIfNoErrors("@GiftCardCreate")
    .its("response.body.data.giftCardCreate.giftCard");
}

export const expiryPeriods = {
  MONTH: GIFT_CARD_DIALOG.expirationOptions.expiryPeriodMonthType
};

export function setExpiryPeriod(amount, period) {
  cy.get(GIFT_CARD_DIALOG.expirationOptions.setExpiryDateCheckbox)
    .click()
    .get(GIFT_CARD_DIALOG.expirationOptions.expiryPeriodRadioButton)
    .click()
    .get(GIFT_CARD_DIALOG.expirationOptions.expiryPeriodAmount)
    .clearAndType(amount)
    .get(GIFT_CARD_DIALOG.expirationOptions.expiryPeriodTypeButton)
    .click()
    .get(period)
    .click();
}

export function setExpiryDate(date) {
  cy.get(GIFT_CARD_DIALOG.expirationOptions.setExpiryDateCheckbox)
    .click()
    .get(GIFT_CARD_DIALOG.expirationOptions.expiryDateRadioButton)
    .click()
    .get(GIFT_CARD_DIALOG.expirationOptions.expiryDateInput)
    .type(date);
}

export function changeGiftCardActiveStatus(giftCardId) {
  cy.visit(giftCardDetailsUrl(giftCardId))
    .get(GIFT_CARD_UPDATE.changeActiveStatusButton)
    .click()
    .confirmationMessageShouldAppear();
}

export function selectGiftCard(giftCardId) {
  return cy
    .get(giftCardRow(giftCardId))
    .find(GIFT_CARD_LIST.selectGiftCardCheckbox)
    .click();
}

export function enterAndSelectGiftCards(giftCardsIds) {
  const alias = "GiftCardList";
  cy.addAliasToGraphRequest(alias)
    .visit(urlList.giftCards)
    .findElementsAndMakeActionOnTable({
      elementsGraphqlAlias: alias,
      elementsName: "giftCards",
      elementsIds: giftCardsIds,
      actionFunction: selectGiftCard
    });
}
