/* eslint-disable */
import { configure } from "@storybook/react";
import requireContext from "require-context.macro";

window.__SALEOR_CONFIG__ = {
  APP_MOUNT_URI: "/",
  MARKETPLACE_URL: "",
};

const req = requireContext("../", true, /.stories.tsx$/);

function loadStories() {
  // Story autodiscovery
  req.keys().forEach(filename => req(filename));

  // Components
  require("./stories/components/ErrorPage");
  require("./stories/components/NotFoundPage");

  // Categories
  require("./stories/categories/CategoryCreatePage");
  require("./stories/categories/CategoryUpdatePage");
  require("./stories/categories/CategoryListPage");

  // Collections
  require("./stories/collections/CollectionCreatePage");
  require("./stories/collections/CollectionDetailsPage");
  require("./stories/collections/CollectionListPage");

  // Configuration
  require("./stories/configuration/ConfigurationPage");

  // Customers
  require("./stories/customers/CustomerAddressListPage");
  require("./stories/customers/CustomerCreatePage");
  require("./stories/customers/CustomerDetailsPage");
  require("./stories/customers/CustomerListPage");

  // Discounts
  require("./stories/discounts/SaleCreatePage");
  require("./stories/discounts/SaleDetailsPage");
  require("./stories/discounts/SaleListPage");
  require("./stories/discounts/VoucherCreatePage");
  require("./stories/discounts/VoucherDetailsPage");
  require("./stories/discounts/VoucherListPage");

  // Homepage
  require("./stories/home/HomePage");

  // Navigation
  require("./stories/navigation/MenuDetailsPage");
  require("./stories/navigation/MenuListPage");

  // Pages
  require("./stories/pages/PageDetailsPage");
  require("./stories/pages/PageListPage");

  // Plugins
  require("./stories/plugins/PluginDetailsPage");
  require("./stories/plugins/PluginsListPage");

  // Products
  require("./stories/products/ProductCreatePage");
  require("./stories/products/ProductImagePage");
  require("./stories/products/ProductListPage");
  require("./stories/products/ProductUpdatePage");
  require("./stories/products/ProductVariantCreatePage");
  require("./stories/products/ProductVariantPage");

  // Orders
  require("./stories/orders/OrderDetailsPage");
  require("./stories/orders/OrderDraftListPage");
  require("./stories/orders/OrderDraftPage/OrderDraftPage");

  // Product types
  require("./stories/productTypes/ProductTypeCreatePage");
  require("./stories/productTypes/ProductTypeDetailsPage");
  require("./stories/productTypes/ProductTypeListPage");

  // Shipping
  require("./stories/shipping/ShippingZoneCreatePage");
  require("./stories/shipping/ShippingZoneDetailsPage");
  require("./stories/shipping/ShippingZonesListPage");

  // Site settings
  require("./stories/siteSettings/SiteSettingsPage");

  // Translations
  require("./stories/translations/TranslationsEntitiesListPage");
  require("./stories/translations/TranslationsLanguageListPage");
}

configure(loadStories, module);
