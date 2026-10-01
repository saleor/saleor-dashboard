import { Box, Text } from "@saleor/macaw-ui-next";
import { ChevronRight } from "lucide-react";
import { type ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "./SettingsLinkRow.module.css";

interface SettingsLinkRowProps {
  title: ReactNode;
  description?: ReactNode;
  to: string;
  icon?: ReactNode;
  badge?: ReactNode;
  id?: string;
  "data-test-id"?: string;
}

/**
 * Navigational row inside a SettingsSection. Same density as SettingsToggleRow.
 */
export const SettingsLinkRow = ({
  title,
  description,
  to,
  icon,
  badge,
  id,
  "data-test-id": dataTestId,
}: SettingsLinkRowProps): React.ReactNode => {
  return (
    <Link to={to} className={styles.link} data-test-id={dataTestId} id={id}>
      <Box
        className={styles.row}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={4}
        paddingX={6}
        paddingY={4}
      >
        {icon ? (
          <Box className={styles.icon} flexShrink="0" aria-hidden>
            {icon}
          </Box>
        ) : null}
        <Box display="flex" flexDirection="column" gap={1} __minWidth={0} flexGrow="1">
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Text size={3} fontWeight="medium" color="default1">
              {title}
            </Text>
            {badge}
          </Box>
          {description ? (
            <Text size={2} color="default2" className={styles.description}>
              {description}
            </Text>
          ) : null}
        </Box>
        <Box className={styles.chevron} flexShrink="0" color="default2">
          <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
        </Box>
      </Box>
    </Link>
  );
};
