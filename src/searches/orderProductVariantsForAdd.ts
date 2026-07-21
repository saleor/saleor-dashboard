import { gql } from "@apollo/client";

/**
 * Next page of variants for a single product in the order add-line dialog.
 * Channel is passed on `product` so pricing resolves in that channel context.
 */
export const orderProductVariantsForAdd = gql`
  query OrderProductVariantsForAdd(
    $id: ID!
    $first: Int!
    $after: String
    $channel: String!
    $address: AddressInput
  ) {
    product(id: $id, channel: $channel) {
      id
      productVariants(first: $first, after: $after) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            name
            sku
            pricing(address: $address) {
              priceUndiscounted {
                gross {
                  ...Money
                }
              }
              price {
                gross {
                  ...Money
                }
              }
              onSale
            }
          }
        }
      }
    }
  }
`;
