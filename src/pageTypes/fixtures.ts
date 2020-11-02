/* eslint-disable sort-keys */
import { AttributeTypeEnum } from "@saleor/types/globalTypes";

import { PageTypeDetails_pageType } from "./types/PageTypeDetails";
import { PageTypeList_pageTypes_edges_node } from "./types/PageTypeList";

export const pageTypes: PageTypeList_pageTypes_edges_node[] = [
  {
    id: "UGFnZVR5cGU6MQ==",
    name: "Blog",
    hasPages: true,
    __typename: "PageType"
  },
  {
    id: "UGFnZVR5cGU6Mw==",
    name: "Landing Page",
    hasPages: true,
    __typename: "PageType"
  },
  {
    id: "UGFnZVR5cGU6Mg==",
    name: "Marketing Page",
    hasPages: false,
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
  hasPages: true,
  attributes: [
    {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
      name: "Author",
      slug: "author",
      visibleInStorefront: true,
      filterableInDashboard: true,
      filterableInStorefront: true,
      type: AttributeTypeEnum.PAGE_TYPE
    },
    {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMQ==",
      name: "Language",
      slug: "language",
      visibleInStorefront: true,
      filterableInDashboard: true,
      filterableInStorefront: true,
      type: AttributeTypeEnum.PAGE_TYPE
    },
    {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
      name: "Author",
      slug: "author",
      visibleInStorefront: true,
      filterableInDashboard: true,
      filterableInStorefront: true,
      type: AttributeTypeEnum.PAGE_TYPE
    }
  ],
  privateMetadata: []
};
