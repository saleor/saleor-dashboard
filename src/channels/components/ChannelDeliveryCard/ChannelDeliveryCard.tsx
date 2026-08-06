import { type ChannelShippingZones } from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { AssignListCard } from "@dashboard/components/AssignListCard/AssignListCard";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { shippingZoneUrl } from "@dashboard/shipping/urls";
import { Box, Button } from "@saleor/macaw-ui-next";
import { Truck } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
    // Stay visible while saving; only disable so the layout doesn't jump.
    if (hasUnassigned && onAssignShipping && canCreateShipping && onCreateShipping) {
      return (
        <ButtonGroupWithDropdown
          variant="secondary"
          onClick={onAssignShipping}
          testId="delivery-assign-shipping"
          disabled={disabled}
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
          type="button"
          data-test-id="delivery-assign-shipping"
          onClick={onAssignShipping}
          disabled={disabled}
        >
          <FormattedMessage {...messages.assign} />
        </Button>
      );
    }

    if (canCreateShipping && onCreateShipping) {
      return (
        <Button
          variant="secondary"
          type="button"
          data-test-id="delivery-create-shipping"
          onClick={onCreateShipping}
          disabled={disabled}
        >
          <FormattedMessage {...messages.createShipping} />
        </Button>
      );
    }

    return null;
  })();

  return (
    <AssignListCard
      data-test-id="channel-delivery-card"
      title={<FormattedMessage {...messages.title} />}
      subtitle={
        hasZones ? (
          <FormattedMessage {...messages.assignedCount} values={{ count: zones.length }} />
        ) : (
          <FormattedMessage {...messages.requiredToSell} />
        )
      }
      intro={<FormattedMessage {...messages.description} />}
      items={zones.map(zone => ({
        id: zone.id,
        name: zone.name,
        href: shippingZoneUrl(zone.id),
      }))}
      emptyState={{
        icon: <Truck size={iconSize.small} strokeWidth={iconStrokeWidth} />,
        title: <FormattedMessage {...messages.emptyTitle} />,
        description: <FormattedMessage {...messages.emptyDescription} />,
      }}
      footerAction={assignAction ? <Box>{assignAction}</Box> : undefined}
      onRemoveItem={removeShippingZone}
      disabled={disabled}
      rowTestId="channel-delivery-zone-row"
    />
  );
};
