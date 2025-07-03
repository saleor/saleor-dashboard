import {
  AttributeFilterInput,
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

import { SlugChannelDefinition } from "./filterDefinitions/definitions/SlugChannelDefinition";
import { FilterDefinitionResolver } from "./filterDefinitions/FilterDefinitionResolver";
import { FilterContainer } from "./FilterElement";
import { QueryApiType, QueryBuilder } from "./QueryBuilder";

export type StaticQueryPart = string | GlobalIdFilterInput | boolean | DecimalFilterInput;

type ProductQueryVars = ProductWhereInput & { channel?: { eq: string } };
type VoucherQueryVars = VoucherFilterInput & { channel?: string };
type CollectionQueryVars = CollectionFilterInput & { channel?: string };
export type OrderQueryVars = ProductQueryVars & { created?: DateTimeRangeInput | DateRangeInput };

export const createProductQueryVariables = (value: FilterContainer): ProductQueryVars => {
  const { topLevel, filters } = new QueryBuilder<ProductQueryVars, "channel">(
    QueryApiType.WHERE,
    value,
    ["channel"],
  ).build();

  return { ...filters, ...topLevel };
};

export const createDiscountsQueryVariables = (value: FilterContainer): PromotionWhereInput => {
  const { filters } = new QueryBuilder<PromotionWhereInput>(QueryApiType.WHERE, value).build();

  return filters;
};

export const createOrderQueryVariables = (value: FilterContainer): any => {
  const { filters } = new QueryBuilder<any>(QueryApiType.WHERE, value).build();

  return filters;
};

export const createVoucherQueryVariables = (
  value: FilterContainer,
): { filters: VoucherFilterInput; channel: string | undefined } => {
  const { filters, topLevel } = new QueryBuilder<VoucherQueryVars, "channel">(
    QueryApiType.FILTER,
    value,
    ["channel"],
    // VoucherPage expects channel to be a slug, not id
    new FilterDefinitionResolver([
      new SlugChannelDefinition(),
      ...FilterDefinitionResolver.getDefaultDefinitions(),
    ]),
  ).build();

  return {
    filters,
    channel: topLevel.channel,
  };
};

export const createPageQueryVariables = (value: FilterContainer): PageFilterInput => {
  const { filters } = new QueryBuilder<PageFilterInput>(QueryApiType.FILTER, value).build();

  return filters;
};

export const createDraftOrderQueryVariables = (value: FilterContainer): OrderDraftFilterInput => {
  const { filters } = new QueryBuilder<OrderDraftFilterInput>(QueryApiType.FILTER, value).build();

  return filters;
};

export const createGiftCardQueryVariables = (value: FilterContainer): GiftCardFilterInput => {
  const { filters } = new QueryBuilder<GiftCardFilterInput>(QueryApiType.FILTER, value).build();

  return filters;
};

export const createCustomerQueryVariables = (value: FilterContainer): CustomerFilterInput => {
  const { filters } = new QueryBuilder<CustomerFilterInput>(QueryApiType.FILTER, value).build();

  return filters;
};

export const createCollectionsQueryVariables = (
  value: FilterContainer,
): { filter: CollectionFilterInput; channel: string | undefined } => {
  const { topLevel, filters } = new QueryBuilder<CollectionQueryVars, "channel">(
    QueryApiType.FILTER,
    value,
    ["channel"],
  ).build();

  return {
    channel: topLevel.channel,
    filter: filters,
  };
};

export const createProductTypesQueryVariables = (
  value: FilterContainer,
): ProductTypeFilterInput => {
  const { filters } = new QueryBuilder<ProductTypeFilterInput>(QueryApiType.FILTER, value).build();

  return filters;
};

export const createStaffMembersQueryVariables = (value: FilterContainer): StaffUserInput => {
  const { filters } = new QueryBuilder<StaffUserInput>(QueryApiType.FILTER, value).build();

  return filters;
};

export const createAttributesQueryVariables = (value: FilterContainer): AttributeFilterInput => {
  const { filters } = new QueryBuilder<AttributeFilterInput>(QueryApiType.FILTER, value).build();

  return filters;
};
