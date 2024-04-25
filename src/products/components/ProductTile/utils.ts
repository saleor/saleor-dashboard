// @ts-strict-ignore
import { StatusDotProps } from "@dashboard/components/StatusDot/StatusDot";
import { ProductFragment } from "@dashboard/graphql";

export const getTileStatus = (
  productChannelListings: ProductFragment["channelListings"],
): StatusDotProps["status"] =>
  productChannelListings.some(channel => channel.isPublished) ? "success" : "error";
