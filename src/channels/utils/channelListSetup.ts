export type ChannelListSetupKind =
  | "needs_warehouse_and_shipping"
  | "needs_warehouse"
  | "needs_shipping"
  /** Warehouse (+ shipping when known) assigned — no list copy; Status covers Active/Inactive. */
  | "complete";

export interface ChannelListSetupInput {
  warehouseCount: number;
  /**
   * Zone count for this channel. `undefined` when shipping data was skipped
   * (missing MANAGE_SHIPPING) — do not treat as zero.
   */
  shippingZoneCount?: number;
}

export interface ChannelListSetupState {
  kind: ChannelListSetupKind;
  warehouseCount: number;
  shippingZoneCount?: number;
  shippingStatusKnown: boolean;
  hasWarehouse: boolean;
  hasShipping: boolean;
  coreReady: boolean;
  warehouseIsBlocker: boolean;
  shippingIsBlocker: boolean;
}

export const getChannelListSetupState = ({
  warehouseCount,
  shippingZoneCount,
}: ChannelListSetupInput): ChannelListSetupState => {
  const shippingStatusKnown = shippingZoneCount !== undefined;
  const hasWarehouse = warehouseCount > 0;
  const hasShipping = (shippingZoneCount ?? 0) > 0;
  // Matches ChannelSetupCard: unknown shipping must not block core readiness.
  const coreReady = hasWarehouse && (!shippingStatusKnown || hasShipping);

  let kind: ChannelListSetupKind;

  if (!hasWarehouse && shippingStatusKnown && !hasShipping) {
    kind = "needs_warehouse_and_shipping";
  } else if (!hasWarehouse) {
    kind = "needs_warehouse";
  } else if (shippingStatusKnown && !hasShipping) {
    kind = "needs_shipping";
  } else {
    // Don't claim "ready to activate" / "selling" — list lacks catalog & payments.
    kind = "complete";
  }

  return {
    kind,
    warehouseCount,
    shippingZoneCount,
    shippingStatusKnown,
    hasWarehouse,
    hasShipping,
    coreReady,
    warehouseIsBlocker: !hasWarehouse,
    shippingIsBlocker: shippingStatusKnown && !hasShipping,
  };
};

export const buildChannelShippingZoneCountMap = (
  zones: Array<{ channels: Array<{ id: string }> }> | null | undefined,
): Map<string, number> => {
  const counts = new Map<string, number>();

  for (const zone of zones ?? []) {
    for (const channel of zone.channels) {
      counts.set(channel.id, (counts.get(channel.id) ?? 0) + 1);
    }
  }

  return counts;
};
