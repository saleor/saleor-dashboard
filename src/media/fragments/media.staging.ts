import { gql } from "@apollo/client";

/**
 * `Media` itself does not implement `ObjectWithMetadata` — the inline fragment picks the
 * metadata up from the concrete owner types. Selecting it here (rather than only on the media
 * detail query) keeps every cached media object complete, so appending a freshly created item
 * to an owner's gallery never leaves a partial cache entry behind.
 */
export const mediaFragment = gql`
  fragment Media on Media {
    id
    alt
    sortOrder
    url(size: 1024)
    mediaType
    oembedData
    ... on ObjectWithMetadata {
      metadata {
        key
        value
      }
      privateMetadata {
        key
        value
      }
    }
  }
`;
