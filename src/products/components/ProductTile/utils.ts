import { type StatusDotProps } from "@dashboard/components/StatusDot/StatusDot";

export const getTileStatus = (
  productChannelListings: Array<{ isPublished: boolean }>,
): StatusDotProps["status"] =>
  productChannelListings.some(channel => channel.isPublished) ? "success" : "error";
