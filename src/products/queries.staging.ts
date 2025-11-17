import { gql } from "@apollo/client";

export const productPoc323 = gql`
  query ProductVariants {
    productVariants(channel: "default-channel", first: 1) {
      edges {
        node {
          id
          breakingField
        }
      }
    }
  }
`;
