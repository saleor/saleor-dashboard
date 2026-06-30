import { Box, Text } from "@saleor/macaw-ui-next";
import DOMPurify from "dompurify";
import { useMemo } from "react";

import { getSeverityStyle } from "../../severityStyles";
import { type AnnouncementViewModel } from "../../types";
import styles from "./Announcement.module.css";

interface AnnouncementProps {
  announcement: AnnouncementViewModel;
}

export const Announcement = ({ announcement }: AnnouncementProps) => {
  const sanitizedMessage = useMemo(
    () => DOMPurify.sanitize(announcement.messageHtml),
    [announcement.messageHtml],
  );

  const severityStyle = getSeverityStyle(announcement.importance);

  return (
    <Box
      width="100%"
      paddingX={3}
      paddingY={1.5}
      borderRadius={2}
      borderWidth={1}
      borderStyle="solid"
      borderColor={severityStyle.borderColor}
      backgroundColor={severityStyle.backgroundColor}
      display="flex"
      flexWrap="wrap"
      alignItems="baseline"
      gap={2}
    >
      <Text size={3} fontWeight="bold" color={severityStyle.titleColor} whiteSpace="nowrap">
        {announcement.title}
      </Text>
      {/* messageHtml is server-provided HTML, sanitized above with DOMPurify before rendering. */}
      <Text as="span" size={3} color="default1">
        <span className={styles.message} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </Text>
    </Box>
  );
};
