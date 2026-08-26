import {
  AttributeInputTypeEnum,
  AttributeTypeEnum,
  type PageTypeDetailsFragment,
  type PageTypeFragment,
} from "@dashboard/graphql";

export const pageTypes: PageTypeFragment[] = [
  {
    id: "UGFnZVR5cGU6MQ==",
    name: "Blog",
    hasPages: true,
    __typename: "PageType",
  },
  {
    id: "UGFnZVR5cGU6Mw==",
    name: "Landing Page",
    hasPages: true,
    __typename: "PageType",
  },
  {
    id: "UGFnZVR5cGU6Mg==",
    name: "Marketing Page",
    hasPages: false,
    __typename: "PageType",
  },
];

export const pageType: PageTypeDetailsFragment = {
  id: "UGFnZVR5cGU6MQ==",
  __typename: "PageType",
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123",
    },
  ],
  name: "Blog",
  hasPages: true,
  attributes: [
    {
      __typename: "Attribute" as const,
      id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
      name: "Author",
      slug: "author",
      visibleInStorefront: true,
      filterableInStorefront: true,
      type: AttributeTypeEnum.PAGE_TYPE,
      inputType: AttributeInputTypeEnum.DROPDOWN,
      unit: null,
      valueRequired: true,
    },
    {
      __typename: "Attribute" as const,
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMQ==",
      name: "Language",
      slug: "language",
      visibleInStorefront: true,
      filterableInStorefront: true,
      type: AttributeTypeEnum.PAGE_TYPE,
      inputType: AttributeInputTypeEnum.DROPDOWN,
      unit: null,
      valueRequired: false,
    },
    {
      __typename: "Attribute" as const,
      id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
      name: "Author",
      slug: "author",
      visibleInStorefront: true,
      filterableInStorefront: true,
      type: AttributeTypeEnum.PAGE_TYPE,
      inputType: AttributeInputTypeEnum.DROPDOWN,
      unit: null,
      valueRequired: true,
    },
  ],
  privateMetadata: [],
};
