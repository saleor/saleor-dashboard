import { CategoryListUrlQueryParams } from "@saleor/categories/urls";
import { CollectionListUrlQueryParams } from "@saleor/collections/urls";
import { DEFAULT_INITIAL_PAGINATION_DATA } from "@saleor/config";
import { CustomerListUrlQueryParams } from "@saleor/customers/urls";
import {
  SaleListUrlQueryParams,
  VoucherListUrlQueryParams
} from "@saleor/discounts/urls";
import { MenuListUrlQueryParams } from "@saleor/navigation/urls";
import {
  OrderDraftListUrlQueryParams,
  OrderListUrlQueryParams
} from "@saleor/orders/urls";
import { PageListUrlQueryParams } from "@saleor/pages/urls";
import { PageTypeListUrlQueryParams } from "@saleor/pageTypes/urls";
import { PermissionGroupListUrlQueryParams } from "@saleor/permissionGroups/urls";
import { PluginListUrlQueryParams } from "@saleor/plugins/urls";
import { ProductListUrlQueryParams } from "@saleor/products/urls";
import { ProductTypeListUrlQueryParams } from "@saleor/productTypes/urls";
import { ShippingZonesListUrlQueryParams } from "@saleor/shipping/urls";
import { StaffListUrlQueryParams } from "@saleor/staff/urls";
import { WarehouseListUrlQueryParams } from "@saleor/warehouses/urls";
import { useEffect } from "react";

import useNavigator from "./useNavigator";

export type QueryParams =
  | CollectionListUrlQueryParams
  | CategoryListUrlQueryParams
  | CustomerListUrlQueryParams
  | SaleListUrlQueryParams
  | VoucherListUrlQueryParams
  | MenuListUrlQueryParams
  | OrderDraftListUrlQueryParams
  | OrderListUrlQueryParams
  | PageTypeListUrlQueryParams
  | PageListUrlQueryParams
  | PermissionGroupListUrlQueryParams
  | PluginListUrlQueryParams
  | ProductTypeListUrlQueryParams
  | ProductListUrlQueryParams
  | ShippingZonesListUrlQueryParams
  | StaffListUrlQueryParams
  | WarehouseListUrlQueryParams;

export const usePaginationReset = (
  urlFunc: (params: QueryParams) => string,
  params: QueryParams,
  rowNumber: number
) => {
  const navigate = useNavigator();

  useEffect(
    () =>
      navigate(
        urlFunc({
          ...params,
          ...DEFAULT_INITIAL_PAGINATION_DATA
        }),
        true
      ),
    [rowNumber]
  );

  useEffect(
    () =>
      navigate(
        urlFunc({
          ...params
        }),
        true
      ),
    [params.before, params.after]
  );
};
