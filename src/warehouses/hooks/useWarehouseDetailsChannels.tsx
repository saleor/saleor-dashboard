import { useApolloClient } from "@apollo/client";
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { channelUrl } from "@dashboard/channels/urls";
import ActionDialog from "@dashboard/components/ActionDialog/ActionDialog";
import { AssignListAllDialog } from "@dashboard/components/AssignListCard/AssignListAllDialog";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { ChannelRemoveUnlinkMessage } from "@dashboard/warehouses/components/WarehouseChannelsCard/ChannelRemoveUnlinkMessage";
import { WarehouseChannelsAssignDialog } from "@dashboard/warehouses/components/WarehouseChannelsCard/WarehouseChannelsAssignDialog";
import { WarehouseChannelsCard } from "@dashboard/warehouses/components/WarehouseChannelsCard/WarehouseChannelsCard";
import { WarehouseSetupChecklist } from "@dashboard/warehouses/components/WarehouseSetupChecklist/WarehouseSetupChecklist";
import { checkChannelRemoval } from "@dashboard/warehouses/fetchWarehouseZoneMemberships";
import { messages } from "@dashboard/warehouses/messages";
import { isWarehouseSetupChecklistVisible } from "@dashboard/warehouses/warehouseSetupChecklistVisibility";
import {
  isZoneOutsideChannels,
  warehouseSharesShippingZone,
  type ZoneChannelMembership,
} from "@dashboard/warehouses/zonesUnlinkedByChannelRemoval";
import { Text } from "@saleor/macaw-ui-next";
import { Globe } from "lucide-react";
import { type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useWarehouseChannelMembership } from "./useWarehouseChannelMembership";

export const useWarehouseDetailsChannels = ({
  warehouseId,
  legacyStockAvailability,
  zones,
  zonesTruncated,
  checklistEmphasized,
  onDismissChecklist,
  onOpenShippingZones,
  onChannelRemoved,
}: {
  warehouseId: string | undefined;
  legacyStockAvailability: boolean | undefined;
  zones: ZoneChannelMembership[];
  zonesTruncated: boolean;
  checklistEmphasized: boolean;
  onDismissChecklist?: () => void;
  onOpenShippingZones?: () => void;
  /** Reload the warehouse: Saleor drops zone links that no longer share a channel. */
  onChannelRemoved?: () => Promise<void>;
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
  const client = useApolloClient();
  const membership = useWarehouseChannelMembership(warehouseId);
  const [assignOpen, setAssignOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{
    channelId: string;
    channelName: string;
    /** Null when the zone check failed. */
    zoneNames: string[] | null;
  } | null>(null);
  /** Channel whose zone links are being checked before removal. */
  const [checkingId, setCheckingId] = useState<string | undefined>();
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

    if (result.ok > 0 && onChannelRemoved) {
      try {
        await onChannelRemoved();
      } catch {
        // The removal landed; the zones card stays stale until the page reloads.
      }
    }
  };

  const requestRemove = async (channelId: string): Promise<void> => {
    if (!warehouseId) {
      return;
    }

    const channelName =
      membership.channels.find(channel => channel.id === channelId)?.name ?? channelId;

    setCheckingId(channelId);

    // Saleor drops the zone link in either stock mode, so read every linked zone fresh:
    // the page only loads the first 100, and links may have changed since it loaded.
    const confirmation = await checkChannelRemoval({
      client,
      warehouseId,
      removedChannelId: channelId,
      remainingChannelIds: membership.channels
        .filter(channel => channel.id !== channelId)
        .map(channel => channel.id),
    });

    setCheckingId(undefined);

    if (confirmation) {
      setPendingRemove({ channelId, channelName, zoneNames: confirmation.zoneNames });

      return;
    }

    await removeChannel(channelId);
  };
  const channelsBusy =
    membership.assigning || membership.removingId !== undefined || checkingId !== undefined;

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
  const warehouseChannelIdSet = new Set(warehouseChannelIds);
  const usableZoneCount = zones.filter(
    zone => !isZoneOutsideChannels(zone, warehouseChannelIdSet),
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
        onDismiss={onDismissChecklist && coreReady ? onDismissChecklist : undefined}
      />
    ) : null,
    card: (
      <>
        <WarehouseChannelsCard
          status={membership.status}
          channels={membership.channels}
          availableChannels={availableChannels}
          canManage={canManage}
          disabled={channelsBusy}
          onRetry={membership.retry}
          onRemove={channelId => void requestRemove(channelId)}
          onRequestAssign={() => setAssignOpen(true)}
          onShowAll={() => setAllOpen(true)}
        />
        <AssignListAllDialog
          open={allOpen}
          title={<FormattedMessage {...messages.channelsTitle} />}
          items={membership.channels.map(channel => ({
            id: channel.id,
            name: channel.name,
            href: channelUrl(channel.id),
            icon: <Globe size={iconSize.small} strokeWidth={iconStrokeWidth} />,
          }))}
          loading={membership.status === "loading"}
          searchLabel={intl.formatMessage(messages.channelsSearch)}
          searchPlaceholder={intl.formatMessage(messages.channelsSearch)}
          noMatchMessage={<FormattedMessage {...messages.channelsNoMatch} />}
          removable={canManage}
          removeLabel={channel =>
            intl.formatMessage(messages.channelsRemove, { channel: channel.name })
          }
          disabled={channelsBusy}
          onRemoveItem={channelId => void requestRemove(channelId)}
          onClose={() => setAllOpen(false)}
          data-test-id="warehouse-channels-all"
        />
        {assignOpen ? (
          <WarehouseChannelsAssignDialog
            channels={availableChannels}
            open
            confirming={membership.assigning}
            onClose={() => setAssignOpen(false)}
            onConfirm={channelIds => {
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
                      { ok: result.ok, failed: result.failed, count: result.failed },
                    ),
                  });
                })
                .catch(() => {
                  notify({
                    status: "error",
                    text: intl.formatMessage(messages.channelsAssignFailed, {
                      count: channelIds.length,
                    }),
                  });
                })
                .finally(() => {
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
          {pendingRemove ? (
            <ChannelRemoveUnlinkMessage zoneNames={pendingRemove.zoneNames} />
          ) : null}
        </ActionDialog>
      </>
    ),
  };
};
