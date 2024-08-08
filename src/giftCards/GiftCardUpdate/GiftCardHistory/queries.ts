import { gql } from "@apollo/client";

export const giftCardEvents = gql`
  query GiftCardEvents($id: ID!, $canSeeApp: Boolean!, $canSeeUser: Boolean!) {
    giftCard(id: $id) {
      events {
        ...GiftCardEvent
        app @include(if: $canSeeApp) {
          id
          name
          brand {
            logo {
              default(size: 128)
            }
          }
        }
        user @include(if: $canSeeUser) {
          ...UserBase
          email
          avatar(size: 128) {
            url
          }
        }
      }
    }
  }
`;
