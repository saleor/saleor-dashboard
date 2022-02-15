import { gql } from "@apollo/client";

import {
  attributeValueDetailsFragment,
  attributeValueListFragment
} from "./attributes";
import { metadataFragment } from "./metadata";

export const pageFragment = gql`
  fragment PageFragment on Page {
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
        ...AttributeValueListFragment
      }
    }
    values {
      ...AttributeValueDetailsFragment
    }
  }
`;

export const pageAttributesFragment = gql`
  ${attributeValueDetailsFragment}
  ${attributeValueListFragment}
  fragment PageAttributesFragment on Page {
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
          ...AttributeValueListFragment
        }
      }
    }
  }
`;

export const pageDetailsFragment = gql`
  ${pageFragment}
  ${pageAttributesFragment}
  ${metadataFragment}
  fragment PageDetailsFragment on Page {
    ...PageFragment
    ...PageAttributesFragment
    ...MetadataFragment
    content
    seoTitle
    seoDescription
    publicationDate
  }
`;
