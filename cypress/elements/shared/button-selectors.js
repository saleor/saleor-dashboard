export const BUTTON_SELECTORS = {
  back: '[data-test-id="app-header-back-button"]',
  submit: '[data-test="submit"]',
  confirm: '[data-test="button-bar-confirm"]',
  goBackButton: "[data-test-id='app-header-back-button']",
  checkbox: "[type='checkbox']",
  checked: "[class*='checked']",
  selectOption: "[data-test*='select-option']",
  notSelectedOption: ":not([aria-selected])",
  deleteButton: '[data-test="button-bar-delete"]',
  expandIcon: `[class*="expandIcon"]`
};
