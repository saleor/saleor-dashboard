import { GIFT_CARD_DIALOG } from "../../../elements/giftCard/giftCardDialog";
import { GIFT_CARD_LIST } from "../../../elements/giftCard/giftCardList";
import { GIFT_CARD_UPDATE } from "../../../elements/giftCard/giftCardUpdate";
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
    .get(BUTTON_SELECTORS.submit)
    .click()
    .get(GIFT_CARD_DIALOG.cardCodeText)
    .invoke("text")
    .then(text => {
      const giftCardCode = text;
      cy.get(BUTTON_SELECTORS.submit).click();
      return cy.wrap(giftCardCode);
    });
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
    .confirmationMessageShouldDisappear();
}
