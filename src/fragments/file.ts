import { gql } from "@apollo/client";

export const fileFragment = gql`
  fragment FileFragment on File {
    url
    contentType
  }
`;
