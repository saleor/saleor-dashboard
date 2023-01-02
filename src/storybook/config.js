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

  // // Product types
  // require("./stories/productTypes/ProductTypeCreatePage");
  // require("./stories/productTypes/ProductTypeDetailsPage");
  // require("./stories/productTypes/ProductTypeListPage");

  // // Shipping
  // require("./stories/shipping/ShippingZoneCreatePage");
  // require("./stories/shipping/ShippingZoneDetailsPage");
  // require("./stories/shipping/ShippingZonesListPage");

  // // Site settings
  // require("./stories/siteSettings/SiteSettingsPage");

  // // Translations
  // require("./stories/translations/TranslationsEntitiesListPage");
  // require("./stories/translations/TranslationsLanguageListPage");
}

configure(loadStories, module);
