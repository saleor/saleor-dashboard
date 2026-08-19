import { ChannelDetailsLink, ChannelDisplay } from "@dashboard/components/Channel/Channel";
import { Box } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { ProductAvailabilityStatusLabel } from "./ProductAvailabilityStatusLabel";
import styles from "./ProductChannelsAvailability.module.css";
import {
  getProductAvailabilitySummary,
  type ProductAvailabilitySummary,
  type ProductChannelListing,
} from "./productUtils";

interface ProductChannelsAvailabilityTooltipProps {
  channels: ProductChannelListing[];
  summary?: ProductAvailabilitySummary;
  /**
   * When false, channel names are plain text (no links / nested browser tooltips).
   * Required for datagrid overlays so the tooltip never steals pointer events from the canvas.
   * @default true
   */
  interactive?: boolean;
}

export const ProductChannelsAvailabilityTooltip = ({
  channels,
  summary: summaryProp,
  interactive = true,
}: ProductChannelsAvailabilityTooltipProps) => {
  const intl = useIntl();
  const summary = summaryProp ?? getProductAvailabilitySummary(channels);

  return (
    <Box
      className={styles.tooltipBody}
      display="flex"
      flexDirection="column"
      gap={3}
      __maxWidth="320px"
    >
      {summary.channels.map(channel => (
        <Box key={channel.channel.id} display="flex" flexDirection="column" gap={1}>
          {interactive ? (
            <ChannelDetailsLink
              channel={channel.channel}
              size={2}
              color="default1"
              fontWeight="medium"
              hideIcon
              onClick={event => {
                event.stopPropagation();
              }}
            />
          ) : (
            <ChannelDisplay
              channel={channel.channel}
              size={2}
              color="default1"
              fontWeight="medium"
              hideIcon
            />
          )}
          <Box display="flex" flexDirection="column" gap={1}>
            {channel.statusDetails.map((detail, detailIndex) => (
              <ProductAvailabilityStatusLabel
                key={`${channel.channel.id}-${detail.description.id}-${detailIndex}`}
                label={intl.formatMessage(detail.description)}
                status={detail.dotStatus}
                color="default2"
                ellipsis={false}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

ProductChannelsAvailabilityTooltip.displayName = "ProductChannelsAvailabilityTooltip";
