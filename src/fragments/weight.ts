import { gql } from "@apollo/client";

export const weightFragment = gql`
  fragment Weight on Weight {
    unit
    value
  }
`;
