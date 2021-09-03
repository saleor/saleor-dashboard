export const SHARED_ELEMENTS = {
  header: "[data-test-id='page-header']",
  progressBar: '[role="progressbar"]',
  circularProgress: '[class*="CircularProgress-circle"]',
  skeleton: '[data-test-id="skeleton"]',
  table: 'table[class*="Table"]',
  tableRow: '[data-test="id"], [class*="MuiTableRow"]',
  notificationSuccess: '[data-test="notification"][data-test-type="success"]',
  dialog: '[role="dialog"]',
  searchInput: '[data-test-id="searchInput"]',
  selectOption: '[data-test="selectFieldOption"]',
  richTextEditor: {
    loader: '[class*="codex-editor__loader"]',
    empty: '[class*="codex-editor--empty"]'
  },
  filters: {
    filterGroupActivateCheckbox: '[data-test="filterGroupActive"]'
  }
};

export const selectorWithDataValue = value => `[data-value="${value}"]`;

export const getElementByDataTestId = dataTestId =>
  `[data-test-id=${dataTestId}]`;
