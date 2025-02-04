import { ApolloQueryResult } from "@apollo/client";
import {
  _GetChannelOperandsQuery,
  _SearchAttributeOperandsQuery,
  _SearchCategoriesOperandsQuery,
  _SearchCollectionsOperandsQuery,
  _SearchCustomersOperandsQuery,
  _SearchProductOperandsQuery,
  _SearchProductTypesOperandsQuery,
  ChannelCurrenciesQuery,
} from "@dashboard/graphql";

export type InitialAPIResponse = ApolloQueryResult<
  | _GetChannelOperandsQuery
  | _SearchCollectionsOperandsQuery
  | _SearchCategoriesOperandsQuery
  | _SearchProductTypesOperandsQuery
  | _SearchAttributeOperandsQuery
>;
export type InitialOrderAPIResponse = ApolloQueryResult<_GetChannelOperandsQuery>;

export type InitialGiftCardsAPIResponse = ApolloQueryResult<
  _SearchProductOperandsQuery | _SearchCustomersOperandsQuery | ChannelCurrenciesQuery
>;
