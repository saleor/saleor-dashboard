export const SHARED_ELEMENTS = {
  body: "body",
  header: "[data-test-id='page-header']",
  progressBar: '[role="progressbar"]',
  rowNumberOption: "[data-test-id='rowNumberOption']",
  circularProgress: '[class*="CircularProgress-circle"]',
  autocompleteCircle: '[class*="arrowInnerContainer"]',
  dataGridTable: "[data-testid='data-grid-canvas']",
  skeleton: '[data-test-id="skeleton"]',
  table: 'table[class*="Table"]',
  firstRowDataGrid: "[data-testid='glide-cell-1-0']",
  secondRowDataGrid: "[id='glide-cell-1-1']",
  openColumnPickerButton: "[data-test-id='open-column-picker-button']",
  openDynamicColumnsSearchButton: "[data-test-id='open-dynamic-search']",
  tableRow: '[data-test-id*="id"], [class*="MuiTableRow"]',
  activeStaticColumnOnGridButton: '[data-state="on"]',
  dynamicColumnSelector: '[data-test-id="dynamic-column"]',
  dynamicColumnNameSelector: '[data-test-id^="dynamic-column-name"]',
  gridStaticSkuButton: '[data-test-id="stat-col-sku"]',
  gridStaticVariantNameButton: '[data-test-id="stat-col-variantName"]',
  gridStaticQuantityButton: '[data-test-id="stat-col-quantity"]',
  gridStaticPriceButton: '[data-test-id="stat-col-price"]',
  gridStaticStatusButton: '[data-test-id="stat-col-status"]',
  gridStaticTotalButton: '[data-test-id="stat-col-total"]',
  gridStaticIsGiftButton: '[data-test-id="stat-col-isGift"]',
  gridStaticProductButton: '[data-test-id="stat-col-product"]',
  gridStaticMetadataButton: '[data-test-id="stat-col-metadata"]',
  dynamicColumnSearchInput: '[data-test-id="search-columns"]',
  selectedDynamicColumnNameSelector: '[data-test-id^="column-name-"]',
  removeSelectedDynamicColumnButton:
    '[data-test-id^="remove-dynamic-col-button"]',
  dynamicColumnContainer: '[data-test-id="dynamic-col-container"]',
  staticColumnContainer: '[data-test-id="static-col-container"]',
  paginationForwardOnColumnPicker: '[data-test-id="pagination-forward"]',
  paginationBackOnColumnPicker: '[data-test-id="pagination-back"]',
  notificationSuccess:
    '[data-test-id="notification"][data-test-type="success"]',
  notificationFailure: '[data-test-id="notification"][data-test-type="error"]',
  notificationMessage: '[data-test-id="notification-message"]',
  dialog: '[role="dialog"]',
  searchInput: '[data-test-id="search-input"]',
  selectOption: '[data-test-id*="select-field-option"]',
  svgImage: "svg",
  fileInput: 'input[type="file"]',
  pageHeader: '[data-test-id="page-header"]',
  urlInput: 'input[type="url"]',
  richTextEditor: {
    loader: '[class*="codex-editor__loader"]',
    empty: '[class*="codex-editor--empty"]',
  },
  contentEditable: '[contenteditable="true"]',
  filters: {
    filterGroupActivateCheckbox: '[data-test-id*="filter-group-active"]',
    filterRow: '[data-test-id*="channel-availability-item"]',
  },
  warningDialog: '[data-test-id="warning-dialog"]',
  pageHeader: "[data-test-id='page-header']",
  multiselect: {
    selectedOptions: '[data-test-id*="selected-option-"]',
  },
  multiAutocomplete: {
    selectedOptions: '[id*="selected-option-"]',
  },
};

export const selectorWithDataValue = value => `[data-value="${value}"]`;

export const getElementByDataTestId = dataTestId =>
  `[data-test-id*=${dataTestId}]`;
