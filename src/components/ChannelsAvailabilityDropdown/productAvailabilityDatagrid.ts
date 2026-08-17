import { statusCell } from "@dashboard/components/Datagrid/customCells/cells";
import { type GridCell } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

import { messages } from "./messages";
import { getProductAvailabilitySummary, type ProductChannelListing } from "./productUtils";

const COMMON_CELL_PROPS: Partial<GridCell> = { cursor: "pointer" };

export const getProductAvailabilityListingsForDisplay = (
  channelListings: ProductChannelListing[] | undefined | null,
  selectedChannel?: ProductChannelListing,
): ProductChannelListing[] => {
  if (selectedChannel) {
    return [selectedChannel];
  }

  return channelListings ?? [];
};

export const getProductAvailabilityCellDisplay = (
  listings: ProductChannelListing[],
  intl: IntlShape,
  dateNow = Date.now(),
) => {
  if (!listings.length) {
    return {
      dotStatus: "error" as const,
      label: intl.formatMessage(messages.noChannels),
    };
  }

  const summary = getProductAvailabilitySummary(listings, dateNow);

  return {
    dotStatus: summary.dotStatus,
    label: intl.formatMessage(summary.label, summary.labelValues),
    summary,
  };
};

export const getProductAvailabilityStatusCell = (
  listings: ProductChannelListing[],
  intl: IntlShape,
  dateNow = Date.now(),
) => {
  const display = getProductAvailabilityCellDisplay(listings, intl, dateNow);

  return statusCell(display.dotStatus, display.label, COMMON_CELL_PROPS);
};
