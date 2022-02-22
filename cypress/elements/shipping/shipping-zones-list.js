export const SHIPPING_ZONES_LIST = {
  addShippingZone: "[data-test-id='add-shipping-zone']",
  unitSelect: "[id='mui-component-select-unit']",
  saveUnit: '[data-test-id="save-unit"]'
};

export const SHIPPING_ZONE_CHECKBOX = shippingId =>
  `[data-test-id="${shippingId}-checkbox"]`;

export const SHIPPING_ZONE_NAME = shippingId =>
  `[data-test-id="${shippingId}-name"]`;
