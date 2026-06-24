import { DashboardCard } from "@dashboard/components/Card";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { type PermissionEnum } from "@dashboard/graphql";
import { Accordion, Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { useIntl } from "react-intl";

import { ChannelAvailabilityItem } from "./ChannelAvailabilityItem";
import { ChannelAvailabilityListItem } from "./ChannelAvailabilityListItem";
import { ChannelPagination } from "./ChannelPagination";
import { ChannelSearchInput } from "./ChannelSearchInput";
import { channelAvailabilityMessages } from "./messages";
import {
  type ChannelAvailabilityListLeadingVisual,
  type ChannelAvailabilityStatus,
  type ChannelAvailabilitySummary,
} from "./types";
import { useChannelAvailabilityList } from "./useChannelAvailabilityList";
import { CHANNEL_SEARCH_VISIBILITY_THRESHOLD } from "./utils";

interface ChannelAvailabilityCardBaseProps<T extends ChannelAvailabilitySummary> {
  channels: T[];
  totalChannelsCount: number;
  emptyMessage: string;
  isLoading?: boolean;
  onManageClick?: () => void;
  managePermissions?: PermissionEnum[];
  banner?: React.ReactNode;
  getChannelStatus: (channel: T) => ChannelAvailabilityStatus;
  listLeadingVisual?: ChannelAvailabilityListLeadingVisual;
}

type ChannelAvailabilityCardProps<T extends ChannelAvailabilitySummary> =
  ChannelAvailabilityCardBaseProps<T> &
    (
      | {
          variant?: "accordion";
          renderChannelDetails: (channel: T) => React.ReactNode;
        }
      | {
          variant: "list";
          renderChannelDetails?: never;
        }
    );

export function ChannelAvailabilityCard<T extends ChannelAvailabilitySummary>({
  channels,
  totalChannelsCount,
  emptyMessage,
  isLoading = false,
  onManageClick,
  managePermissions = [],
  banner,
  getChannelStatus,
  variant = "accordion",
  listLeadingVisual = "status-dot",
  renderChannelDetails,
}: ChannelAvailabilityCardProps<T>) {
  const intl = useIntl();
  const showSearch = channels.length > CHANNEL_SEARCH_VISIBILITY_THRESHOLD;
  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    expandedChannelId,
    setExpandedChannelId,
    filteredChannels,
    paginatedChannels,
    totalPages,
    showPagination,
    pageSize,
  } = useChannelAvailabilityList(channels, undefined, showSearch);

  const listedChannelsCount = channels.length;

  return (
    <DashboardCard data-test-id="availability-card">
      <DashboardCard.Header>
        <Box display="flex" flexDirection="column" gap={1}>
          <DashboardCard.Title>
            {intl.formatMessage(channelAvailabilityMessages.availabilityTitle)}
          </DashboardCard.Title>
          {!isLoading && (
            <Text size={2} color="default2" data-test-id="channel-availability-subtitle">
              {intl.formatMessage(channelAvailabilityMessages.availabilitySubtitle, {
                listed: listedChannelsCount,
                total: totalChannelsCount,
              })}
            </Text>
          )}
        </Box>
        {onManageClick && (
          <DashboardCard.Toolbar>
            <RequirePermissions requiredPermissions={managePermissions}>
              <Button
                variant="secondary"
                size="small"
                onClick={onManageClick}
                data-test-id="channels-availability-manage-button"
                type="button"
              >
                {intl.formatMessage(channelAvailabilityMessages.manageButton)}
              </Button>
            </RequirePermissions>
          </DashboardCard.Toolbar>
        )}
      </DashboardCard.Header>

      <DashboardCard.Content>
        {isLoading ? (
          <Box padding={4}>
            <Skeleton height={4} marginBottom={2} />
            <Skeleton height={4} __width="60%" />
          </Box>
        ) : channels.length === 0 ? (
          <Box padding={4}>
            <Text size={2} color="default2">
              {emptyMessage}
            </Text>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={4}>
            {banner}

            {showSearch && (
              <ChannelSearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={intl.formatMessage(
                  channelAvailabilityMessages.searchChannelsPlaceholder,
                )}
              />
            )}

            {filteredChannels.length === 0 ? (
              <Box
                padding={4}
                borderWidth={1}
                borderStyle="solid"
                borderColor="default1"
                borderRadius={4}
              >
                <Text size={2} color="default2">
                  {intl.formatMessage(channelAvailabilityMessages.noChannelsMatchSearch)}
                </Text>
              </Box>
            ) : (
              <>
                <Box
                  borderWidth={1}
                  borderStyle="solid"
                  borderColor="default1"
                  borderRadius={4}
                  overflow="hidden"
                >
                  {variant === "list" ? (
                    paginatedChannels.map((channel, index) => (
                      <ChannelAvailabilityListItem
                        key={channel.id}
                        channel={channel}
                        isLast={index === paginatedChannels.length - 1}
                        status={getChannelStatus(channel)}
                        leadingVisual={listLeadingVisual}
                      />
                    ))
                  ) : (
                    <Accordion
                      value={expandedChannelId}
                      onValueChange={(value: string) => setExpandedChannelId(value)}
                    >
                      {paginatedChannels.map((channel, index) => (
                        <ChannelAvailabilityItem
                          key={channel.id}
                          channel={channel}
                          isLast={index === paginatedChannels.length - 1}
                          isExpanded={expandedChannelId === channel.id}
                          status={getChannelStatus(channel)}
                        >
                          {renderChannelDetails!(channel)}
                        </ChannelAvailabilityItem>
                      ))}
                    </Accordion>
                  )}
                </Box>

                {showPagination && (
                  <ChannelPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredChannels.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
}

ChannelAvailabilityCard.displayName = "ChannelAvailabilityCard";
