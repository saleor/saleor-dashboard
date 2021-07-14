export const SHARED_ELEMENTS = {
  header: "[data-test-id='page-header']",
  progressBar: '[role="progressbar"]',
  circularProgress: '[class*="CircularProgress-circle"]',
  skeleton: '[data-test-id="skeleton"]',
  table: 'table[class*="Table"]',
  selectOption: '[data-test="selectFieldOption"]',
  confirmationMsg: "[data-test='notification-success']",
  notificationSuccess: '[data-test="notification-success"]',
  dialog: '[role="dialog"]',
  richTextEditor: {
    empty: '[class*="codex-editor--empty"]'
  }
};

export const selectorWithDataValue = value => `[data-value="${value}"]`;

export const getElementByDataTestId = dataTestId =>
  `[data-test-id=${dataTestId}]`;
