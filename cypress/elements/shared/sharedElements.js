export const SHARED_ELEMENTS = {
  header: "[data-test-id='page-header']",
  progressBar: '[role="progressbar"]',
  circularProgress: '[class*="CircularProgress-circle"]',
  skeleton: '[data-test-id="skeleton"]',
  table: 'table[class*="Table"]',
  selectOption: '[data-test="selectFieldOption"]',
  confirmationMsg: "[data-test='notification-success']"
};

export const getElementByDataTestId = dataTestId =>
  `[data-test-id=${dataTestId}]`;
