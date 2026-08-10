import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { Skeleton } from "@dashboard/components/Skeleton/Skeleton";
import { type PermissionEnum } from "@dashboard/graphql";
import { Accordion, Box, Button, Text } from "@saleor/macaw-ui-next";
import { Globe } from "lucide-react";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import styles from "./ChannelAvailabilityCard.module.css";
import { ChannelAvailabilityItem } from "./ChannelAvailabilityItem";
import { ChannelAvailabilityListItem } from "./ChannelAvailabilityListItem";
import { ChannelPagination } from "./ChannelPagination";
import { ChannelSearchInput } from "./ChannelSearchInput";
import {
  channelAvailabilityEntityMessages,
  type ChannelAvailabilityEntityType,
  channelAvailabilityMessages,
} from "./messages";
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
  entityType: ChannelAvailabilityEntityType;
  /** Defaults to shared “No channels assigned” copy. */
  emptyTitle?: string;
  emptyDescription: string;
  isLoading?: boolean;
  onManageClick?: () => void;
  managePermissions?: PermissionEnum[];
  banner?: ReactNode;
  getChannelStatus: (channel: T) => ChannelAvailabilityStatus;
  listLeadingVisual?: ChannelAvailabilityListLeadingVisual;
}

type ChannelAvailabilityCardProps<T extends ChannelAvailabilitySummary> =
  ChannelAvailabilityCardBaseProps<T> &
    (
      | {
          variant?: "accordion";
          renderChannelDetails: (channel: T) => ReactNode;
        }
      | {
          variant: "list";
          renderChannelDetails?: never;
        }
    );

export function ChannelAvailabilityCard<T extends ChannelAvailabilitySummary>({
  channels,
  totalChannelsCount,
  entityType,
  emptyTitle: emptyTitleProp,
  emptyDescription,
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
  const entityTypeLabel = intl.formatMessage(channelAvailabilityEntityMessages[entityType]);
  const emptyTitle = emptyTitleProp ?? intl.formatMessage(channelAvailabilityMessages.emptyTitle);
  const hasChannels = channels.length > 0;

  return (
    <Box className={styles.card} data-test-id="availability-card">
      <Box className={styles.header}>
        <Box className={styles.headerText}>
          <Text size={5} fontWeight="bold" as="h2">
            {intl.formatMessage(channelAvailabilityMessages.availabilityTitle)}
          </Text>
          {isLoading ? (
            <Skeleton __height="14px" __width="10rem" />
          ) : (
            <Text size={2} color="default2" data-test-id="channel-availability-subtitle">
              {intl.formatMessage(channelAvailabilityMessages.availabilitySubtitle, {
                entityType: entityTypeLabel,
                listed: listedChannelsCount,
                total: totalChannelsCount,
              })}
            </Text>
          )}
        </Box>
        {onManageClick && (
          <RequirePermissions requiredPermissions={managePermissions}>
            <Button
              variant="secondary"
              onClick={onManageClick}
              data-test-id="channels-availability-manage-button"
              type="button"
              disabled={isLoading}
            >
              {intl.formatMessage(channelAvailabilityMessages.manageButton)}
            </Button>
          </RequirePermissions>
        )}
      </Box>

      {isLoading ? (
        <Box
          className={styles.loading}
          aria-busy="true"
          data-test-id="channel-availability-loading"
        >
          <Box display="flex" flexDirection="column" gap={0}>
            {[0, 1, 2].map(index => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={2}
                paddingX={4}
                paddingY={2}
                borderBottomWidth={index === 2 ? 0 : 1}
                borderBottomStyle="solid"
                borderColor="default1"
              >
                <Skeleton __width="0.5rem" __height="0.5rem" borderRadius="100%" />
                <Skeleton
                  __height="14px"
                  __width={index === 0 ? "70%" : index === 1 ? "55%" : "40%"}
                />
              </Box>
            ))}
          </Box>
        </Box>
      ) : !hasChannels ? (
        <Box className={styles.emptyState} data-test-id="channel-availability-empty">
          <Box className={styles.emptyLeading}>
            <Box className={styles.emptyIcon} aria-hidden>
              <Globe size={iconSize.small} strokeWidth={iconStrokeWidth} />
            </Box>
            <Box className={styles.emptyCopy}>
              <Text size={3} fontWeight="medium">
                {emptyTitle}
              </Text>
              <Text size={2} color="default2">
                {emptyDescription}
              </Text>
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          {banner ? <Box className={styles.banner}>{banner}</Box> : null}

          {showSearch ? (
            <Box className={styles.body}>
              <ChannelSearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={intl.formatMessage(
                  channelAvailabilityMessages.searchChannelsPlaceholder,
                )}
              />
            </Box>
          ) : null}

          {filteredChannels.length === 0 ? (
            <Box className={styles.body}>
              <Text size={2} color="default2">
                {intl.formatMessage(channelAvailabilityMessages.noChannelsMatchSearch)}
              </Text>
            </Box>
          ) : (
            <>
              <Box className={styles.list}>
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
                    value={expandedChannelId ?? ""}
                    onValueChange={(value: string) => setExpandedChannelId(value || undefined)}
                  >
                    {paginatedChannels.map((channel, index) => (
                      <ChannelAvailabilityItem
                        key={channel.id}
                        channel={channel}
                        rowIndex={index}
                        isLast={index === paginatedChannels.length - 1}
                        isOpen={expandedChannelId === channel.id}
                        onClose={() => setExpandedChannelId(undefined)}
                        status={getChannelStatus(channel)}
                      >
                        {renderChannelDetails!(channel)}
                      </ChannelAvailabilityItem>
                    ))}
                  </Accordion>
                )}
              </Box>

              {showPagination ? (
                <Box className={styles.listFooter}>
                  <ChannelPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredChannels.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                  />
                </Box>
              ) : null}
            </>
          )}
        </>
      )}
    </Box>
  );
}

ChannelAvailabilityCard.displayName = "ChannelAvailabilityCard";
