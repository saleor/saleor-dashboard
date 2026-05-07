/**
 * Default for `Shop.useLegacyShippingZoneStockAvailability` when the shop
 * fragment hasn't loaded yet (or wasn't passed by a caller).
 *
 * Set to `true` so that, until we know otherwise, the doctor renders the
 * legacy-mode severity levels and copy and we don't transiently downgrade
 * warnings on a fresh page load.
 *
 * This is the single place to flip the doctor-wide default once the new
 * direct warehouse-channel mode becomes the standard — every consumer in
 * the ProductDoctor folder that needs a fallback reads from here, so the
 * change is one line.
 */
export const LEGACY_MODE_FALLBACK = true;
