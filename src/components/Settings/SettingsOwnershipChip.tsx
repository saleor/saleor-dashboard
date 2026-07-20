import { Box, Text } from "@saleor/macaw-ui-next";
import { Radio, Store } from "lucide-react";
import { FormattedMessage } from "react-intl";

import styles from "./SettingsOwnershipChip.module.css";

export type SettingsOwnership = "shop" | "channel";

interface SettingsOwnershipChipProps {
  ownership: SettingsOwnership;
}

/**
 * Ownership pill used on every SettingsSection / SettingsLinkCard.
 * Shop and Channel share this component so padding and placement stay consistent.
 */
export const SettingsOwnershipChip = ({ ownership }: SettingsOwnershipChipProps): JSX.Element => {
  const Icon = ownership === "shop" ? Store : Radio;
  const isShop = ownership === "shop";

  return (
    <Box
      as="span"
      className={styles.chip}
      data-test-id={`settings-ownership-${ownership}`}
      backgroundColor={isShop ? "accent1Pressed" : "default2"}
      borderColor={isShop ? "accent1" : "default1"}
      borderWidth={1}
      borderStyle="solid"
      borderRadius={2}
      color="default1"
    >
      <Icon className={styles.chipIcon} size={12} strokeWidth={2} aria-hidden />
      <Text size={1} fontWeight="medium" color="default1">
        {isShop ? (
          <FormattedMessage
            id="2R4joj"
            defaultMessage="Shop"
            description="settings ownership badge — shop-scoped setting"
          />
        ) : (
          <FormattedMessage
            id="oOjtA5"
            defaultMessage="Channel"
            description="settings ownership badge — channel-scoped setting"
          />
        )}
      </Text>
    </Box>
  );
};
