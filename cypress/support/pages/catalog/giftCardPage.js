import { SHARED_ELEMENTS } from "../../../elements";
import { GIFT_CARD_DIALOG } from "../../../elements/catalog/giftCard/giftCardDialog";
import {
  GIFT_CARD_LIST,
  giftCardRow,
} from "../../../elements/catalog/giftCard/giftCardList";
import { GIFT_CARD_SHOW_MORE } from "../../../elements/catalog/giftCard/giftCardShowMore";
import { GIFT_CARD_UPDATE } from "../../../elements/catalog/giftCard/giftCardUpdate";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { giftCardDetailsUrl, urlList } from "../../../fixtures/urlList";

export function openAndFillUpCreateGiftCardDialog({
  note,
  tag,
  amount,
  currency,
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
  MONTH: GIFT_CARD_DIALOG.expirationOptions.expiryPeriodMonthType,
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
export function selectGiftCardOnListView(giftCardCode) {
  const splitCode = giftCardCode.split("-");
  const lastCodeElement = splitCode.slice(-1).toString();
  cy.log(lastCodeElement);
  return cy
    .contains(
      `${SHARED_ELEMENTS.dataGridTable} table tbody tr`,
      lastCodeElement,
    )
    .invoke("index")
    .then(index => {
      cy.clickGridCell(0, index);
    });
}

export function enterAndSelectGiftCards(giftCardsIds) {
  const alias = "GiftCardList";
  cy.addAliasToGraphRequest(alias)
    .visit(urlList.giftCards)
    .findElementsAndMakeActionOnTable({
      elementsGraphqlAlias: alias,
      elementsName: "giftCards",
      elementsIds: giftCardsIds,
      actionFunction: selectGiftCard,
    });
}
export function openExportGiftCardsDialog() {
  cy.get(BUTTON_SELECTORS.showMoreButton)
    .click({ force: true })
    .get(GIFT_CARD_SHOW_MORE.exportCodesMenu)
    .click();
}
export function selectSelectedRecordsButton() {
  cy.get(GIFT_CARD_SHOW_MORE.exportSelectedRecords).click();
}
export function selectExportAsCSVButton() {
  cy.get(GIFT_CARD_SHOW_MORE.exportAsRadioBtn.csv).click();
}
export function selectExportAsXLSXButton() {
  cy.get(GIFT_CARD_SHOW_MORE.exportAsRadioBtn.xlsx).click();
}
export function clickDeactivateButton() {
  cy.get(GIFT_CARD_LIST.deactivateGiftCardButton).click();
}
export function bulkDeleteRecords() {
  cy.get(BUTTON_SELECTORS.bulkDeleteButton)
    .click()
    .get(GIFT_CARD_UPDATE.consentCheckbox)
    .click()
    .get(BUTTON_SELECTORS.submit)
    .click();
}
export function getUrlWithFilteredTags(url, tagsArray) {
  const urlHelper = url + "?asc=true&sort=usedBy";
  let tagsPath = "";
  tagsArray.forEach((tag, index) => {
    tagsPath += `&tag%5B${index}%5D=${tag}`;
  });
  return urlHelper + tagsPath;
}
