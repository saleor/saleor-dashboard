import { gql } from "@apollo/client";

/**
 * Model (page) media gallery (Saleor 3.24+). Kept out of `queries.ts` because `Page.media`
 * does not exist on the main schema, which would fail main-schema codegen.
 */
export const modelMedia = gql`
  query ModelMedia($id: ID!) {
    page(id: $id) {
      id
      title
      media {
        ...Media
      }
    }
  }
`;
