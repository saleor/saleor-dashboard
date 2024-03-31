import { gql } from "@apollo/client";

export const pageCreate = gql`
  mutation PageCreate($input: PageCreateInput!) {
    pageCreate(input: $input) {
      errors {
        ...PageErrorWithAttributes
      }
      page {
        id
      }
    }
  }
`;

export const pageMediaCreate = gql`
  mutation PageMediaCreate(
    $page: ID!
    $image: Upload
    $alt: String
    $mediaUrl: String
  ) {
    pageMediaCreate(
      input: { alt: $alt, image: $image, page: $page, mediaUrl: $mediaUrl }
    ) {
      errors {
        ...PageError
      }
      page {
        id
        media {
          ...PageMedia
        }
      }
    }
  }
`;

export const pageMediaDelete = gql`
  mutation PageMediaDelete($id: ID!) {
    pageMediaDelete(id: $id) {
      errors {
        ...PageError
      }
      page {
        id
        media {
          id
        }
      }
    }
  }
`;

export const pageMediaUpdate = gql`
  mutation PageMediaUpdate($id: ID!, $alt: String!) {
    pageMediaUpdate(id: $id, input: { alt: $alt }) {
      errors {
        ...PageError
      }
      page {
        id
        media {
          ...PageMedia
        }
      }
    }
  }
`;

export const pageUpdate = gql`
  mutation PageUpdate(
    $id: ID!
    $input: PageInput!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    pageUpdate(id: $id, input: $input) {
      errors {
        ...PageErrorWithAttributes
      }
      page {
        ...PageDetails
      }
    }
  }
`;

export const pageRemove = gql`
  mutation PageRemove($id: ID!) {
    pageDelete(id: $id) {
      errors {
        ...PageError
      }
    }
  }
`;

export const pageBulkPublish = gql`
  mutation PageBulkPublish($ids: [ID!]!, $isPublished: Boolean!) {
    pageBulkPublish(ids: $ids, isPublished: $isPublished) {
      errors {
        ...PageBulkPublishErrorFragment
      }
    }
  }
`;

export const pageBulkRemove = gql`
  mutation PageBulkRemove($ids: [ID!]!) {
    pageBulkDelete(ids: $ids) {
      errors {
        ...PageBulkRemoveErrorFragment
      }
    }
  }
`;
