/** Only the shape the check reads, so a full search product satisfies it structurally. */
export interface ProductChannelListings {
  channelListings?: Array<{ channel: { id: string } }> | null;
}

export interface ProductWithCategory {
  category?: { id: string } | null;
}

export const isProductListedInChannel = (
  product: ProductChannelListings,
  channelId: string,
): boolean => product.channelListings?.some(listing => listing.channel.id === channelId) ?? false;

export const isProductMissingCategory = (product: ProductWithCategory): boolean =>
  product.category == null;
