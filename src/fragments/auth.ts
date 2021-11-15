import gql from "graphql-tag";

export const fragmentUser = gql`
  fragment User on User {
    id
    email
    firstName
    lastName
    isStaff
    userPermissions {
      code
      name
    }
    avatar {
      url
    }
  }
`;

export const fragmentUserBase = gql`
  fragment UserBase on User {
    id
    firstName
    lastName
  }
`;
