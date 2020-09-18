import { appsListUrl } from "@saleor/apps/urls";
import { attributeListUrl } from "@saleor/attributes/urls";
import { categoryListUrl } from "@saleor/categories/urls";
import { collectionListUrl } from "@saleor/collections/urls";
import { customerListUrl } from "@saleor/customers/urls";
import { saleListUrl, voucherListUrl } from "@saleor/discounts/urls";
import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { menuListUrl } from "@saleor/navigation/urls";
import { orderDraftListUrl, orderListUrl } from "@saleor/orders/urls";
import { pageListUrl } from "@saleor/pages/urls";
import { permissionGroupListUrl } from "@saleor/permissionGroups/urls";
import { pluginListUrl } from "@saleor/plugins/urls";
import { productListUrl } from "@saleor/products/urls";
import { productTypeListUrl } from "@saleor/productTypes/urls";
import { shippingZonesListUrl } from "@saleor/shipping/urls";
import { siteSettingsUrl } from "@saleor/siteSettings/urls";
import { staffListUrl } from "@saleor/staff/urls";
import { countryListUrl } from "@saleor/taxes/urls";
import { languageListUrl } from "@saleor/translations/urls";
import { warehouseListUrl } from "@saleor/warehouses/urls";
import { score } from "fuzzaldrin";
import { IntlShape } from "react-intl";

import { QuickSearchActionInput } from "../../types";

interface View {
  label: string;
  url: string;
}
function searchInViews(
  search: string,
  intl: IntlShape,
  navigate: UseNavigatorResult
): QuickSearchActionInput[] {
  const views: View[] = [
    {
      label: intl.formatMessage(sectionNames.apps),
      url: appsListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.attributes),
      url: attributeListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.categories),
      url: categoryListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.collections),
      url: collectionListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.customers),
      url: customerListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.draftOrders),
      url: orderDraftListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.home),
      url: "/"
    },
    {
      label: intl.formatMessage(sectionNames.navigation),
      url: menuListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.orders),
      url: orderListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.pages),
      url: pageListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.permissionGroups),
      url: permissionGroupListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.plugins),
      url: pluginListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.productTypes),
      url: productTypeListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.products),
      url: productListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.sales),
      url: saleListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.shipping),
      url: shippingZonesListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.siteSettings),
      url: siteSettingsUrl()
    },
    {
      label: intl.formatMessage(sectionNames.staff),
      url: staffListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.taxes),
      url: countryListUrl
    },
    {
      label: intl.formatMessage(sectionNames.translations),
      url: languageListUrl
    },
    {
      label: intl.formatMessage(sectionNames.vouchers),
      url: voucherListUrl()
    },
    {
      label: intl.formatMessage(sectionNames.warehouses),
      url: warehouseListUrl()
    }
  ];

  return views.map(view => ({
    label: view.label,
    onClick: () => {
      navigate(view.url);
      return false;
    },
    score: score(view.label, search),
    text: view.label,
    type: "view"
  }));
}

export default searchInViews;
