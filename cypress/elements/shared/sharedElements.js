export const SHARED_ELEMENTS = {
  header: "[data-test-id='page-header']",
  progressBar: '[role="progressbar"]',
  circularProgress: '[class*="CircularProgress-circle"]',
  autocompleteCircle: '[class*="arrowInnerContainer"]',
  skeleton: '[data-test-id="skeleton"]',
  table: 'table[class*="Table"]',
  tableRow: '[data-test="id"], [class*="MuiTableRow"]',
  notificationSuccess: '[data-test="notification"][data-test-type="success"]',
  dialog: '[role="dialog"]',
  searchInput: '[data-test-id="searchInput"]',
  selectOption: '[data-test="selectFieldOption"]',
  svgImage: "svg",
  fileInput: 'input[type="file"]',
  urlInput: 'input[type="url"]',
  richTextEditor: {
    loader: '[class*="codex-editor__loader"]',
    empty: '[class*="codex-editor--empty"]'
  },
  contentEditable: '[contenteditable="true"]',
  filters: {
    filterGroupActivateCheckbox: '[data-test="filterGroupActive"]',
    filterRow: '[data-test="channel-availability-item"]'
  }
};

export const selectorWithDataValue = value => `[data-value="${value}"]`;

export const getElementByDataTestId = dataTestId =>
  `[data-test-id=${dataTestId}]`;
