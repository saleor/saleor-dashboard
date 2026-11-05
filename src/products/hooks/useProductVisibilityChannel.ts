import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { PermissionEnum } from "@dashboard/graphql";
import { useHasPermission } from "@dashboard/search/useHasPermission";

/**
 * Staff without MANAGE_PRODUCTS only see catalogue items published in a channel, and Saleor
 * rejects the read ("More than one channel exists") unless one is given. Returns the selected
 * app channel for them, and no channel (all items) for MANAGE_PRODUCTS.
 * `loading` stays true until the channel list has loaded.
 */
export const useProductVisibilityChannel = (): {
  channel: string | undefined;
  loading: boolean;
} => {
  const canManageProducts = useHasPermission()(PermissionEnum.MANAGE_PRODUCTS);
  const { channel } = useAppChannel(false);

  if (canManageProducts) {
    return { channel: undefined, loading: false };
  }

  return { channel: channel?.slug, loading: channel === undefined };
};
