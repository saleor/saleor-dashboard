import gql from "graphql-tag";

export const weightFragment = gql`
  fragment WeightFragment on Weight {
    unit
    value
  }
`;
