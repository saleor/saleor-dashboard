export const SHARED_ELEMENTS = {
  header: "[data-test-id='page-header']",
  progressBar: '[role="progressbar"]',
  circularProgress: '[class*="CircularProgress-circle"]',
  autocompleteCircle: '[class*="arrowInnerContainer"]',
  skeleton: '[data-test-id="skeleton"]',
  table: 'table[class*="Table"]',
  tableRow: '[data-test-id*="id"], [class*="MuiTableRow"]',
  notificationSuccess: '[data-test="notification"][data-test-type="success"]',
  dialog: '[role="dialog"]',
  searchInput: '[data-test-id="search-input"]',
  selectOption: '[data-test-id*="select-field-option"]',
  svgImage: "svg",
  fileInput: 'input[type="file"]',
  urlInput: 'input[type="url"]',
  richTextEditor: {
    loader: '[class*="codex-editor__loader"]',
    empty: '[class*="codex-editor--empty"]'
  },
  contentEditable: '[contenteditable="true"]',
  filters: {
    filterGroupActivateCheckbox: '[data-test-id*="filter-group-active"]',
    filterRow: '[data-test-id*="channel-availability-item"]'
  },
  warningDialog: '[data-test-id="warning-dialog"]'
};

export const selectorWithDataValue = value => `[data-value="${value}"]`;

export const getElementByDataTestId = dataTestId =>
  `[data-test-id*=${dataTestId}]`;
