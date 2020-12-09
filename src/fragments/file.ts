import gql from "graphql-tag";

export const fileFragment = gql`
  fragment FileFragment on File {
    url
    contentType
  }
`;
