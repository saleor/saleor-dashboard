import { gql } from "@apollo/client";

/**
 * Category media gallery (Saleor 3.24+). Kept out of `queries.ts` because `Category.media`
 * does not exist on the main schema, which would fail main-schema codegen.
 */
export const categoryMedia = gql`
  query CategoryMedia($id: ID!) {
    category(id: $id) {
      id
      name
      media {
        ...Media
      }
    }
  }
`;
