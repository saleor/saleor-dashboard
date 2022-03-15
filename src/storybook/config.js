/* eslint-disable */
import requireContext from "require-context.macro";
import { configure } from "@storybook/react";

const req = requireContext("../", true, /.stories.tsx$/);

function loadStories() {
  // Story autodiscovery
  req.keys().forEach(filename => req(filename));

  // Components
  require("./stories/components/ActionDialog");
  require("./stories/components/AddressEdit");
  require("./stories/components/AddressFormatter");
  require("./stories/components/AssignProductDialog");
  require("./stories/components/AutocompleteSelectMenu");
  require("./stories/components/CardMenu");
  require("./stories/components/Checkbox");
  require("./stories/components/ColumnPicker");
  require("./stories/components/Date");
  require("./stories/components/DateTime");
  require("./stories/components/DeleteFilterTabDialog");
  require("./stories/components/EditableTableCell");
  require("./stories/components/ErrorMessageCard");
  require("./stories/components/ErrorPage");
  require("./stories/components/ExternalLink");
  require("./stories/components/Filter");
  require("./stories/components/Money");
  require("./stories/components/MoneyRange");
  require("./stories/components/MultiSelectField");
  require("./stories/components/NotFoundPage");
  require("./stories/components/PageHeader");
  require("./stories/components/Percent");
  require("./stories/components/PhoneField");
  require("./stories/components/PriceField");
  require("./stories/components/SaveFilterTabDialog");
  require("./stories/components/SingleSelectField");
  require("./stories/components/Skeleton");
  require("./stories/components/TablePagination");
  require("./stories/components/Timeline");
  require("./stories/components/Weight");
  require("./stories/components/WeightRange");
  require("./stories/components/messages");

  // Attributes
  require("./stories/attributes/AttributeBulkDeleteDialog");
  require("./stories/attributes/AttributeDeleteDialog");
  require("./stories/attributes/AttributeListPage");
  require("./stories/attributes/AttributePage");
  require("./stories/attributes/AttributeValueDeleteDialog");
  require("./stories/attributes/AttributeValueEditDialog");

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
  require("./stories/customers/CustomerAddressDialog");
  require("./stories/customers/CustomerAddressListPage");
  require("./stories/customers/CustomerCreatePage");
  require("./stories/customers/CustomerDetailsPage");
  require("./stories/customers/CustomerListPage");

  // Discounts
  require("./stories/discounts/DiscountCountrySelectDialog");
  require("./stories/discounts/SaleCreatePage");
  require("./stories/discounts/SaleDetailsPage");
  require("./stories/discounts/SaleListPage");
  require("./stories/discounts/VoucherCreatePage");
  require("./stories/discounts/VoucherDetailsPage");
  require("./stories/discounts/VoucherListPage");

  // Homepage
  require("./stories/home/HomePage");

  // Navigation
  require("./stories/navigation/MenuCreateDialog");
  require("./stories/navigation/MenuDetailsPage");
  require("./stories/navigation/MenuItemDialog");
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
  require("./stories/products/ProductVariantImageSelectDialog");
  require("./stories/products/ProductVariantPage");

  // Orders
  require("./stories/orders/OrderBulkCancelDialog");
  require("./stories/orders/OrderCancelDialog");
  require("./stories/orders/OrderCustomer");
  require("./stories/orders/OrderDetailsPage");
  require("./stories/orders/OrderDraftCancelDialog");
  require("./stories/orders/OrderDraftListPage");
  require("./stories/orders/OrderDraftPage/OrderDraftPage");
  require("./stories/orders/OrderFulfillmentCancelDialog");
  require("./stories/orders/OrderFulfillmentTrackingDialog");
  require("./stories/orders/OrderHistory");
  require("./stories/orders/OrderListPage");
  require("./stories/orders/OrderMarkAsPaidDialog");
  require("./stories/orders/OrderPaymentDialog");
  require("./stories/orders/OrderPaymentVoidDialog");
  require("./stories/orders/OrderProductAddDialog");
  require("./stories/orders/OrderShippingMethodEditDialog");
  require("./stories/orders/OrderInvoiceList");

  // Product types
  require("./stories/productTypes/ProductTypeCreatePage");
  require("./stories/productTypes/ProductTypeDetailsPage");
  require("./stories/productTypes/ProductTypeListPage");

  // Shipping
  require("./stories/shipping/ShippingZoneCountriesAssignDialog");
  require("./stories/shipping/ShippingZoneCreatePage");
  require("./stories/shipping/ShippingZoneDetailsPage");
  require("./stories/shipping/ShippingZonesListPage");

  // Site settings
  require("./stories/siteSettings/SiteSettingsPage");

  // Taxes
  require("./stories/taxes/CountryListPage");
  require("./stories/taxes/CountryTaxesPage");

  // Translations
  require("./stories/translations/TranslationsEntitiesListPage");
  require("./stories/translations/TranslationsLanguageListPage");
}

configure(loadStories, module);
