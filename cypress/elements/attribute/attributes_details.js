export const ATTRIBUTES_DETAILS = {
  nameInput: '[name="name"]',
  codeInput: '[name="slug"]',
  inputTypeSelect: '[id="mui-component-select-inputType"]',
  assignValuesButton: '[data-test-id="assignValueButton"]',
  valueRequired: '[name="valueRequired"]',
  valueNameInput: '[data-test-id="valueName"]',
  dashboardProperties: {
    useInFilteringCheckbox: '[name="filterableInDashboard"]'
  },
  attributesInputTypes: {
    DROPDOWN: '[data-test-id="DROPDOWN"]',
    DATE: '[data-test-id="DATE"]',
    DATE_TIME: '[data-test-id="DATE_TIME"]',
    MULTISELECT: '[data-test-id="MULTISELECT"]',
    FILE: '[data-test-id="FILE"]',
    REFERENCE: '[data-test-id="REFERENCE"]',
    RICH_TEXT: '[data-test-id="RICH_TEXT"]',
    NUMERIC: '[data-test-id="NUMERIC"]',
    BOOLEAN: '[data-test-id="BOOLEAN"]',
    SWATCH: '[data-test-id="SWATCH"]'
  },
  entityTypeSelect: '[id="mui-component-select-entityType"]',
  entityTypeOptions: {
    PRODUCT: '[data-test-id="PRODUCT"]',
    PAGE: '[data-test-id="PAGE"]'
  },
  selectUnitCheckbox: '[name="selectUnit"]',
  unitSystemSelect: '[data-test-id="unit-system"]',
  unitSystemsOptions: {
    IMPERIAL: '[data-test-id="imperial"]',
    METRIC: '[data-test-id="metric"]'
  },
  unitOfSelect: '[data-test-id="unit-of"]',
  unitsOfOptions: {
    VOLUME: '[data-test-id="volume"]',
    DISTANCE: '[data-test-id="distance"]'
  },
  unitSelect: '[data-test-id="unit"]',
  unitsOptions: {
    CUBIC_CENTIMETER: '[data-test-id="CUBIC_CENTIMETER"]',
    FT: '[data-test-id="FT"]'
  },
  imageCheckbox: '[value= "image"]',
  uploadFileButton: '[data-test="button-upload-file"]',
  pageTypeAttributeCheckbox: '[value="PAGE_TYPE"]',
  swatchValueImage: '[data-test-id="swatch-image"]'
};
