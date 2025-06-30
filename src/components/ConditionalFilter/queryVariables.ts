import {
  AttributeFilterInput,
  AttributeInput,
  CollectionFilterInput,
  CustomerFilterInput,
  DateRangeInput,
  DateTimeRangeInput,
  DecimalFilterInput,
  GiftCardFilterInput,
  GlobalIdFilterInput,
  OrderDraftFilterInput,
  PageFilterInput,
  ProductTypeFilterInput,
  ProductWhereInput,
  PromotionWhereInput,
  StaffUserInput,
  VoucherFilterInput,
} from "@dashboard/graphql";

import { FilterContainer } from "./FilterElement";
import { QueryApiType, QueryBuilder } from "./QueryBuilder";

export type StaticQueryPart = string | GlobalIdFilterInput | boolean | DecimalFilterInput;

export const mapStaticQueryPartToLegacyVariables = (
  queryPart: StaticQueryPart | AttributeInput,
) => {
  if (typeof queryPart !== "object" || queryPart === null) {
    return queryPart;
  }

  if ("range" in queryPart && queryPart.range) {
    return queryPart.range;
  }

  if ("eq" in queryPart && queryPart.eq) {
    return queryPart.eq;
  }

  if ("oneOf" in queryPart && queryPart.oneOf) {
    return queryPart.oneOf;
  }

  return queryPart;
};

type ProductQueryVars = ProductWhereInput & { channel?: { eq: string } };
export type OrderQueryVars = ProductQueryVars & { created?: DateTimeRangeInput | DateRangeInput };

export const createProductQueryVariables = (value: FilterContainer): ProductQueryVars =>
  new QueryBuilder<ProductQueryVars>(QueryApiType.WHERE, value).build();

export const createDiscountsQueryVariables = (value: FilterContainer): PromotionWhereInput =>
  new QueryBuilder<PromotionWhereInput>(QueryApiType.WHERE, value).build();

export const createOrderQueryVariables = (value: FilterContainer): any =>
  new QueryBuilder<any>(QueryApiType.WHERE, value).build();

export const createVoucherQueryVariables = (
  value: FilterContainer,
): { filters: VoucherFilterInput; channel: string | undefined } => {
  const query = new QueryBuilder<VoucherFilterInput & { channel?: string }>(
    QueryApiType.FILTER,
    value,
  ).build();

  const { channel, ...filters } = query;

  return { filters, channel };
};

export const createPageQueryVariables = (value: FilterContainer): PageFilterInput =>
  new QueryBuilder<PageFilterInput>(QueryApiType.FILTER, value).build();

export const createDraftOrderQueryVariables = (value: FilterContainer): OrderDraftFilterInput =>
  new QueryBuilder<OrderDraftFilterInput>(QueryApiType.FILTER, value).build();

export const createGiftCardQueryVariables = (value: FilterContainer): GiftCardFilterInput =>
  new QueryBuilder<GiftCardFilterInput>(QueryApiType.FILTER, value).build();

export const createCustomerQueryVariables = (value: FilterContainer): CustomerFilterInput =>
  new QueryBuilder<CustomerFilterInput>(QueryApiType.FILTER, value).build();

export const createCollectionsQueryVariables = (
  value: FilterContainer,
): Omit<CollectionFilterInput, "channel"> & { channel?: string } => {
  return new QueryBuilder<CollectionFilterInput & { channel?: { eq: string } }>(
    QueryApiType.FILTER,
    value,
  ).build();
};

export const createProductTypesQueryVariables = (value: FilterContainer): ProductTypeFilterInput =>
  new QueryBuilder<ProductTypeFilterInput>(QueryApiType.FILTER, value).build();

export const createStaffMembersQueryVariables = (value: FilterContainer): StaffUserInput =>
  new QueryBuilder<StaffUserInput>(QueryApiType.FILTER, value).build();

export const createAttributesQueryVariables = (value: FilterContainer): AttributeFilterInput =>
  new QueryBuilder<AttributeFilterInput>(QueryApiType.FILTER, value).build();
