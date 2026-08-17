import { type CategoryDetailsQuery, type CategoryFragment } from "@dashboard/graphql";

import * as richTextEditorFixtures from "../components/RichTextEditor/fixtures.json";

const content = richTextEditorFixtures.richTextEditor;

export const categories: CategoryFragment[] = [
  {
    __typename: "Category",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 2,
    },
    id: "123123",
    name: "Lorem ipsum dolor",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4,
    },
  },
  {
    __typename: "Category",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 54,
    },
    id: "876752",
    name: "Mauris vehicula tortor vulputate",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 3,
    },
  },
  {
    __typename: "Category",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 2,
    },
    id: "876542",
    name: "Excepteur sint occaecat cupidatat non proident",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 6,
    },
  },
  {
    __typename: "Category",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 6,
    },
    id: "875352",
    name: "Ut enim ad minim veniam",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 12,
    },
  },
  {
    __typename: "Category",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 76,
    },
    id: "865752",
    name: "Duis aute irure dolor in reprehenderit",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 43,
    },
  },
  {
    __typename: "Category",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 11,
    },
    id: "878752",
    name: "Neque porro quisquam est",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 21,
    },
  },
];
export const category: (placeholderImage: string) => CategoryDetailsQuery["category"] = (
  placeholderImage: string,
) => ({
  __typename: "Category",
  backgroundImage: {
    __typename: "Image",
    alt: "Alt text",
    oembedData: "{}",
    url: placeholderImage,
  },
  children: {
    __typename: "CategoryCountableConnection",
    totalCount: 0,
    edges: [],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "YXJyYXljb25uZWN0aW9uOjk=",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "YXJyYXljb25uZWN0aW9uOjA=",
    },
  },
  ancestors: {
    __typename: "CategoryCountableConnection",
    edges: [],
  },
  description: JSON.stringify(content),
  id: "Q2F0ZWdvcnk6NA==",
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123",
    },
  ],
  name: "Coffees",
  parent: {
    __typename: "Category",
    id: "Q2F0ZWdvcnk6Mw==",
  },
  privateMetadata: [],
  seoDescription: null,
  seoTitle: null,
  slug: "coffees",
});
export const errors = [
  {
    field: "name",
    message: "To pole jest wymagane.",
  },
];
