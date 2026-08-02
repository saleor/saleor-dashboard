import { type Products } from "@dashboard/components/AssignProductDialog/types";

export const isProductListedInChannel = (
  product: Pick<Products[number], "channelListings">,
  channelId: string,
): boolean => product.channelListings?.some(listing => listing.channel.id === channelId) ?? false;
