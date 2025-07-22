// @ts-strict-ignore
import { FilterContainer } from "@dashboard/components/ConditionalFilter/FilterElement";
import { createOrderQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { OrderFilterInput, OrderStatusFilter, PaymentChargeStatusEnum } from "@dashboard/graphql";
import { findInEnum, parseBoolean } from "@dashboard/misc";
import {
  OrderFilterGiftCard,
  OrderFilterKeys,
} from "@dashboard/orders/components/OrderListPage/filters";

import {
  FilterElement,
  FilterElementKeyValue,
  FilterElementRegular,
} from "../../../components/Filter";
import {
  createFilterTabUtils,
  createFilterUtils,
  getGteLteVariables,
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
  OrderListUrlQueryParams,
} from "../../urls";

export const ORDER_FILTERS_KEY = "orderFiltersPresets";

export function getFilterVariables(
  params: OrderListUrlFilters,
  filterContainer: FilterContainer,
): OrderFilterInput {
  const queryVariables = createOrderQueryVariables(filterContainer);

  return {
    channels: params.channel as unknown as string[],
    created: getGteLteVariables({
      gte: params.createdFrom,
      lte: params.createdTo,
    }),
    customer: params.customer,
    search: params.query,
    status: params?.status?.map(status => findInEnum(status, OrderStatusFilter)),
    paymentStatus: params?.paymentStatus?.map(paymentStatus =>
      findInEnum(paymentStatus, PaymentChargeStatusEnum),
    ),
    isClickAndCollect:
      params.clickAndCollect !== undefined
        ? parseBoolean(params.clickAndCollect, false)
        : undefined,
    isPreorder: params.preorder !== undefined ? parseBoolean(params.preorder, false) : undefined,
    giftCardBought:
      params?.giftCard?.some(param => param === OrderFilterGiftCard.bought) || undefined,
    giftCardUsed: params?.giftCard?.some(param => param === OrderFilterGiftCard.paid) || undefined,
    metadata: params?.metadata,
    ...queryVariables,
  };
}

export function getFilterQueryParam(filter: FilterElement<OrderFilterKeys>): OrderListUrlFilters {
  const { name } = filter;

  switch (name) {
    case OrderFilterKeys.clickAndCollect:
      return getSingleValueQueryParam(filter, OrderListUrlFiltersEnum.clickAndCollect);
    case OrderFilterKeys.preorder:
      return getSingleValueQueryParam(filter, OrderListUrlFiltersEnum.preorder);

    case OrderFilterKeys.created:
      return getMinMaxQueryParam(
        filter,
        OrderListUrlFiltersEnum.createdFrom,
        OrderListUrlFiltersEnum.createdTo,
      );

    case OrderFilterKeys.status:
      return getMultipleEnumValueQueryParam(
        filter as FilterElementRegular<OrderFilterKeys.status>,
        OrderListUrlFiltersWithMultipleValues.status,
        OrderStatusFilter,
      );

    case OrderFilterKeys.paymentStatus:
      return getMultipleEnumValueQueryParam(
        filter as FilterElementRegular<OrderFilterKeys.paymentStatus>,
        OrderListUrlFiltersWithMultipleValues.paymentStatus,
        PaymentChargeStatusEnum,
      );

    case OrderFilterKeys.channel:
      return getMultipleValueQueryParam(filter, OrderListUrlFiltersWithMultipleValues.channel);

    case OrderFilterKeys.customer:
      return getSingleValueQueryParam(filter, OrderListUrlFiltersEnum.customer);

    case OrderFilterKeys.giftCard:
      return getMultipleEnumValueQueryParam(
        filter as FilterElementRegular<OrderFilterKeys.giftCard>,
        OrderListUrlFiltersWithMultipleValues.giftCard,
        OrderFilterGiftCard,
      );

    case OrderFilterKeys.metadata:
      return getKeyValueQueryParam(
        filter as FilterElementKeyValue<OrderFilterKeys.metadata>,
        OrderListFitersWithKeyValueValues.metadata,
      );
  }
}

export const storageUtils = createFilterTabUtils<string>(ORDER_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } = createFilterUtils<
  OrderListUrlQueryParams,
  OrderListUrlFilters
>({
  ...OrderListUrlFiltersEnum,
  ...OrderListUrlFiltersWithMultipleValues,
  ...OrderListFitersWithKeyValueValues,
});
