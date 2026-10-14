import { useStockVisibilityModeQuery } from "@dashboard/graphql";

/**
 * Undefined while the shop stock mode is loading. When it cannot be read, assume legacy mode:
 * it asks for a shipping zone and warns before zone links are lost, instead of calling a
 * warehouse ready without one.
 */
export const useLegacyStockAvailability = (): boolean | undefined => {
  // Same operation as the product stock hint, so pages showing both send one request.
  const query = useStockVisibilityModeQuery();
  const value = query.data?.shop?.useLegacyShippingZoneStockAvailability;

  if (typeof value === "boolean") {
    return value;
  }

  return query.loading ? undefined : true;
};
