import { gql } from "@apollo/client";

export const weightFragment = gql`
  fragment WeightFragment on Weight {
    unit
    value
  }
`;
