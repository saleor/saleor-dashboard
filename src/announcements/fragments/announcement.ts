import { gql } from "@apollo/client";

export const announcementFragment = gql`
  fragment Announcement on Announcement {
    title
    messageHtml
    importance
    type
    createdAt
    updatedAt
    extra
  }
`;
