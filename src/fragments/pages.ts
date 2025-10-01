import { gql } from "@apollo/client";

export const pageFragment = gql`
  fragment Page on Page {
    id
    title
    slug
    isPublished
    pageType {
      id
      name
    }
  }
`;

export const pageSelectedAttribute = gql`
  fragment PageSelectedAttribute on SelectedAttribute {
    attribute {
      ...AttributeDetails
    }
    values {
      ...AttributeValueDetails
    }
  }
`;

export const pageAttributesFragment = gql`
  fragment PageAttributes on Page {
    attributes {
      ...PageSelectedAttribute
    }
    pageType {
      id
      name
      attributes {
        id
        name
        inputType
        entityType
        valueRequired
        choices(
          first: $firstValues
          after: $afterValues
          last: $lastValues
          before: $beforeValues
        ) {
          ...AttributeValueList
        }
      }
    }
  }
`;

export const pageDetailsFragment = gql`
  fragment PageDetails on Page {
    ...Page
    ...PageAttributes
    ...Metadata
    content
    seoTitle
    seoDescription
    publishedAt
  }
`;
