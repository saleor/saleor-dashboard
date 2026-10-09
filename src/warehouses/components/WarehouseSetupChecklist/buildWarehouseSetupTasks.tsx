import { type SetupChecklistTask } from "@dashboard/components/SetupChecklist/types";
import { messages } from "@dashboard/warehouses/messages";
import { Box, Button } from "@saleor/macaw-ui-next";
import { ArrowRight } from "lucide-react";
import { FormattedMessage } from "react-intl";

const actionLabel = (label: React.ReactNode): React.ReactNode => (
  <Box display="flex" alignItems="center" gap={1}>
    {label}
    <ArrowRight size={14} aria-hidden />
  </Box>
);

export const buildWarehouseChannelTask = ({
  title,
  inChannel,
  canManage,
  onAddChannel,
}: {
  title: string;
  inChannel: boolean;
  canManage: boolean;
  onAddChannel: () => void;
}): SetupChecklistTask => ({
  id: "channel",
  title,
  description: <FormattedMessage {...messages.channelsBanner} />,
  status: inChannel ? "completed" : canManage ? "active" : "locked",
  requirement:
    inChannel || canManage ? undefined : <FormattedMessage {...messages.setupChannelPermission} />,
  action:
    !inChannel && canManage ? (
      <Button
        variant="primary"
        type="button"
        data-test-id="warehouse-setup-add-channel"
        onClick={onAddChannel}
      >
        {actionLabel(<FormattedMessage {...messages.channelsBannerAction} />)}
      </Button>
    ) : undefined,
});

export const buildWarehouseShippingZoneTask = ({
  title,
  inChannel,
  zoneCount,
  hasUsableShippingZone,
  canManageShipping,
  onAddShippingZone,
}: {
  title: string;
  inChannel: boolean;
  zoneCount: number;
  hasUsableShippingZone: boolean;
  canManageShipping: boolean;
  onAddShippingZone?: () => void;
}): SetupChecklistTask => {
  const status = hasUsableShippingZone
    ? "completed"
    : !inChannel || !canManageShipping
      ? "locked"
      : "active";

  return {
    id: "shipping-zones",
    title,
    description: hasUsableShippingZone ? (
      // A truncated zone list can count as usable before any usable zone is loaded.
      zoneCount > 0 ? (
        <FormattedMessage {...messages.setupZoneDoneCount} values={{ count: zoneCount }} />
      ) : (
        <FormattedMessage {...messages.setupZoneDoneUncounted} />
      )
    ) : (
      <FormattedMessage {...messages.setupZoneDescription} />
    ),
    status,
    requirement:
      hasUsableShippingZone || (inChannel && canManageShipping) ? undefined : !inChannel ? (
        <FormattedMessage {...messages.setupZoneRequiresChannel} />
      ) : (
        <FormattedMessage {...messages.setupZonePermission} />
      ),
    action:
      !hasUsableShippingZone && inChannel && canManageShipping && onAddShippingZone ? (
        <Button
          variant="primary"
          type="button"
          data-test-id="warehouse-setup-add-shipping-zone"
          onClick={onAddShippingZone}
        >
          {actionLabel(<FormattedMessage {...messages.setupZoneAction} />)}
        </Button>
      ) : undefined,
  };
};
