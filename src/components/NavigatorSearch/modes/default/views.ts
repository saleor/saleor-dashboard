import { AppUrls } from "@dashboard/apps/urls";
import { attributeListUrl } from "@dashboard/attributes/urls";
import { categoryListUrl } from "@dashboard/categories/urls";
import { collectionListUrl } from "@dashboard/collections/urls";
import { customerListUrl } from "@dashboard/customers/urls";
import { saleListUrl, voucherListUrl } from "@dashboard/discounts/urls";
import { UseNavigatorResult } from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { fuzzySearch } from "@dashboard/misc";
import { menuListUrl } from "@dashboard/navigation/urls";
import { orderDraftListUrl, orderListUrl } from "@dashboard/orders/urls";
import { pageListUrl } from "@dashboard/pages/urls";
import { permissionGroupListUrl } from "@dashboard/permissionGroups/urls";
import { pluginListUrl } from "@dashboard/plugins/urls";
import { productListUrl } from "@dashboard/products/urls";
import { productTypeListUrl } from "@dashboard/productTypes/urls";
import { shippingZonesListUrl } from "@dashboard/shipping/urls";
import { siteSettingsUrl } from "@dashboard/siteSettings/urls";
import { staffListUrl } from "@dashboard/staff/urls";
import { taxConfigurationListUrl } from "@dashboard/taxes/urls";
import { languageListUrl } from "@dashboard/translations/urls";
import { warehouseListUrl } from "@dashboard/warehouses/urls";
import { IntlShape } from "react-intl";

import { QuickSearchActionInput } from "../../types";

interface View {
  label: string;
  url: string;
}
function searchInViews(
  search: string,
  intl: IntlShape,
  navigate: UseNavigatorResult,
): QuickSearchActionInput[] {
  const views: View[] = [
    {
      label: intl.formatMessage(sectionNames.apps),
      url: AppUrls.resolveAppListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.attributes),
      url: attributeListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.categories),
      url: categoryListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.collections),
      url: collectionListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.customers),
      url: customerListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.draftOrders),
      url: orderDraftListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.home),
      url: "/",
    },
    {
      label: intl.formatMessage(sectionNames.navigation),
      url: menuListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.orders),
      url: orderListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.content),
      url: pageListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.permissionGroups),
      url: permissionGroupListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.plugins),
      url: pluginListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.productTypes),
      url: productTypeListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.products),
      url: productListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.sales),
      url: saleListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.shipping),
      url: shippingZonesListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.siteSettings),
      url: siteSettingsUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.staff),
      url: staffListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.taxes),
      url: taxConfigurationListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.translations),
      url: languageListUrl,
    },
    {
      label: intl.formatMessage(sectionNames.vouchers),
      url: voucherListUrl(),
    },
    {
      label: intl.formatMessage(sectionNames.warehouses),
      url: warehouseListUrl(),
    },
  ];

  return fuzzySearch(views, search, ["label"]).map(view => ({
    label: view.label,
    onClick: () => {
      navigate(view.url);

      return false;
    },
    text: view.label,
    type: "view",
  }));
}

export default searchInViews;
