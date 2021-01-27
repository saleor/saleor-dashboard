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

export const pageDetailsFragment = gql`
  ${pageFragment}
  ${metadataFragment}
  fragment PageDetailsFragment on Page {
    ...PageFragment
    ...MetadataFragment
    contentJson
    seoTitle
    seoDescription
    publicationDate
  }
`;
