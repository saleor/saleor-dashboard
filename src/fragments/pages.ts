import gql from "graphql-tag";

import { attributeValueFragment } from "./attributes";
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
  fragment PageAttributesFragment on Page {
    attributes {
      attribute {
        id
        slug
        name
        inputType
        valueRequired
        values {
          ...AttributeValueFragment
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
        valueRequired
        values {
          ...AttributeValueFragment
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
    contentJson
    seoTitle
    seoDescription
    publicationDate
  }
`;
