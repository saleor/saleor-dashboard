import { gql } from "@apollo/client";

export const attributeValueFragment = gql`
  fragment AttributeValue on AttributeValue {
    id
    name
    slug
    file {
      ...File
    }
    reference
    boolean
    date
    dateTime
    value
  }
`;

export const attributeValueDetailsFragment = gql`
  ${attributeValueFragment}
  fragment AttributeValueDetails on AttributeValue {
    ...AttributeValue
    plainText
    richText
  }
`;

export const attributeFragment = gql`
  fragment Attribute on Attribute {
    id
    name
    slug
    type
    visibleInStorefront
    # Removed from Attribute in 3.24. @lockSchema keeps it off the wire on staging builds, so the
    # one document serves both schemas — see src/graphql/lockSchema.ts. Readers are gated behind
    # isMainSchema(); delete the line and its readers once staging becomes main.
    filterableInStorefront @lockSchema(schema: "main")
    unit
    inputType
  }
`;

export const attributeAssignedListFragment = gql`
  fragment AttributeAssignedList on Attribute {
    ...Attribute
    valueRequired
  }
`;

export const attributeUpdateResultFragment = gql`
  fragment AttributeUpdateResult on Attribute {
    ...Attribute
    # Removed from Attribute in 3.24, see the note on filterableInStorefront above
    availableInGrid @lockSchema(schema: "main")
    storefrontSearchPosition @lockSchema(schema: "main")
    valueRequired
    referenceTypes {
      ... on ProductType {
        id
        name
      }
      ... on PageType {
        id
        name
      }
    }
  }
`;

export const attributeAssignedTypesFragment = gql`
  fragment AttributeAssignedTypes on Attribute {
    productTypes(first: 100) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
      }
    }
    productVariantTypes(first: 100) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export const attributeDetailsFragment = gql`
  fragment AttributeDetails on Attribute {
    ...Attribute
    # Removed from Attribute in 3.24, see the note on filterableInStorefront above
    availableInGrid @lockSchema(schema: "main")
    entityType
    storefrontSearchPosition @lockSchema(schema: "main")
    valueRequired
    referenceTypes {
      ... on ProductType {
        id
        name
      }
      ... on PageType {
        id
        name
      }
    }
    choices(
      first: $firstValues
      after: $afterValues
      last: $lastValues
      before: $beforeValues
      search: $searchValues
    ) {
      ...AttributeValueList
    }
  }
`;

export const attributeValueListFragment = gql`
  fragment AttributeValueList on AttributeValueCountableConnection {
    pageInfo {
      ...PageInfo
    }
    edges {
      cursor
      node {
        ...AttributeValueDetails
      }
    }
  }
`;

export const availableAttributeFragment = gql`
  fragment AvailableAttribute on Attribute {
    id
    name
    slug
    inputType
  }
`;
