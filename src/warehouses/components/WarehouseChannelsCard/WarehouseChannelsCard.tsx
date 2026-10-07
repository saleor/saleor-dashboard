import { AssignListRequiredMeta } from "@dashboard/components/AssignListCard/AssignListCard";
import { ChannelDetailsLink } from "@dashboard/components/Channel/Channel";
import DeletableItem from "@dashboard/components/DeletableItem/DeletableItem";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { type WarehouseChannelRef } from "@dashboard/warehouses/hooks/useWarehouseChannelMembership";
import { messages } from "@dashboard/warehouses/messages";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Globe } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./WarehouseChannelsCard.module.css";

export const WAREHOUSE_CHANNELS_SECTION_ID = "warehouse-channels";

interface WarehouseChannelsCardProps {
  status: "loading" | "error" | "ready";
  channels: WarehouseChannelRef[];
  availableChannels: WarehouseChannelRef[];
  canManage: boolean;
  disabled: boolean;
  onRetry: () => void;
  onRemove: (channelId: string) => void;
  /** Opens the shared assign dialog, also used by the setup checklist. */
  onRequestAssign: () => void;
}

export const WarehouseChannelsCard = ({
  status,
  channels,
  availableChannels,
  canManage,
  disabled,
  onRetry,
  onRemove,
  onRequestAssign,
}: WarehouseChannelsCardProps): ReactNode => {
  const intl = useIntl();
  const hasChannels = channels.length > 0;
  const assignButton =
    canManage && status === "ready" && availableChannels.length > 0 ? (
      <Button
        variant="secondary"
        type="button"
        size="small"
        disabled={disabled}
        data-test-id="warehouse-channels-add"
        onClick={onRequestAssign}
      >
        <FormattedMessage {...messages.channelsAdd} />
      </Button>
    ) : null;

  return (
    <Box
      className={styles.card}
      id={WAREHOUSE_CHANNELS_SECTION_ID}
      data-test-id="warehouse-channels"
    >
      <Box className={styles.header}>
        <Text size={5} fontWeight="bold" as="h2">
          <FormattedMessage {...messages.channelsTitle} />
        </Text>
        {status === "ready" ? (
          hasChannels ? (
            <Text size={2} color="default2">
              <FormattedMessage
                {...messages.channelsAssignedCount}
                values={{ count: channels.length }}
              />
            </Text>
          ) : (
            <AssignListRequiredMeta>
              <FormattedMessage {...messages.channelsRequired} />
            </AssignListRequiredMeta>
          )
        ) : null}
      </Box>
      <Box className={styles.intro}>
        <Text size={3} color="default2">
          <FormattedMessage {...messages.channelsIntro} />
        </Text>
      </Box>
      {status === "loading" ? (
        <Box padding={4}>
          <Skeleton __height="1.25rem" __width="60%" />
        </Box>
      ) : null}
      {status === "error" ? (
        <Box className={styles.emptyState}>
          <Text size={3}>
            <FormattedMessage {...messages.channelsError} />
          </Text>
          <Button variant="secondary" type="button" size="small" onClick={onRetry}>
            <FormattedMessage {...messages.channelsRetry} />
          </Button>
        </Box>
      ) : null}
      {status === "ready" && !hasChannels ? (
        <Box className={styles.emptyState} data-test-id="warehouse-channels-empty">
          <Box className={styles.emptyLeading}>
            <Box className={styles.emptyIcon} aria-hidden>
              <Globe size={iconSize.small} strokeWidth={iconStrokeWidth} />
            </Box>
            <Box className={styles.emptyCopy}>
              <Text size={3} fontWeight="medium">
                <FormattedMessage {...messages.channelsEmptyTitle} />
              </Text>
              <Text size={2} color="default2">
                <FormattedMessage {...messages.channelsEmptyDescription} />
              </Text>
            </Box>
          </Box>
          {assignButton ? <Box className={styles.emptyAction}>{assignButton}</Box> : null}
        </Box>
      ) : null}
      {status === "ready" && hasChannels ? (
        <>
          <div className={styles.list}>
            {channels.map(channel => (
              <div key={channel.id} className={styles.row} data-test-id="warehouse-channel-row">
                <ChannelDetailsLink channel={channel} size={3} color="default1" />
                {canManage ? (
                  <div className={styles.rowDelete}>
                    <DeletableItem
                      id={channel.id}
                      disabled={disabled}
                      label={intl.formatMessage(messages.channelsRemove, { channel: channel.name })}
                      onDelete={onRemove}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <Box
            className={clsx(styles.footer, !assignButton && styles.footerHint)}
            data-test-id="warehouse-channels-footer"
          >
            {assignButton ?? (
              <Text size={2} color="default2">
                {availableChannels.length === 0 ? (
                  <FormattedMessage {...messages.channelsAllAssigned} />
                ) : (
                  <FormattedMessage {...messages.setupChannelPermission} />
                )}
              </Text>
            )}
          </Box>
        </>
      ) : null}
    </Box>
  );
};

WarehouseChannelsCard.displayName = "WarehouseChannelsCard";
