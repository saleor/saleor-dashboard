import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "./SettingsPageContent.module.css";

interface SettingsPageContentProps {
  /** Optional section title in the left rail (Site Settings–style). */
  title?: ReactNode;
  /** Explainer in the left rail; forms go in `children` on the right. */
  description?: ReactNode;
  children: ReactNode;
}

/**
 * Standard Settings hub chrome: left rail (title + description) + right forms column.
 * Mirrors Site Settings (`1fr 3fr`) so hubs fill the main pane without a narrow max-width column.
 */
export const SettingsPageContent = ({
  title,
  description,
  children,
}: SettingsPageContentProps): JSX.Element => {
  const hasAside = title != null || description != null;

  return (
    <Box className={styles.root} paddingX={6} paddingTop={6} paddingBottom={10} width="100%">
      {hasAside ? (
        <Box className={styles.aside} display="flex" flexDirection="column" gap={2}>
          {title ? (
            <Text size={3} fontWeight="bold" as="h2">
              {title}
            </Text>
          ) : null}
          {description ? (
            <Text size={3} color="default2" className={styles.description}>
              {description}
            </Text>
          ) : null}
        </Box>
      ) : null}
      <Box
        className={styles.main}
        display="flex"
        flexDirection="column"
        gap={5}
        width="100%"
        // When there is no aside, still span full width of the single-column grid.
        __gridColumn={hasAside ? undefined : "1 / -1"}
      >
        {children}
      </Box>
    </Box>
  );
};
