import { gql } from "@apollo/client";

export const mediaCreateMutation = gql`
  mutation MediaCreate($id: ID!, $alt: String, $image: Upload, $mediaUrl: String) {
    mediaCreate(id: $id, input: { alt: $alt, image: $image, mediaUrl: $mediaUrl }) {
      media {
        ...Media
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const mediaUpdateMutation = gql`
  mutation MediaUpdate($id: ID!, $alt: String) {
    mediaUpdate(id: $id, input: { alt: $alt }) {
      media {
        ...Media
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const mediaDeleteMutation = gql`
  mutation MediaDelete($id: ID!) {
    mediaDelete(id: $id) {
      media {
        id
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const mediaReorderMutation = gql`
  mutation MediaReorder($id: ID!, $mediaIds: [ID!]!) {
    mediaReorder(id: $id, mediaIds: $mediaIds) {
      media {
        ...Media
      }
      errors {
        field
        message
        code
      }
    }
  }
`;
