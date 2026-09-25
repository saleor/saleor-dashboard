import { gql } from "@apollo/client";

/**
 * Channel-listed variant ids for one product. `Product.variants` is the only
 * staff query that filters by the variant's channel listing. Fetched lazily,
 * and only for products whose embedded `productVariants` page is truncated.
 */
export const orderProductChannelVariantIds = gql`
  query OrderProductChannelVariantIds($id: ID!, $channel: String!) {
    product(id: $id, channel: $channel) {
      id
      variants {
        id
      }
    }
  }
`;

/**
 * Variant details for a known set of channel-listed ids. The caller slices ids
 * to `first`, so each page is variants that can actually be added in this channel.
 */
export const orderProductVariantsForAdd = gql`
  query OrderProductVariantsForAdd(
    $ids: [ID!]!
    $first: Int!
    $channel: String!
    $address: AddressInput
  ) {
    productVariants(first: $first, channel: $channel, where: { ids: $ids }) {
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
`;
