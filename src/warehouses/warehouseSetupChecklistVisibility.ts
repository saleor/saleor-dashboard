/**
 * The checklist stays while a required step is open: no channel, or (in the older
 * stock mode) no shipping zone. `?action=setup` shows it again from the menu after
 * the required steps are done, and skipping closes that view.
 */
export const isWarehouseSetupChecklistVisible = ({
  membershipReady,
  inChannel,
  emphasized,
  shippingZoneRequired = false,
  hasShippingZone = true,
}: {
  membershipReady: boolean;
  inChannel: boolean;
  emphasized: boolean;
  /** Older stock mode: a shipping zone is also required to sell. */
  shippingZoneRequired?: boolean;
  hasShippingZone?: boolean;
}): boolean => {
  if (!membershipReady) {
    return false;
  }

  if (emphasized) {
    return true;
  }

  if (!inChannel) {
    return true;
  }

  return shippingZoneRequired && !hasShippingZone;
};
