import { gql } from "@apollo/client";

export const announcements = gql`
  query Announcements {
    shop {
      announcements {
        ...Announcement
      }
    }
  }
`;
