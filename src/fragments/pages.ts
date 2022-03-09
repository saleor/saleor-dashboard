import { gql } from "@apollo/client";

export const pageFragment = gql`
  fragment Page on Page {
    id
    title
    slug
    isPublished
  }
`;

export const pageSelectedAttribute = gql`
  fragment PageSelectedAttribute on SelectedAttribute {
    attribute {
      id
      slug
      name
      inputType
      entityType
      valueRequired
      unit
      choices(
        first: $firstValues
        after: $afterValues
        last: $lastValues
        before: $beforeValues
      ) {
        ...AttributeValueList
      }
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
    publicationDate
  }
`;
