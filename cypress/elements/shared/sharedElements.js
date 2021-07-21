export const SHARED_ELEMENTS = {
  header: "[data-test-id='page-header']",
  progressBar: '[role="progressbar"]',
  circularProgress: '[class*="CircularProgress-circle"]',
  skeleton: '[data-test-id="skeleton"]',
  table: 'table[class*="Table"]',
  tableRow: '[data-test="id"]',
  confirmationMsg: "[data-test='notification-success']",
  notificationSuccess: '[data-test="notification-success"]',
  dialog: '[role="dialog"]',
  searchInput: '[data-test-id="searchInput"]',
  selectOption: '[data-test="selectFieldOption"]',
  richTextEditor: {
    empty: '[class*="codex-editor--empty"]'
  },
  filters: {
    filterGroupActivateCheckbox: '[data-test="filterGroupActive"]'
  }
};

export const selectorWithDataValue = value => `[data-value="${value}"]`;

export const getElementByDataTestId = dataTestId =>
  `[data-test-id=${dataTestId}]`;
