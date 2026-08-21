import {
  AttributeInputTypeEnum,
  AttributeTypeEnum,
  type CustomerTypeDetailsFragment,
  type CustomerTypeFragment,
} from "@dashboard/graphql";

export const customerTypes: CustomerTypeFragment[] = [
  {
    id: "Q3VzdG9tZXJUeXBlOjE=",
    name: "Default",
    slug: "default",
    isDefault: true,
    __typename: "CustomerType",
  },
  {
    id: "Q3VzdG9tZXJUeXBlOjI=",
    name: "B2B",
    slug: "b2b",
    isDefault: false,
    __typename: "CustomerType",
  },
  {
    id: "Q3VzdG9tZXJUeXBlOjM=",
    name: "Wholesale",
    slug: "wholesale",
    isDefault: false,
    __typename: "CustomerType",
  },
];

export const customerType: CustomerTypeDetailsFragment = {
  id: "Q3VzdG9tZXJUeXBlOjI=",
  __typename: "CustomerType",
  name: "B2B",
  slug: "b2b",
  isDefault: false,
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123",
    },
  ],
  attributes: [
    {
      __typename: "Attribute" as const,
      id: "QXR0cmlidXRlOjQ3",
      name: "Loyalty level",
      slug: "loyalty-level",
      visibleInStorefront: true,
      filterableInStorefront: true,
      type: AttributeTypeEnum.CUSTOMER_TYPE,
      inputType: AttributeInputTypeEnum.DROPDOWN,
      unit: null,
      valueRequired: true,
    },
    {
      __typename: "Attribute" as const,
      id: "QXR0cmlidXRlOjQ4",
      name: "Company size",
      slug: "company-size",
      visibleInStorefront: false,
      filterableInStorefront: false,
      type: AttributeTypeEnum.CUSTOMER_TYPE,
      inputType: AttributeInputTypeEnum.DROPDOWN,
      unit: null,
      valueRequired: false,
    },
  ],
};

export const defaultCustomerType: CustomerTypeDetailsFragment = {
  ...customerType,
  id: "Q3VzdG9tZXJUeXBlOjE=",
  name: "Default",
  slug: "default",
  isDefault: true,
  attributes: [],
};
