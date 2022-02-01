export const SHIPPING_ZONES_LIST = {
  addShippingZone: "[data-test-id='add-shipping-zone']",
  unitSelect: "[id='mui-component-select-unit']",
  saveUnit: '[data-test-id="saveUnit"]'
};

export const SHIPPING_ZONE_CHECKBOX = shippingId =>
  `[data-test-id="${shippingId}-checkbox"]`;
