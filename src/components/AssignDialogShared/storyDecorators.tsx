import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import {
  _GetCategoriesChoicesDocument,
  _GetChannelOperandsDocument,
  _GetCollectionsChoicesDocument,
  _GetDynamicLeftOperandsDocument,
  _GetPageTypesChoicesDocument,
  _GetProductTypesChoicesDocument,
} from "@dashboard/graphql/hooks.generated";
import { Decorator } from "@storybook/react-vite";
import { print } from "graphql";

const mockResponses: Record<string, object> = {
  [print(_GetChannelOperandsDocument)]: {
    channels: [
      {
        __typename: "Channel",
        id: "default-channel",
        name: "Default Channel",
        slug: "default-channel",
      },
      { __typename: "Channel", id: "us-channel", name: "US Channel", slug: "us-channel" },
    ],
  },
  [print(_GetProductTypesChoicesDocument)]: {
    productTypes: {
      __typename: "ProductTypeCountableConnection",
      edges: [
        {
          __typename: "ProductTypeCountableEdge",
          node: {
            __typename: "ProductType",
            id: "pt-1",
            name: "Simple Product",
            slug: "simple-product",
          },
        },
        {
          __typename: "ProductTypeCountableEdge",
          node: {
            __typename: "ProductType",
            id: "pt-2",
            name: "Digital Product",
            slug: "digital-product",
          },
        },
      ],
    },
  },
  [print(_GetCategoriesChoicesDocument)]: {
    categories: {
      __typename: "CategoryCountableConnection",
      edges: [
        {
          __typename: "CategoryCountableEdge",
          node: { __typename: "Category", id: "cat-1", name: "Apparel", slug: "apparel" },
        },
        {
          __typename: "CategoryCountableEdge",
          node: { __typename: "Category", id: "cat-2", name: "Electronics", slug: "electronics" },
        },
      ],
    },
  },
  [print(_GetCollectionsChoicesDocument)]: {
    collections: {
      __typename: "CollectionCountableConnection",
      edges: [
        {
          __typename: "CollectionCountableEdge",
          node: { __typename: "Collection", id: "col-1", name: "Summer Sale", slug: "summer-sale" },
        },
        {
          __typename: "CollectionCountableEdge",
          node: {
            __typename: "Collection",
            id: "col-2",
            name: "New Arrivals",
            slug: "new-arrivals",
          },
        },
      ],
    },
  },
  [print(_GetDynamicLeftOperandsDocument)]: {
    attributes: {
      __typename: "AttributeCountableConnection",
      edges: [
        {
          __typename: "AttributeCountableEdge",
          node: {
            __typename: "Attribute",
            id: "attr-1",
            name: "Color",
            slug: "color",
            inputType: "DROPDOWN",
            entityType: null,
          },
        },
        {
          __typename: "AttributeCountableEdge",
          node: {
            __typename: "Attribute",
            id: "attr-2",
            name: "Size",
            slug: "size",
            inputType: "DROPDOWN",
            entityType: null,
          },
        },
      ],
    },
  },
  [print(_GetPageTypesChoicesDocument)]: {
    pageTypes: {
      __typename: "PageTypeCountableConnection",
      edges: [
        {
          __typename: "PageTypeCountableEdge",
          node: { __typename: "PageType", id: "pt-1", name: "Blog Post", slug: "blog-post" },
        },
        {
          __typename: "PageTypeCountableEdge",
          node: { __typename: "PageType", id: "pt-2", name: "Landing Page", slug: "landing-page" },
        },
      ],
    },
  },
};

const mockLink = new ApolloLink(operation => {
  const queryStr = print(operation.query);
  const data = mockResponses[queryStr];

  if (data) {
    return new Observable(observer => {
      observer.next({ data });
      observer.complete();
    });
  }

  return new Observable(observer => {
    observer.next({ data: null });
    observer.complete();
  });
});

const mockClient = new ApolloClient({
  link: mockLink,
  cache: new InMemoryCache({ addTypename: false }),
  defaultOptions: {
    query: { fetchPolicy: "no-cache" },
    watchQuery: { fetchPolicy: "no-cache" },
  },
});

export const withMockedFilters: Decorator = (Story: React.ComponentType) => (
  <ApolloProvider client={mockClient}>
    <Story />
  </ApolloProvider>
);
