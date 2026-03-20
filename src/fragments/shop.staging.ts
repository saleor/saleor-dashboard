import { gql } from "@apollo/client";

export const shopFragment = gql`
  fragment ShopStaging on Shop {
    ...Shop
    passwordLoginMode
  }
`;
