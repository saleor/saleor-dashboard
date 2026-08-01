import { type ChannelShippingZones } from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import DeletableItem from "@dashboard/components/DeletableItem";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { shippingZoneUrl } from "@dashboard/shipping/urls";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Truck } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import styles from "./ChannelDeliveryCard.module.css";
import { messages } from "./messages";

interface ChannelDeliveryCardProps {
  shippingZones: ChannelShippingZones;
  removeShippingZone: (id: string) => void;
  disabled: boolean;
  /** Total shipping zones in the shop (for assign vs create). */
  availableShippingZonesCount: number;
  canCreateShipping: boolean;
  onAssignShipping?: () => void;
  onCreateShipping?: () => void;
}

export const ChannelDeliveryCard = ({
  shippingZones,
  removeShippingZone,
  disabled,
  availableShippingZonesCount,
  canCreateShipping,
  onAssignShipping,
  onCreateShipping,
}: ChannelDeliveryCardProps): ReactNode => {
  const intl = useIntl();
  const zones = shippingZones ?? [];
  const hasZones = zones.length > 0;
  const hasUnassigned = availableShippingZonesCount > zones.length;

  const assignAction = (() => {
    if (disabled) {
      return null;
    }

    if (hasUnassigned && onAssignShipping && canCreateShipping && onCreateShipping) {
      return (
        <ButtonGroupWithDropdown
          variant="secondary"
          onClick={onAssignShipping}
          testId="delivery-assign-shipping"
          options={[
            {
              label: intl.formatMessage(messages.createShipping),
              testId: "delivery-create-shipping",
              onSelect: onCreateShipping,
            },
          ]}
        >
          <FormattedMessage {...messages.assign} />
        </ButtonGroupWithDropdown>
      );
    }

    if (hasUnassigned && onAssignShipping) {
      return (
        <Button
          variant="secondary"
          data-test-id="delivery-assign-shipping"
          onClick={onAssignShipping}
        >
          <FormattedMessage {...messages.assign} />
        </Button>
      );
    }

    if (canCreateShipping && onCreateShipping) {
      return (
        <Button
          variant="secondary"
          data-test-id="delivery-create-shipping"
          onClick={onCreateShipping}
        >
          <FormattedMessage {...messages.createShipping} />
        </Button>
      );
    }

    return null;
  })();

  return (
    <Box className={styles.card} data-test-id="channel-delivery-card">
      <Box className={styles.header}>
        <Text size={5} fontWeight="bold" as="h2">
          <FormattedMessage {...messages.title} />
        </Text>
        <Text size={2} color="default2">
          {hasZones ? (
            <FormattedMessage {...messages.assignedCount} values={{ count: zones.length }} />
          ) : (
            <FormattedMessage {...messages.requiredToSell} />
          )}
        </Text>
      </Box>

      <Box className={styles.intro}>
        <Text size={3} color="default2">
          <FormattedMessage {...messages.description} />
        </Text>
      </Box>

      {!hasZones ? (
        <Box className={styles.emptyState}>
          <Box className={styles.emptyLeading}>
            <Box className={styles.emptyIcon} aria-hidden>
              <Truck size={iconSize.small} strokeWidth={iconStrokeWidth} />
            </Box>
            <Box className={styles.emptyCopy}>
              <Text size={3} fontWeight="medium">
                <FormattedMessage {...messages.emptyTitle} />
              </Text>
              <Text size={2} color="default2">
                <FormattedMessage {...messages.emptyDescription} />
              </Text>
            </Box>
          </Box>
          {assignAction ? <Box className={styles.emptyAction}>{assignAction}</Box> : null}
        </Box>
      ) : (
        <>
          <div className={styles.list}>
            {zones.map(zone => (
              <div key={zone.id} className={styles.row} data-test-id="channel-delivery-zone-row">
                <RouterLink
                  to={shippingZoneUrl(zone.id)}
                  className={styles.rowName}
                  data-test-id={`${zone.id}-link`}
                >
                  <Text size={3} fontWeight="medium">
                    {zone.name}
                  </Text>
                </RouterLink>
                <DeletableItem id={zone.id} onDelete={removeShippingZone} />
              </div>
            ))}
          </div>
          {assignAction ? (
            <Box className={styles.listFooter}>
              <Box className={styles.listFooterAction}>{assignAction}</Box>
            </Box>
          ) : null}
        </>
      )}
    </Box>
  );
};
