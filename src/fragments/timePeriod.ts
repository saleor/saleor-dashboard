import gql from "graphql-tag";

export const fragmentTimePeriod = gql`
  fragment TimePeriod on TimePeriod {
    amount
    type
  }
`;
