/* eslint-disable sort-keys */
import { PageTypeDetails_pageType } from "./types/PageTypeDetails";
import { PageTypeList_pageTypes_edges_node } from "./types/PageTypeList";

export const pageTypes: PageTypeList_pageTypes_edges_node[] = [
  {
    id: "UGFnZVR5cGU6MQ==",
    name: "Blog",
    __typename: "PageType"
  },
  {
    id: "UGFnZVR5cGU6Mw==",
    name: "Landing Page",
    __typename: "PageType"
  },
  {
    id: "UGFnZVR5cGU6Mg==",
    name: "Marketing Page",
    __typename: "PageType"
  }
];

export const pageType: PageTypeDetails_pageType = {
  id: "UGFnZVR5cGU6MQ==",
  __typename: "PageType",
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123"
    }
  ],
  name: "Blog",
  attributes: [
    {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
      name: "Author",
      slug: "author",
      visibleInStorefront: true
    },
    {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMQ==",
      name: "Language",
      slug: "language",
      visibleInStorefront: true
    },
    {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMA==",
      name: "Publisher",
      slug: "publisher",
      visibleInStorefront: true
    }
  ],
  privateMetadata: []
};
