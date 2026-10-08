import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import ActionDialog from "@dashboard/components/ActionDialog/ActionDialog";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { WarehouseChannelsAssignDialog } from "@dashboard/warehouses/components/WarehouseChannelsCard/WarehouseChannelsAssignDialog";
import { WarehouseChannelsCard } from "@dashboard/warehouses/components/WarehouseChannelsCard/WarehouseChannelsCard";
import { WarehouseSetupChecklist } from "@dashboard/warehouses/components/WarehouseSetupChecklist/WarehouseSetupChecklist";
import { messages } from "@dashboard/warehouses/messages";
import {
  warehouseSharesShippingZone,
  type ZoneChannelMembership,
  zonesUnlinkedByRemovingWarehouseChannel,
} from "@dashboard/warehouses/zonesUnlinkedByChannelRemoval";
import { Text } from "@saleor/macaw-ui-next";
import { type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useWarehouseChannelMembership } from "./useWarehouseChannelMembership";
import { isWarehouseSetupChecklistVisible } from "./useWarehouseSetupChecklistDismiss";

export const useWarehouseDetailsChannels = ({
  warehouseId,
  legacyStockAvailability,
  zones,
  zonesTruncated,
  checklistEmphasized,
  onDismissChecklist,
  onOpenShippingZones,
}: {
  warehouseId: string | undefined;
  legacyStockAvailability: boolean | undefined;
  zones: ZoneChannelMembership[];
  zonesTruncated: boolean;
  checklistEmphasized: boolean;
  onDismissChecklist?: (channelCount: number) => void;
  onOpenShippingZones?: () => void;
}): {
  card: ReactNode;
  banner: ReactNode | null;
  checklistVisible: boolean;
  subtitle: ReactNode | null;
  status: "loading" | "error" | "ready";
  warehouseChannelIds: string[];
  channelNames: string[];
} => {
  const intl = useIntl();
  const notify = useNotifier();
  const permissions = useUserPermissions();
  const canManage = hasPermissions(permissions ?? [], [PermissionEnum.MANAGE_CHANNELS]);
  const canManageShipping = hasPermissions(permissions ?? [], [PermissionEnum.MANAGE_SHIPPING]);
  const membership = useWarehouseChannelMembership(warehouseId);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{
    channelId: string;
    channelName: string;
    zoneNames: string[];
    truncated: boolean;
  } | null>(null);
  const assignedIds = new Set(membership.channels.map(channel => channel.id));
  const availableChannels = membership.allChannels.filter(channel => !assignedIds.has(channel.id));

  const removeChannel = async (channelId: string): Promise<void> => {
    const channelName =
      membership.channels.find(channel => channel.id === channelId)?.name ?? channelId;
    const result = await membership.removeChannel(channelId);

    notify({
      status: result.failed === 0 ? "success" : "error",
      text: intl.formatMessage(
        result.failed === 0 ? messages.channelsRemoved : messages.channelsRemoveFailed,
        { channel: channelName },
      ),
    });
  };

  const requestRemove = (channelId: string): void => {
    const channelName =
      membership.channels.find(channel => channel.id === channelId)?.name ?? channelId;
    // Saleor drops the zone link in either stock mode, and the zones card shows it in both.
    const unlinked = zonesUnlinkedByRemovingWarehouseChannel({
      removedChannelId: channelId,
      remainingChannelIds: membership.channels
        .filter(channel => channel.id !== channelId)
        .map(channel => channel.id),
      zones,
    });

    if (unlinked.length > 0) {
      setPendingRemove({
        channelId,
        channelName,
        zoneNames: unlinked.map(zone => zone.name),
        truncated: zonesTruncated,
      });

      return;
    }

    void removeChannel(channelId);
  };

  const subtitle =
    membership.status === "ready" ? (
      <Text
        color="default2"
        fontSize={2}
        __whiteSpace="nowrap"
        data-test-id="warehouse-channel-count"
      >
        {membership.channels.length === 0 ? (
          <FormattedMessage {...messages.channelsNotInChannel} />
        ) : (
          <FormattedMessage
            {...messages.channelsInCount}
            values={{ count: membership.channels.length }}
          />
        )}
      </Text>
    ) : null;

  const warehouseChannelIds = membership.channels.map(channel => channel.id);
  const inChannel = warehouseChannelIds.length > 0;
  // Wait for stock mode so a direct-mode shop does not flash a zone step, and a
  // legacy shop does not look ready before we know a zone is required.
  const stockModeReady = legacyStockAvailability !== undefined;
  const shippingZoneRequired = legacyStockAvailability === true;
  const usableZoneCount = zones.filter(zone =>
    zone.channelIds.some(channelId => warehouseChannelIds.includes(channelId)),
  ).length;
  // Truncated lists match the warehouse list: do not claim “no zone”.
  const hasShippingZone =
    zonesTruncated || warehouseSharesShippingZone({ zones, warehouseChannelIds });
  const coreReady = inChannel && (!shippingZoneRequired || hasShippingZone);
  const checklistVisible = isWarehouseSetupChecklistVisible({
    membershipReady: membership.status === "ready" && stockModeReady,
    inChannel,
    emphasized: checklistEmphasized,
    shippingZoneRequired,
    hasShippingZone,
  });

  return {
    status: membership.status,
    warehouseChannelIds,
    channelNames: membership.channels.map(channel => channel.name),
    subtitle,
    checklistVisible,
    banner: checklistVisible ? (
      <WarehouseSetupChecklist
        canManage={canManage}
        canManageShipping={canManageShipping}
        inChannel={inChannel}
        showShippingZones={shippingZoneRequired}
        zoneCount={usableZoneCount}
        hasUsableShippingZone={hasShippingZone}
        onAddChannel={() => setAssignOpen(true)}
        onAddShippingZone={onOpenShippingZones}
        onDismiss={
          onDismissChecklist && coreReady
            ? (): void => onDismissChecklist(membership.channels.length)
            : undefined
        }
      />
    ) : null,
    card: (
      <>
        <WarehouseChannelsCard
          status={membership.status}
          channels={membership.channels}
          availableChannels={availableChannels}
          canManage={canManage}
          disabled={assigning || membership.removingId !== undefined}
          onRetry={membership.retry}
          onRemove={requestRemove}
          onRequestAssign={() => setAssignOpen(true)}
        />
        {assignOpen ? (
          <WarehouseChannelsAssignDialog
            channels={availableChannels}
            open
            confirming={assigning}
            onClose={() => setAssignOpen(false)}
            onConfirm={channelIds => {
              setAssigning(true);
              void membership
                .assignChannels(channelIds)
                .then(result => {
                  if (result.failed === 0) {
                    notify({
                      status: "success",
                      text: intl.formatMessage(messages.channelsAssigned, { count: result.ok }),
                    });

                    return;
                  }

                  notify({
                    status: "error",
                    text: intl.formatMessage(
                      result.ok === 0
                        ? messages.channelsAssignFailed
                        : messages.channelsAssignPartial,
                      { ok: result.ok, failed: result.failed },
                    ),
                  });
                })
                .catch(() => {
                  notify({
                    status: "error",
                    text: intl.formatMessage(messages.channelsAssignFailed),
                  });
                })
                .finally(() => {
                  setAssigning(false);
                  setAssignOpen(false);
                });
            }}
          />
        ) : null}
        <ActionDialog
          open={pendingRemove !== null}
          title={intl.formatMessage(messages.channelsRemoveTitle, {
            channel: pendingRemove?.channelName ?? "",
          })}
          confirmButtonState={membership.removingId ? "loading" : "default"}
          variant="delete"
          onClose={() => setPendingRemove(null)}
          onConfirm={() => {
            if (!pendingRemove) {
              return;
            }

            const { channelId } = pendingRemove;

            setPendingRemove(null);
            void removeChannel(channelId);
          }}
        >
          <FormattedMessage
            {...messages.channelsRemoveUnlink}
            values={{
              zones: intl.formatList(pendingRemove?.zoneNames ?? [], { type: "conjunction" }),
            }}
          />
          {pendingRemove?.truncated ? (
            <>
              {" "}
              <FormattedMessage {...messages.channelsRemoveUnlinkMore} />
            </>
          ) : null}
        </ActionDialog>
      </>
    ),
  };
};
