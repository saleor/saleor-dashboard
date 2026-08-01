import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "./ChannelSettingsCard.module.css";

interface ChannelSettingsCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  /** Drop content padding so list rows can use full-bleed dividers. */
  contentFlush?: boolean;
  "data-test-id"?: string;
}

export const ChannelSettingsCard = ({
  title,
  subtitle,
  children,
  contentFlush = false,
  "data-test-id": dataTestId,
}: ChannelSettingsCardProps) => (
  <Box className={styles.card} data-test-id={dataTestId}>
    <Box className={styles.header}>
      <Text size={5} fontWeight="bold" as="h2">
        {title}
      </Text>
      {subtitle ? (
        <Text size={3} color="default2">
          {subtitle}
        </Text>
      ) : null}
    </Box>
    <Box className={contentFlush ? styles.contentFlush : styles.content}>{children}</Box>
  </Box>
);
