export const SHIPPING_ZONES_LIST_SELECTORS = {
  addShippingZone: "[data-test-id='add-shipping-zone']",
  unitSelect: "[id='mui-component-select-unit']",
  saveUnit: '[data-test-id="save-unit"]',
  settingsButton: '[data-test-id="show-more-button"]',
  changeDefaultWeightUnitButton: '[data-test-id="weight-unit-configuration"]',
  weightUnitSelector: '[name="unit"] span',
  saveUnitsButton: '[data-test-id="save-unit"]',
};

export const SHIPPING_ZONE_CHECKBOX = shippingId =>
  `[data-test-id="${shippingId}-checkbox"]`;

export const SHIPPING_ZONE_NAME = shippingId =>
  `[data-test-id="${shippingId}-name"]`;
