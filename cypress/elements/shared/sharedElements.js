export const SHARED_ELEMENTS = {
  header: "[data-test-id='page-header']",
  progressBar: '[role="progressbar"]',
  skeleton: '[data-test-id="skeleton"]',
  table: 'table[class*="Table"]',
  confirmationMsg: "[data-test='notification-success']"
};

export const getElementByDataTestId = dataTestId =>
  `[data-test-id=${dataTestId}]`;
