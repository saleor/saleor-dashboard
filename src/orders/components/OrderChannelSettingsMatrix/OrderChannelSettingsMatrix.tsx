import { channelUrl } from "@dashboard/channels/urls";
import { ChannelSearchInput } from "@dashboard/components/ChannelAvailability/ChannelSearchInput";
import { channelAvailabilityMessages } from "@dashboard/components/ChannelAvailability/messages";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Pill } from "@dashboard/components/Pill";
import { SettingsSection } from "@dashboard/components/Settings/SettingsSection";
import { settingsHashes } from "@dashboard/configuration/settingsCatalog/hashes";
import { type OrderSettingsChannelsQuery, OrderStatus } from "@dashboard/graphql";
import { transformOrderStatus } from "@dashboard/misc";
import {
  type ChannelOrderSettingsFormMap,
  type ChannelOrderSettingsMatrixField,
} from "@dashboard/orders/components/OrderSettingsPage/types";
import { Box, Checkbox, Input, Text, Tooltip } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { CircleHelp } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { FormattedMessage, type MessageDescriptor, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import {
  CHANNEL_MATRIX_SCROLL_THRESHOLD,
  CHANNEL_MATRIX_SEARCH_THRESHOLD,
  getVisibleChannelsForMatrix,
} from "./channelMatrixUtils";
import { orderChannelSettingsMatrixMessages as messages } from "./messages";
import styles from "./OrderChannelSettingsMatrix.module.css";

type ChannelRow = NonNullable<OrderSettingsChannelsQuery["channels"]>[number];

interface OrderChannelSettingsMatrixProps {
  channels: ChannelRow[];
  channelSettings: ChannelOrderSettingsFormMap;
  dirtyChannelIds: string[];
  disabled?: boolean;
  onChannelChange: (
    channelId: string,
    field: ChannelOrderSettingsMatrixField,
    value: boolean | number,
  ) => void;
}

interface HeaderWithHelpProps {
  label: ReactNode;
  labelText: string;
  /** Plain-text tooltip (most columns). */
  tooltip?: MessageDescriptor;
  /** Custom tooltip body when pills / layout need more structure. */
  tooltipContent?: ReactNode;
  id?: string;
}

const HeaderWithHelp = ({
  label,
  labelText,
  tooltip,
  tooltipContent,
  id,
}: HeaderWithHelpProps): JSX.Element => {
  const intl = useIntl();

  return (
    <span className={styles.headerCell} id={id}>
      {label}
      <Tooltip>
        <Tooltip.Trigger>
          <button
            type="button"
            className={styles.helpButton}
            aria-label={intl.formatMessage(messages.columnHelpAriaLabel, { column: labelText })}
            onClick={event => event.stopPropagation()}
          >
            <CircleHelp size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" align="start">
          <Tooltip.Arrow />
          {tooltipContent ?? (
            <Box className={styles.tooltipContent}>
              <Text size={2} color="default1">
                {tooltip ? <FormattedMessage {...tooltip} /> : null}
              </Text>
            </Box>
          )}
        </Tooltip.Content>
      </Tooltip>
    </span>
  );
};

const AutoConfirmTooltip = (): JSX.Element => {
  const intl = useIntl();
  const unfulfilledStatus = transformOrderStatus(OrderStatus.UNFULFILLED, intl);
  const unconfirmedStatus = transformOrderStatus(OrderStatus.UNCONFIRMED, intl);

  return (
    <Box className={styles.autoConfirmTooltip}>
      <Text size={2} color="default2">
        <FormattedMessage {...messages.autoConfirmTooltipIntro} />
      </Text>
      <Box className={styles.autoConfirmRows}>
        <Box className={styles.autoConfirmRow}>
          <Text size={2} fontWeight="medium" color="default1">
            <FormattedMessage {...messages.autoConfirmOnLabel} />
          </Text>
          <Pill
            className={styles.statusPill}
            label={unfulfilledStatus.localized}
            color={unfulfilledStatus.status}
          />
        </Box>
        <Box className={styles.autoConfirmRow}>
          <Text size={2} fontWeight="medium" color="default1">
            <FormattedMessage {...messages.autoConfirmOffLabel} />
          </Text>
          <Pill
            className={styles.statusPill}
            label={unconfirmedStatus.localized}
            color={unconfirmedStatus.status}
          />
        </Box>
      </Box>
    </Box>
  );
};

const MatrixCheckbox = ({
  checked,
  disabled,
  testId,
  onCheckedChange,
}: {
  checked: boolean;
  disabled?: boolean;
  testId: string;
  onCheckedChange: (checked: boolean) => void;
}): JSX.Element => (
  <Box className={styles.matrixControl}>
    <Checkbox
      checked={checked}
      disabled={disabled}
      data-test-id={testId}
      onCheckedChange={value => onCheckedChange(value === true)}
    />
  </Box>
);

export const OrderChannelSettingsMatrix = ({
  channels,
  channelSettings,
  dirtyChannelIds,
  disabled,
  onChannelChange,
}: OrderChannelSettingsMatrixProps): JSX.Element => {
  const intl = useIntl();
  const [searchQuery, setSearchQuery] = useState("");
  const [hideInactive, setHideInactive] = useState(false);

  const hasInactiveChannels = useMemo(
    () => channels.some(channel => !channel.isActive),
    [channels],
  );
  const showSearch = channels.length > CHANNEL_MATRIX_SEARCH_THRESHOLD;
  const showToolbar = showSearch || hasInactiveChannels;
  const visibleChannels = useMemo(
    () => getVisibleChannelsForMatrix(channels, { query: searchQuery, hideInactive }),
    [channels, hideInactive, searchQuery],
  );
  const limitVerticalScroll = visibleChannels.length > CHANNEL_MATRIX_SCROLL_THRESHOLD;

  const autoConfirmLabel = intl.formatMessage({
    id: "XGY+yQ",
    defaultMessage: "Auto-confirm",
    description: "matrix column header",
  });
  const autoFulfillLabel = intl.formatMessage({
    id: "rKk1Fx",
    defaultMessage: "Auto-fulfill gift cards",
    description: "matrix column header",
  });
  const allowUnpaidLabel = intl.formatMessage({
    id: "ZMT099",
    defaultMessage: "Allow unpaid",
    description: "matrix column header",
  });
  const deleteExpiredLabel = intl.formatMessage({
    id: "xipkZ1",
    defaultMessage: "Delete expired (days)",
    description: "matrix column header",
  });

  return (
    <SettingsSection
      id={settingsHashes.ordersChannelSettings}
      data-test-id="order-channel-settings-matrix"
      ownership="channel"
      title={intl.formatMessage({
        id: "BvUJzF",
        defaultMessage: "Per-channel order settings",
        description: "matrix section title on orders and fulfillment settings",
      })}
      description={<FormattedMessage {...messages.matrixDescription} />}
    >
      {/*
        Stable deep-link targets for settings search — always mounted so hash
        scroll works before/without the channel table (loading or empty).
      */}
      <div className={styles.hashAnchors} data-hash-anchors aria-hidden>
        <span id={settingsHashes.ordersAutoConfirm} />
        <span id={settingsHashes.ordersAutoFulfillGiftCards} />
        <span id={settingsHashes.ordersAllowUnpaid} />
        <span id={settingsHashes.ordersDeleteExpired} />
      </div>
      {showToolbar ? (
        <Box className={styles.toolbar} data-test-id="order-channel-matrix-toolbar">
          {showSearch ? (
            <Box className={styles.toolbarSearch}>
              <ChannelSearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={intl.formatMessage(
                  channelAvailabilityMessages.searchChannelsPlaceholder,
                )}
              />
            </Box>
          ) : null}
          {hasInactiveChannels ? (
            <Checkbox
              checked={hideInactive}
              disabled={disabled}
              data-test-id="order-channel-matrix-hide-inactive"
              onCheckedChange={value => setHideInactive(value === true)}
            >
              <Text size={2}>
                <FormattedMessage {...messages.hideInactiveChannels} />
              </Text>
            </Checkbox>
          ) : null}
        </Box>
      ) : null}
      <Box className={clsx(styles.scroll, limitVerticalScroll && styles.scrollLimited)}>
        {channels.length === 0 ? (
          <Box paddingX={6} paddingY={5}>
            <Text size={2} color="default2">
              <FormattedMessage
                id="X6Ql+m"
                defaultMessage="No channels yet."
                description="empty state for channel settings matrix"
              />
            </Text>
          </Box>
        ) : visibleChannels.length === 0 ? (
          <Box className={styles.emptyFiltered}>
            <Text size={2} color="default2">
              <FormattedMessage {...channelAvailabilityMessages.noChannelsMatchSearch} />
            </Text>
          </Box>
        ) : (
          <table className={styles.table}>
            <colgroup>
              <col className={styles.channelCol} />
              <col className={styles.optionCol} />
              <col className={styles.optionCol} />
              <col className={styles.optionCol} />
              <col className={styles.optionCol} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <FormattedMessage
                    id="sOyNKE"
                    defaultMessage="Channel"
                    description="matrix column header"
                  />
                </th>
                <th>
                  <HeaderWithHelp
                    label={autoConfirmLabel}
                    labelText={autoConfirmLabel}
                    tooltipContent={<AutoConfirmTooltip />}
                  />
                </th>
                <th>
                  <HeaderWithHelp
                    label={autoFulfillLabel}
                    labelText={autoFulfillLabel}
                    tooltip={messages.autoFulfillGiftCardsTooltip}
                  />
                </th>
                <th>
                  <HeaderWithHelp
                    label={allowUnpaidLabel}
                    labelText={allowUnpaidLabel}
                    tooltip={messages.allowUnpaidTooltip}
                  />
                </th>
                <th>
                  <HeaderWithHelp
                    label={deleteExpiredLabel}
                    labelText={deleteExpiredLabel}
                    tooltip={messages.deleteExpiredTooltip}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleChannels.map(channel => {
                const settings = channelSettings[channel.id];
                const isDirty = dirtyChannelIds.includes(channel.id);

                if (!settings) {
                  return null;
                }

                return (
                  <tr
                    key={channel.id}
                    className={clsx(isDirty && styles.dirtyRow)}
                    data-test-id={`order-channel-matrix-row-${channel.slug}`}
                    data-dirty={isDirty ? "true" : undefined}
                  >
                    <td>
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        {disabled ? (
                          <Text size={2} fontWeight="medium">
                            {channel.name}
                          </Text>
                        ) : (
                          <Link to={channelUrl(channel.id)} className={styles.channelLink}>
                            <Text size={2} fontWeight="medium">
                              {channel.name}
                            </Text>
                          </Link>
                        )}
                        <Text size={1} color="default2">
                          {channel.currencyCode}
                          {!channel.isActive ? (
                            <>
                              {" · "}
                              <FormattedMessage
                                id="YC5bAx"
                                defaultMessage="Inactive"
                                description="inactive channel label in matrix"
                              />
                            </>
                          ) : null}
                        </Text>
                      </Box>
                    </td>
                    <td>
                      <MatrixCheckbox
                        checked={settings.automaticallyConfirmAllNewOrders}
                        disabled={disabled}
                        testId={`order-channel-matrix-auto-confirm-${channel.slug}`}
                        onCheckedChange={value =>
                          onChannelChange(channel.id, "automaticallyConfirmAllNewOrders", value)
                        }
                      />
                    </td>
                    <td>
                      <MatrixCheckbox
                        checked={settings.automaticallyFulfillNonShippableGiftCard}
                        disabled={disabled}
                        testId={`order-channel-matrix-auto-fulfill-${channel.slug}`}
                        onCheckedChange={value =>
                          onChannelChange(
                            channel.id,
                            "automaticallyFulfillNonShippableGiftCard",
                            value,
                          )
                        }
                      />
                    </td>
                    <td>
                      <MatrixCheckbox
                        checked={settings.allowUnpaidOrders}
                        disabled={disabled}
                        testId={`order-channel-matrix-allow-unpaid-${channel.slug}`}
                        onCheckedChange={value =>
                          onChannelChange(channel.id, "allowUnpaidOrders", value)
                        }
                      />
                    </td>
                    <td>
                      <Box className={styles.matrixControl}>
                        <Input
                          size="small"
                          type="number"
                          min={0}
                          max={120}
                          disabled={disabled}
                          data-test-id={`order-channel-matrix-delete-expired-${channel.slug}`}
                          value={String(settings.deleteExpiredOrdersAfter)}
                          onChange={event =>
                            onChannelChange(
                              channel.id,
                              "deleteExpiredOrdersAfter",
                              Number(event.target.value),
                            )
                          }
                          __width="4.5rem"
                        />
                      </Box>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Box>
    </SettingsSection>
  );
};
