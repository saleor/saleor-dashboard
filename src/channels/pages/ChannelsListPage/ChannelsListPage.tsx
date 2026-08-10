import { channelCreateSetupFlow } from "@dashboard/channels/ripples/channelCreateSetupFlow";
import { sortChannels } from "@dashboard/channels/sort";
import { ChannelsListUrlSortField, channelUrl } from "@dashboard/channels/urls";
import {
  type ChannelListSetupKind,
  getChannelListSetupState,
} from "@dashboard/channels/utils/channelListSetup";
import { LimitsInfo } from "@dashboard/components/AppLayout/LimitsInfo";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { ListPageLayout } from "@dashboard/components/Layouts";
import LimitReachedAlert from "@dashboard/components/LimitReachedAlert";
import { Pill } from "@dashboard/components/Pill";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableRowLink from "@dashboard/components/TableRowLink";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import { type ChannelDetailsFragment, type RefreshLimitsQuery } from "@dashboard/graphql";
import { buttonMessages, sectionNames } from "@dashboard/intl";
import { renderCollection, stopPropagation } from "@dashboard/misc";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { type SortPage } from "@dashboard/types";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { getArrowDirection } from "@dashboard/utils/sort";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Trash2, Truck, Warehouse } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { FormattedMessage, type MessageDescriptor, useIntl } from "react-intl";

import styles from "./ChannelsListPage.module.css";
import { messages } from "./messages";

interface ChannelsListPageProps extends SortPage<ChannelsListUrlSortField> {
  channelsList: ChannelDetailsFragment[] | undefined;
  limits: RefreshLimitsQuery["shop"]["limits"];
  /**
   * Shipping zone counts keyed by channel id. Omit / leave undefined when the
   * shipping query was skipped (missing MANAGE_SHIPPING).
   */
  shippingZoneCountsByChannelId?: Map<string, number>;
  shippingCoverageLoading?: boolean;
  onAddChannel: () => void;
  onRemove: (id: string) => void;
}

const numberOfColumns = 5;

const setupWarningMessages: Partial<Record<ChannelListSetupKind, MessageDescriptor>> = {
  needs_warehouse_and_shipping: messages.needsWarehouseAndShipping,
  needs_warehouse: messages.needsWarehouse,
  needs_shipping: messages.needsShipping,
};

