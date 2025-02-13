import { ApolloQueryResult } from "@apollo/client";
import {
  _GetChannelOperandsQuery,
  _SearchAttributeOperandsQuery,
  _SearchCategoriesOperandsQuery,
  _SearchCollectionsOperandsQuery,
  _SearchCustomersOperandsQuery,
  _SearchPageTypesOperandsQuery,
  _SearchProductOperandsQuery,
  _SearchProductTypesOperandsQuery,
  ChannelCurrenciesQuery,
} from "@dashboard/graphql";

export type InitialProductAPIResponse = ApolloQueryResult<
  | _GetChannelOperandsQuery
  | _SearchCollectionsOperandsQuery
  | _SearchCategoriesOperandsQuery
  | _SearchProductTypesOperandsQuery
  | _SearchAttributeOperandsQuery
>;
export type InitialOrderAPIResponse = ApolloQueryResult<_GetChannelOperandsQuery>;

export type InitialVoucherAPIResponse = ApolloQueryResult<_GetChannelOperandsQuery>;

export type InitialPageAPIResponse = ApolloQueryResult<_SearchPageTypesOperandsQuery>;

export type InitialGiftCardsAPIResponse = ApolloQueryResult<
  _SearchProductOperandsQuery | _SearchCustomersOperandsQuery | ChannelCurrenciesQuery
>;

export type InitialCollectionAPIResponse = ApolloQueryResult<_GetChannelOperandsQuery>;
