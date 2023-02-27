import { gql } from "@apollo/client";

export const fileFragment = gql`
  fragment File on File {
    url
    contentType
  }
`;