export const ChannelsListPage = ({
  channelsList,
  limits,
  shippingZoneCountsByChannelId,
  shippingCoverageLoading = false,
  sort,
  onSort,
  onAddChannel,
  onRemove,
}: ChannelsListPageProps): ReactNode => {
  const intl = useIntl();
  const limitReached = isLimitReached(limits, "channels");
  const shippingStatusKnown = shippingZoneCountsByChannelId !== undefined;
  const sortedChannels = useMemo(() => {
    if (!channelsList) {
      return undefined;
    }

    return [...channelsList].sort(sortChannels(sort.sort, !!sort.asc));
  }, [channelsList, sort.asc, sort.sort]);

  return (
    <ListPageLayout>
      <TopNav
        href={configurationMenuUrl}
        hrefIcon={<TopNavDestinationIcon.configuration />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.configuration)}
        title={intl.formatMessage(sectionNames.channels)}
      >
        <Box position="relative">
          <Button
            disabled={limitReached}
            variant="primary"
            data-test-id="add-channel"
            onClick={onAddChannel}
          >
            <FormattedMessage id="OGm8wO" defaultMessage="Create Channel" description="button" />
          </Button>
          <Box position="absolute" __top="-4px" __right="-4px">
            <Ripple model={channelCreateSetupFlow} />
          </Box>
        </Box>
        {hasLimits(limits, "channels") && (
          <LimitsInfo
            text={intl.formatMessage(
              {
                id: "rZMT44",
                defaultMessage: "{count}/{max} channels used",
                description: "created channels counter",
              },
              {
                count: limits.currentUsage.channels,
                max: limits.allowedUsage.channels,
              },
            )}
          />
        )}
      </TopNav>
      {limitReached && (
        <LimitReachedAlert
          title={intl.formatMessage({
            id: "PTW56s",
            defaultMessage: "Channel limit reached",
            description: "alert",
          })}
        >
          <FormattedMessage
            id="ZMy18J"
            defaultMessage="You have reached your channel limit, you will be no longer able to add channels to your store. If you would like to up your limit, contact your administration staff about raising your limits."
          />
        </LimitReachedAlert>
      )}
      <DashboardCard marginTop={6}>
        <DashboardCard.Content>
          <ResponsiveTable>
            <TableHead>
              <TableRowLink>
                <TableCellHeader
                  arrowPosition="right"
                  direction={
                    sort.sort === ChannelsListUrlSortField.name
                      ? getArrowDirection(!!sort.asc)
                      : undefined
                  }
                  onClick={() => onSort(ChannelsListUrlSortField.name)}
                >
                  <FormattedMessage {...messages.channelColumn} />
                </TableCellHeader>
                <TableCellHeader
                  className={styles.colStatus}
                  arrowPosition="right"
                  direction={
                    sort.sort === ChannelsListUrlSortField.status
                      ? getArrowDirection(!!sort.asc)
                      : undefined
                  }
                  onClick={() => onSort(ChannelsListUrlSortField.status)}
                >
                  <FormattedMessage {...messages.statusColumn} />
                </TableCellHeader>
                <TableCellHeader className={styles.colSetup}>
                  <FormattedMessage {...messages.setupColumn} />
                </TableCellHeader>
                <TableCellHeader className={styles.colCoverage}>
                  <FormattedMessage {...messages.coverageColumn} />
                </TableCellHeader>
                <TableCell className={styles.colAction} />
              </TableRowLink>
            </TableHead>
            <TableBody data-test-id="channel-list">
              {renderCollection(
                sortedChannels,
                channel => {
                  const setup = channel
                    ? getChannelListSetupState({
                        warehouseCount: channel.warehouses.length,
                        shippingZoneCount: shippingStatusKnown
                          ? (shippingZoneCountsByChannelId.get(channel.id) ?? 0)
                          : undefined,
                      })
                    : undefined;
                  const setupMessage = setup ? setupWarningMessages[setup.kind] : undefined;

                  return (
                    <TableRowLink
                      data-test-id="channel-row"
                      hover={!!channel}
                      key={channel ? channel.id : "skeleton"}
                      className={channel ? styles.tableRow : undefined}
                      href={channel && channelUrl(channel.id)}
                    >
                      <TableCell>
                        {channel ? (
                          <Box display="flex" flexDirection="column" gap={0.5}>
                            <Text size={4} fontWeight="medium" data-test-id="name">
                              {channel.name}
                            </Text>
                            <Text size={1} color="default2">
                              <FormattedMessage
                                {...messages.channelMeta}
                                values={{
                                  slug: channel.slug,
                                  currency: channel.currencyCode,
                                  country: channel.defaultCountry.country,
                                }}
                              />
                            </Text>
                          </Box>
                        ) : (
                          <Skeleton />
                        )}
                      </TableCell>
                      <TableCell className={styles.colStatus}>
                        {channel ? (
                          <Pill
                            data-test-id="channel-status"
                            label={intl.formatMessage(
                              channel.isActive ? messages.statusActive : messages.statusInactive,
                            )}
                            color={channel.isActive ? "success" : "neutral"}
                          />
                        ) : (
                          <Skeleton />
                        )}
                      </TableCell>
                      <TableCell className={styles.colSetup}>
                        {setup ? (
                          setupMessage ? (
                            <Text size={2} color="warning1" data-test-id="channel-setup">
                              <FormattedMessage {...setupMessage} />
                            </Text>
                          ) : null
                        ) : (
                          <Skeleton />
                        )}
                      </TableCell>
                      <TableCell className={styles.colCoverage}>
                        {channel && setup ? (
                          <div className={styles.coverageCell}>
                            <span
                              className={clsx(styles.coverageItem, {
                                [styles.coverageItemBlocker]: setup.warehouseIsBlocker,
                              })}
                              title={intl.formatMessage(messages.warehousesCount, {
                                count: setup.warehouseCount,
                              })}
                              data-test-id="channel-warehouse-count"
                            >
                              <Warehouse
                                size={iconSize.small}
                                strokeWidth={iconStrokeWidthBySize.small}
                                aria-hidden
                              />
                              <Text
                                size={2}
                                color={setup.warehouseIsBlocker ? "critical1" : "default2"}
                              >
                                {setup.warehouseCount}
                              </Text>
                            </span>
                            {shippingCoverageLoading ? (
                              <Skeleton __width="40px" />
                            ) : setup.shippingStatusKnown ? (
                              <span
                                className={clsx(styles.coverageItem, {
                                  [styles.coverageItemBlocker]: setup.shippingIsBlocker,
                                })}
                                title={intl.formatMessage(messages.shippingZonesCount, {
                                  count: setup.shippingZoneCount ?? 0,
                                })}
                                data-test-id="channel-shipping-zone-count"
                              >
                                <Truck
                                  size={iconSize.small}
                                  strokeWidth={iconStrokeWidthBySize.small}
                                  aria-hidden
                                />
                                <Text
                                  size={2}
                                  color={setup.shippingIsBlocker ? "critical1" : "default2"}
                                >
                                  {setup.shippingZoneCount ?? 0}
                                </Text>
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          <Skeleton />
                        )}
                      </TableCell>
                      <TableCell className={styles.colAction}>
                        {sortedChannels && sortedChannels.length > 1 && (
                          <TableButtonWrapper>
                            <Button
                              variant="tertiary"
                              data-test-id="delete-channel"
                              aria-label={intl.formatMessage(buttonMessages.delete)}
                              icon={
                                <Trash2
                                  size={iconSize.small}
                                  strokeWidth={iconStrokeWidthBySize.small}
                                />
                              }
                              onClick={
                                channel ? stopPropagation(() => onRemove(channel.id)) : undefined
                              }
                            />
                          </TableButtonWrapper>
                        )}
                      </TableCell>
                    </TableRowLink>
                  );
                },
                () => (
                  <TableRowLink>
                    <TableCell colSpan={numberOfColumns}>
                      <FormattedMessage id="/glQgs" defaultMessage="No channels found" />
                    </TableCell>
                  </TableRowLink>
                ),
              )}
            </TableBody>
          </ResponsiveTable>
        </DashboardCard.Content>
      </DashboardCard>
    </ListPageLayout>
  );
};

ChannelsListPage.displayName = "ChannelsListPage";
