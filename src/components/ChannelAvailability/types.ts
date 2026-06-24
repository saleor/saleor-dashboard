export interface ChannelAvailabilitySummary {
  id: string;
  name: string;
  currencyCode: string;
}

export type ChannelAvailabilityStatusType = "success" | "warning" | "error";

export type ChannelAvailabilityBadgeType = "error" | "draft";

export type ChannelAvailabilityListLeadingVisual = "status-dot" | "channel-icon";

export interface ChannelAvailabilityStatus {
  type: ChannelAvailabilityStatusType;
  label: string;
  description: string;
  badge?: ChannelAvailabilityBadgeType;
}
