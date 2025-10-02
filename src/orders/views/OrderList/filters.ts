import { OrderAuthorizeStatusEnum, OrderChargeStatusEnum, OrderStatus } from "@dashboard/graphql";
import { OrderFilterKeys } from "@dashboard/orders/components/OrderListPage/filters";

import {
  FilterElement,
  FilterElementKeyValue,
  FilterElementRegular,
} from "../../../components/Filter/types";
import {
  createFilterTabUtils,
  getKeyValueQueryParam,
  getMinMaxQueryParam,
  getMultipleEnumValueQueryParam,
  getMultipleValueQueryParam,
  getSingleValueQueryParam,
} from "../../../utils/filters";
import {
  OrderListFitersWithKeyValueValues,
  OrderListUrlFilters,
  OrderListUrlFiltersEnum,
  OrderListUrlFiltersWithMultipleValues,
} from "../../urls";

const ORDER_FILTERS_KEY = "orderFiltersPresets";

export function getFilterQueryParam(filter: FilterElement<OrderFilterKeys>): OrderListUrlFilters {
  const { name } = filter;

  switch (name) {
    case OrderFilterKeys.isClickAndCollect:
      return getSingleValueQueryParam(filter, OrderListUrlFiltersEnum.clickAndCollect);

    case OrderFilterKeys.createdAt:
      return getMinMaxQueryParam(
        filter,
        OrderListUrlFiltersEnum.createdFrom,
        OrderListUrlFiltersEnum.createdTo,
      );

    case OrderFilterKeys.status:
      return getMultipleEnumValueQueryParam(
        filter as FilterElementRegular<OrderFilterKeys.status>,
        OrderListUrlFiltersWithMultipleValues.status,
        OrderStatus,
      );

    case OrderFilterKeys.chargeStatus:
      return getMultipleEnumValueQueryParam(
        filter as FilterElementRegular<OrderFilterKeys.chargeStatus>,
        OrderListUrlFiltersWithMultipleValues.chargeStatus,
        OrderChargeStatusEnum,
      );

    case OrderFilterKeys.channelId:
      return getMultipleValueQueryParam(filter, OrderListUrlFiltersWithMultipleValues.channel);

    case OrderFilterKeys.user:
      return getSingleValueQueryParam(filter, OrderListUrlFiltersEnum.customer);

    case OrderFilterKeys.isGiftCardBought:
      return getSingleValueQueryParam(filter, OrderListUrlFiltersEnum.giftCardBought);

    case OrderFilterKeys.isGiftCardUsed:
      return getSingleValueQueryParam(filter, OrderListUrlFiltersEnum.giftCardUsed);

    case OrderFilterKeys.hasInvoices:
      return getSingleValueQueryParam(filter, OrderListUrlFiltersEnum.hasInvoices);

    case OrderFilterKeys.hasFulfillments:
      return getSingleValueQueryParam(filter, OrderListUrlFiltersEnum.hasFulfillments);

    case OrderFilterKeys.invoicesCreatedAt:
      return getMinMaxQueryParam(
        filter,
        OrderListUrlFiltersEnum.invoicesCreatedFrom,
        OrderListUrlFiltersEnum.invoicesCreatedTo,
      );

    case OrderFilterKeys.authorizeStatus:
      return getMultipleEnumValueQueryParam(
        filter as FilterElementRegular<OrderFilterKeys.authorizeStatus>,
        OrderListUrlFiltersWithMultipleValues.authorizeStatus,
        OrderAuthorizeStatusEnum,
      );

    case OrderFilterKeys.metadata:
      return getKeyValueQueryParam(
        filter as FilterElementKeyValue<OrderFilterKeys.metadata>,
        OrderListFitersWithKeyValueValues.metadata,
      );

    default:
      return {};
  }
}

export const storageUtils = createFilterTabUtils<string>(ORDER_FILTERS_KEY);
