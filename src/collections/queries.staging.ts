import { gql } from "@apollo/client";

/**
 * Collection media gallery (Saleor 3.24+). Kept out of `queries.ts` because `Collection.media`
 * does not exist on the main schema, which would fail main-schema codegen.
 */
export const collectionMedia = gql`
  query CollectionMedia($id: ID!) {
    collection(id: $id) {
      id
      name
      media {
        ...Media
      }
    }
  }
`;
