export const LEFT_MENU_SELECTORS = {
  catalog: "[data-test='menu-item-label'][data-test-id='catalogue']",
  pages: "[data-test='menu-item-label'][data-test-id='pages']",
  configuration: "[data-test='menu-item-label'][data-test-id='configure']",
  home: "[data-test='menu-item-label'][data-test-id='home']",
  orders: "[data-test='menu-item-label'][data-test-id='orders']",
  discounts: "[data-test='menu-item-label'][data-test-id='discounts']",
  appSection: "[data-test='menu-item-label'][data-test-id='apps_section']",
  app: "[data-test='menu-item-label'][data-test-id='apps']",
  translations: "[data-test='menu-item-label'][data-test-id='translations']",
  customers: "[data-test='menu-item-label'][data-test-id='customers']"
};
export const DISCOUNTS_MENU_SELECTORS = {
  sales: "[data-test='submenu-item-label'][data-test-id='sales']",
  vouchers: "[data-test='submenu-item-label'][data-test-id='vouchers']"
};
export const ORDERS = {
  orders: "[data-test='submenu-item-label'][data-test-id='orders']",
  draftOrders: "[data-test='submenu-item-label'][data-test-id='order-drafts']"
};
export const CATALOG = {
  products: "[data-test='submenu-item-label'][data-test-id='products']",
  categories: "[data-test='submenu-item-label'][data-test-id='categories']",
  collections: "[data-test='submenu-item-label'][data-test-id='collections']"
};

export const APP_MENU_SELECTORS = {
  app: "[data-test='submenu-item-label'][data-test-id='apps']"
};

export const appCommonSelector = "[data-test-id*='apps']";
