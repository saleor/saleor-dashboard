export const GIFT_CARD_LIST = {
  issueCardButton: '[data-test-id="issue-card-button"]',
  selectGiftCardCheckbox: '[data-test-id="select-gift-card-checkbox"]',
  deactivateGiftCardButton: '[data-test-id="deactivate-gift-cards"]',
  activateGiftCardButton: '[data-test-id="activate-gift-cards"]',
  selectedAmount: '[data-test-id="SelectedText"]',
};

export const giftCardRow = giftCardId =>
  `[data-test-id="gift-card-row-${giftCardId}"]`;
