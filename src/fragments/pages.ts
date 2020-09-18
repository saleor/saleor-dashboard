import gql from "graphql-tag";

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
  fragment PageDetailsFragment on Page {
    ...PageFragment
    contentJson
    seoTitle
    seoDescription
    publicationDate
  }
`;
