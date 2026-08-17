import { Box, Tooltip } from "@saleor/macaw-ui-next";
import { memo, useMemo } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { ProductAvailabilityStatusLabel } from "./ProductAvailabilityStatusLabel";
import styles from "./ProductChannelsAvailability.module.css";
import { ProductChannelsAvailabilityTooltip } from "./ProductChannelsAvailabilityTooltip";
import { getProductAvailabilitySummary, type ProductChannelListing } from "./productUtils";

interface ProductChannelsAvailabilityProps {
  channels: ProductChannelListing[] | null;
}

export const ProductChannelsAvailability = memo(
  ({ channels }: ProductChannelsAvailabilityProps) => {
    const intl = useIntl();
    const summary = useMemo(
      () => (channels?.length ? getProductAvailabilitySummary(channels) : null),
      [channels],
    );

    if (!channels?.length || !summary) {
      return (
        <ProductAvailabilityStatusLabel
          label={intl.formatMessage(messages.noChannels)}
          status="error"
        />
      );
    }

    const statusLabel = intl.formatMessage(summary.label, summary.labelValues);

    return (
      <Tooltip>
        <Tooltip.Trigger>
          <Box
            display="inline-flex"
            minWidth={0}
            maxWidth="100%"
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <ProductAvailabilityStatusLabel label={statusLabel} status={summary.dotStatus} />
          </Box>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="left"
          align="center"
          sideOffset={4}
          className={styles.tooltipContent}
        >
          <Tooltip.Arrow />
          <ProductChannelsAvailabilityTooltip channels={channels} summary={summary} />
        </Tooltip.Content>
      </Tooltip>
    );
  },
);

ProductChannelsAvailability.displayName = "ProductChannelsAvailability";
