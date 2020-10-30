import gql from "graphql-tag";

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
  fragment PageAttributesFragment on Page {
    attributes {
      attribute {
        id
        slug
        name
        inputType
        valueRequired
        values {
          id
          name
          slug
        }
      }
      values {
        id
        name
        slug
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
          id
          name
          slug
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
