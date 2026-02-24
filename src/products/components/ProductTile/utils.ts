// @ts-strict-ignore
import { type StatusDotProps } from "@dashboard/components/StatusDot/StatusDot";
import { type ProductFragment } from "@dashboard/graphql";

export const getTileStatus = (
  productChannelListings: ProductFragment["channelListings"],
): StatusDotProps["status"] =>
  productChannelListings.some(channel => channel.isPublished) ? "success" : "error";
