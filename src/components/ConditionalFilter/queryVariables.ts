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
import {
  AttributeHandler,
  AttributeTypeHandler,
  CollectionChannelHandler,
  CollectionPublishedHandler,
  CustomerNumberOfOrdersHandler,
  GiftCardStaticOnlyHandler,
  MetadataHandler,
  ProductTypeConfigurableHandler,
  QueryApiType,
  QueryBuilder,
  StaffMemberStatusHandler,
  VoucherChannelHandler,
  VoucherStatusHandler,
  VoucherTimesUsedHandler,
} from "./QueryBuilder";

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
type CollectionQueryVars = Omit<CollectionFilterInput, "channel"> & { channel?: { eq: string } };

export const createProductQueryVariables = (value: FilterContainer): ProductQueryVars =>
  new QueryBuilder<ProductWhereInput>(QueryApiType.WHERE, value, [
    new AttributeHandler(),
    new MetadataHandler(),
  ]).build();

export const createDiscountsQueryVariables = (value: FilterContainer): PromotionWhereInput =>
  new QueryBuilder<PromotionWhereInput>(QueryApiType.WHERE, value).build();

export const createOrderQueryVariables = (value: FilterContainer): OrderQueryVars =>
  new QueryBuilder<OrderQueryVars>(QueryApiType.WHERE, value, [new MetadataHandler()]).build();

export const createVoucherQueryVariables = (
  value: FilterContainer,
): { filters: VoucherFilterInput; channel: string | undefined } => {
  const channelHandler = new VoucherChannelHandler();

  const filters = new QueryBuilder<VoucherFilterInput>(QueryApiType.FILTER, value, [
    channelHandler,
    new VoucherTimesUsedHandler(),
    new VoucherStatusHandler(),
  ]).build();

  return { filters, channel: channelHandler.getChannel() };
};

export const createPageQueryVariables = (value: FilterContainer): PageFilterInput =>
  new QueryBuilder<PageFilterInput>(QueryApiType.FILTER, value).build();

export const createDraftOrderQueryVariables = (value: FilterContainer): OrderDraftFilterInput =>
  new QueryBuilder<OrderDraftFilterInput>(QueryApiType.FILTER, value).build();

export const createGiftCardQueryVariables = (value: FilterContainer): GiftCardFilterInput =>
  new QueryBuilder<GiftCardFilterInput>(QueryApiType.FILTER, value, [
    new GiftCardStaticOnlyHandler(),
  ]).build();

export const createCustomerQueryVariables = (value: FilterContainer): CustomerFilterInput =>
  new QueryBuilder<CustomerFilterInput>(QueryApiType.FILTER, value, [
    new CustomerNumberOfOrdersHandler(),
    new MetadataHandler(),
  ]).build();

export const createCollectionsQueryVariables = (value: FilterContainer): CollectionQueryVars => {
  const channelHandler = new CollectionChannelHandler();

  const filters = new QueryBuilder<CollectionFilterInput>(QueryApiType.FILTER, value, [
    channelHandler,
    new MetadataHandler(),
    new CollectionPublishedHandler(),
  ]).build();

  return {
    ...filters,
    channel: channelHandler.getChannel(),
  };
};

export const createProductTypesQueryVariables = (value: FilterContainer): ProductTypeFilterInput =>
  new QueryBuilder<ProductTypeFilterInput>(QueryApiType.FILTER, value, [
    new ProductTypeConfigurableHandler(),
  ]).build();

export const createStaffMembersQueryVariables = (value: FilterContainer): StaffUserInput =>
  new QueryBuilder<StaffUserInput>(QueryApiType.FILTER, value, [
    new StaffMemberStatusHandler(),
  ]).build();

export const createAttributesQueryVariables = (value: FilterContainer): AttributeFilterInput =>
  new QueryBuilder<AttributeFilterInput>(QueryApiType.FILTER, value, [
    new AttributeTypeHandler(),
  ]).build();
