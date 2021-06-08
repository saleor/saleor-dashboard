import gql from "graphql-tag";

import {
  attributeValueFragment,
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

export const pageAttributesFragment = gql`
  ${attributeValueFragment}
  ${attributeValueListFragment}
  fragment PageAttributesFragment on Page {
    attributes {
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
        ...AttributeValueFragment
      }
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
