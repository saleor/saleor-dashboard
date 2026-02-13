import {
  _GetCategoriesChoicesDocument,
  _GetChannelOperandsDocument,
  _GetCollectionsChoicesDocument,
  _GetDynamicLeftOperandsDocument,
  _GetPageTypesChoicesDocument,
  _GetProductTypesChoicesDocument,
} from "@dashboard/graphql/hooks.generated";
import { MockResponse } from "@storybookUtils/apollo";

import {
  AttributeConnectionFactory,
  CategoryConnectionFactory,
  CollectionConnectionFactory,
  PageTypeConnectionFactory,
  ProductTypeConnectionFactory,
} from "./connectionFactories";
import { ChannelFactory } from "./factories";

export const assignDialogFilterResponses: Promise<MockResponse[]> = Promise.all([
  ChannelFactory.buildList(2),
  ProductTypeConnectionFactory.build(),
  CategoryConnectionFactory.build(),
  CollectionConnectionFactory.build(),
  AttributeConnectionFactory.build(),
  PageTypeConnectionFactory.build(),
]).then(([channels, productTypes, categories, collections, attributes, pageTypes]) => [
  {
    query: _GetChannelOperandsDocument,
    data: { channels },
  },
  { query: _GetProductTypesChoicesDocument, data: { productTypes } },
  { query: _GetCategoriesChoicesDocument, data: { categories } },
  { query: _GetCollectionsChoicesDocument, data: { collections } },
  { query: _GetDynamicLeftOperandsDocument, data: { attributes } },
  { query: _GetPageTypesChoicesDocument, data: { pageTypes } },
]);
