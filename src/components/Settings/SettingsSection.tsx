import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { type SettingsOwnership, SettingsOwnershipChip } from "./SettingsOwnershipChip";
import styles from "./SettingsSection.module.css";

interface SettingsSectionProps {
  title: ReactNode;
  description?: ReactNode;
  ownership?: SettingsOwnership;
  children: ReactNode;
  id?: string;
  "data-test-id"?: string;
}

/**
 * Foundational Settings card: title + ownership chip + description, then rows.
 * Reuse across the Settings revamp for consistent IA and density.
 */
export const SettingsSection = ({
  title,
  description,
  ownership,
  children,
  id,
  "data-test-id": dataTestId,
}: SettingsSectionProps): JSX.Element => {
  return (
    <Box
      as="section"
      id={id}
      className={styles.section}
      data-test-id={dataTestId}
      backgroundColor="default1"
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      borderRadius={3}
      overflow="hidden"
    >
      <Box
        className={styles.header}
        paddingX={6}
        paddingTop={5}
        paddingBottom={4}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Text size={5} fontWeight="bold" as="h2">
            {title}
          </Text>
          {ownership ? <SettingsOwnershipChip ownership={ownership} /> : null}
        </Box>
        {description ? (
          <Text size={2} color="default2" className={styles.description}>
            {description}
          </Text>
        ) : null}
      </Box>
      <Box className={styles.body} display="flex" flexDirection="column">
        {children}
      </Box>
    </Box>
  );
};
