import gql from "graphql-tag";

export const serviceFragment = gql`
  fragment ServiceFragment on ServiceAccount {
    id
    name
    isActive
  }
`;

export const serviceDetailsFragment = gql`
  ${serviceFragment}
  fragment ServiceDetailsFragment on ServiceAccount {
    ...ServiceFragment
    permissions {
      code
      name
    }
    tokens {
      id
      name
      authToken
    }
  }
`;
