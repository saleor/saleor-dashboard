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

import { ChannelSlugDefinition } from "./filterDefinitions/definitions";
import { FilterDefinitionResolver } from "./filterDefinitions/FilterDefinitionResolver";
import { FilterContainer } from "./FilterElement";
import { QueryApiType, QueryBuilder } from "./QueryBuilder";

export type StaticQueryPart = string | GlobalIdFilterInput | boolean | DecimalFilterInput;

type ProductQueryVars = ProductWhereInput & { channel?: { eq: string } };
export type OrderQueryVars = ProductQueryVars & { created?: DateTimeRangeInput | DateRangeInput };

// Create a resolver with ChannelSlugDefinition for views that need channel slug handling
const createChannelSlugResolver = () => {
  const definitions = [
    new ChannelSlugDefinition(),
    ...FilterDefinitionResolver.getDefaultDefinitions(),
  ];

  return new FilterDefinitionResolver(definitions);
};

export const createProductQueryVariables = (value: FilterContainer): ProductQueryVars => {
  const { topLevel, filters } = new QueryBuilder<ProductQueryVars, "channel">(
    QueryApiType.WHERE,
    value,
    ["channel"],
    createChannelSlugResolver(),
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
  const { topLevel, filters } = new QueryBuilder<
    VoucherFilterInput & { channel?: string },
    "channel"
  >(QueryApiType.FILTER, value, ["channel"], createChannelSlugResolver()).build();

  return {
    channel: topLevel.channel,
    filters,
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
  const { topLevel, filters } = new QueryBuilder<
    CollectionFilterInput & { channel?: string },
    "channel"
  >(QueryApiType.FILTER, value, ["channel"], createChannelSlugResolver()).build();

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
