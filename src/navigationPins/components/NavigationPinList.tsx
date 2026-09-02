import DeletableItem from "@dashboard/components/DeletableItem/DeletableItem";
import { ModelTypeIcon } from "@dashboard/components/ModelTypeIcon/ModelTypeIcon";
import { Placeholder } from "@dashboard/components/Placeholder/Placeholder";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import { useNavigationPinListItems } from "../hooks/useNavigationPinListItems";
import { navigationPinMessages as messages } from "../messages";
import { findNavigationPinByItemId } from "../pinListItem";
import { type NavigationPin } from "../types";
import styles from "./NavigationPinList.module.css";

interface NavigationPinListProps {
  pins: NavigationPin[];
  emptyMessage: string;
  disabled?: boolean;
  onRemove: (pin: NavigationPin) => void;
}

/**
 * Management list for organization pins (modal). Deleted types stay so a slot can be freed.
 */
export const NavigationPinList = ({
  pins,
  emptyMessage,
  disabled,
  onRemove,
}: NavigationPinListProps): JSX.Element => {
  const intl = useIntl();
  const { items, hasResolved } = useNavigationPinListItems(pins);

  if (pins.length === 0) {
    return <Placeholder>{emptyMessage}</Placeholder>;
  }

  if (!hasResolved) {
    return (
      <Box className={styles.list} aria-busy="true" data-test-id="navigation-pin-list-loading">
        <Box className={styles.row}>
          <Skeleton __height="1.25rem" __width="40%" />
        </Box>
        <Box className={styles.row}>
          <Skeleton __height="1.25rem" __width="55%" />
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.list} data-test-id="navigation-pin-list">
      {items.map(item => (
        <Box key={item.id} className={styles.row} data-test-id="navigation-pin-row">
          <ModelTypeIcon icon={item.icon} />
          <Box className={styles.rowCopy}>
            {item.href ? (
              <RouterLink to={item.href} className={styles.rowName}>
                <Text size={3} fontWeight="medium">
                  {item.name}
                </Text>
              </RouterLink>
            ) : (
              <Text size={3} fontWeight="medium">
                {item.name}
              </Text>
            )}
            {item.description ? (
              <Text size={2} color="default2">
                {item.description}
              </Text>
            ) : null}
          </Box>
          <Box className={styles.rowDelete}>
            <DeletableItem
              id={item.id}
              disabled={disabled}
              label={intl.formatMessage(messages.unpinFromNav)}
              onDelete={itemId => {
                const pin = findNavigationPinByItemId(pins, itemId);

                if (pin) {
                  onRemove(pin);
                }
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
