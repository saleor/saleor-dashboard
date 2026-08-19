import { Box, Text } from "@saleor/macaw-ui-next";
import { ChevronRight } from "lucide-react";
import { type ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "./SettingsLinkCard.module.css";
import { type SettingsOwnership, SettingsOwnershipChip } from "./SettingsOwnershipChip";

interface SettingsLinkCardProps {
  title: ReactNode;
  description: ReactNode;
  to: string;
  ownership?: SettingsOwnership;
  id?: string;
  "data-test-id"?: string;
}

/**
 * Navigational settings card for related hubs (e.g. Returns & refunds).
 * Keeps Settings pages as control panels without embedding every form.
 */
export const SettingsLinkCard = ({
  title,
  description,
  to,
  ownership,
  id,
  "data-test-id": dataTestId,
}: SettingsLinkCardProps): JSX.Element => {
  return (
    <Link to={to} className={styles.link} data-test-id={dataTestId} id={id}>
      <Box
        className={styles.card}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={4}
        paddingX={6}
        paddingY={5}
        backgroundColor="default1"
        borderWidth={1}
        borderStyle="solid"
        borderColor="default1"
        borderRadius={3}
      >
        <Box display="flex" flexDirection="column" gap={2} __minWidth={0} flexGrow="1">
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Text size={5} fontWeight="bold" color="default1">
              {title}
            </Text>
            {ownership ? <SettingsOwnershipChip ownership={ownership} /> : null}
          </Box>
          <Text size={2} color="default2" className={styles.description}>
            {description}
          </Text>
        </Box>
        <Box className={styles.chevron} flexShrink="0" color="default2">
          <ChevronRight size={20} strokeWidth={1.75} aria-hidden />
        </Box>
      </Box>
    </Link>
  );
};
