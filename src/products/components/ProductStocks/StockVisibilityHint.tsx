import { useStockVisibilityModeQuery } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

/**
 * Renders a small grey footnote beneath the per-warehouse stock table that
 * explains how the active stock-availability mode (Saleor 3.23+) governs
 * whether a customer in a given channel actually sees this stock.
 *
 * In legacy mode (`useLegacyShippingZoneStockAvailability=true`) stock is
 * visible only when the warehouse is assigned to a channel AND is covered by
 * a shipping zone for the destination. In direct mode (the new default) the
 * shipping zone is irrelevant — the warehouse-channel link alone determines
 * visibility.
 *
 * Renders nothing while the mode is loading or unavailable, to avoid
 * flashing the wrong copy. Apollo dedupes the query across mounts so the cost
 * of co-locating it here (instead of plumbing the flag through props) is one
 * tiny request per session.
 */
export const StockVisibilityHint = () => {
  const { data } = useStockVisibilityModeQuery({
    fetchPolicy: "cache-first",
  });

  const useLegacyShippingZoneStockAvailability = data?.shop?.useLegacyShippingZoneStockAvailability;

  if (useLegacyShippingZoneStockAvailability === undefined) {
    return null;
  }

  return (
    <Text size={2} color="default2" data-test-id="stock-visibility-hint">
      <FormattedMessage
        {...(useLegacyShippingZoneStockAvailability
          ? messages.stockVisibilityHintLegacy
          : messages.stockVisibilityHintDirect)}
      />
    </Text>
  );
};
