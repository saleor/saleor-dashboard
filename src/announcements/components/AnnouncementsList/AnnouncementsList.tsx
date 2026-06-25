import { Box } from "@saleor/macaw-ui-next";
import { useMemo } from "react";

import { groupBySeverity } from "../../groupBySeverity";
import { type AnnouncementViewModel } from "../../types";
import { Announcement } from "../Announcement/Announcement";

interface AnnouncementsListProps {
  announcements: AnnouncementViewModel[];
}

export const AnnouncementsList = ({ announcements }: AnnouncementsListProps) => {
  const groups = useMemo(() => groupBySeverity(announcements), [announcements]);

  if (groups.length === 0) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" gap={2} width="100%">
      {groups.map(group => (
        <Box key={group.importance} display="flex" flexDirection="column" gap={2} width="100%">
          {group.announcements.map((announcement, index) => (
            <Announcement key={`${announcement.type}-${index}`} announcement={announcement} />
          ))}
        </Box>
      ))}
    </Box>
  );
};
