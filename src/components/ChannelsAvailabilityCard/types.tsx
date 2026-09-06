export interface ChannelOpts {
  // Can be string (date), null (clear date), or undefined (don't change)
  availableForPurchase?: string | null;
  isAvailableForPurchase?: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  visibleInListings?: boolean;
}
