import { Box, Skeleton, Text, type TextProps } from "@saleor/macaw-ui-next";
import { Radio } from "lucide-react";
import { useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import styles from "./Channel.module.css";
import { messages } from "./messages";

type ChannelTextSize = NonNullable<TextProps["size"]>;

interface ChannelLike {
  id?: string;
  name: string;
  isActive?: boolean;
}

interface ChannelProps {
  /**
   * The channel to display. Pass `undefined` to render a skeleton placeholder while loading.
   */
  channel: ChannelLike | undefined;
  /**
   * Make the channel clickable by passing a target URL. The whole pill becomes
   * a router link styled to inherit the secondary color (no underline, no blue).
   * When omitted, the component renders as plain (non-interactive) text.
   *
   * Pick the destination per use-case:
   * - `orderListUrlWithChannel(order.channel)` to scope the orders list
   * - `channelUrl(channel.id)` to jump to channel settings (admin only)
   */
  href?: string;
  /**
   * Hide the leading channel icon.
   * @default false
   */
  hideIcon?: boolean;
  /**
   * Hide the `(Inactive)` suffix even when the channel is inactive.
   * @default false
   */
  hideInactiveStatus?: boolean;
  /**
   * Macaw text size token used for the label.
   * @default 2
   */
  size?: ChannelTextSize;
  /**
   * Macaw text color token used for the label.
   * @default "default2"
   */
  color?: TextProps["color"];
  /**
   * Optional override for the `data-test-id` attribute.
   * @default "channel-display"
   */
  "data-test-id"?: string;
}

const ICON_SIZE_BY_TEXT_SIZE: Record<ChannelTextSize, number> = {
  1: 12,
  2: 14,
  3: 14,
  4: 16,
  5: 18,
  6: 20,
  7: 24,
  8: 28,
  9: 32,
  10: 36,
  11: 40,
};

export const Channel = ({
  channel,
  href,
  hideIcon = false,
  hideInactiveStatus = false,
  size = 2,
  color = "default2",
  "data-test-id": dataTestId = "channel-display",
}: ChannelProps): JSX.Element => {
  const intl = useIntl();

  if (!channel) {
    return (
      <Box display="flex" alignItems="center" gap={1} data-test-id={dataTestId}>
        <Skeleton __width="6rem" __height="1rem" />
      </Box>
    );
  }

  const isInactive = channel.isActive === false;
  const iconSize = ICON_SIZE_BY_TEXT_SIZE[size];
  const ariaLabel = `${intl.formatMessage(messages.channelLabel)}: ${channel.name}`;

  const content = (
    <Text
      size={size}
      color={color}
      fontWeight="medium"
      display="flex"
      alignItems="center"
      gap={1}
      data-test-id={dataTestId}
      aria-label={ariaLabel}
    >
      {!hideIcon && <Radio size={iconSize} aria-hidden="true" />}
      <span className={styles.name} title={channel.name}>
        {channel.name}
      </span>
      {isInactive && !hideInactiveStatus && (
        <Text size={size} color="critical1" fontWeight="medium">
          ({intl.formatMessage(messages.inactive)})
        </Text>
      )}
    </Text>
  );

  if (href) {
    return (
      <RouterLink to={href} className={styles.link}>
        {content}
      </RouterLink>
    );
  }

  return content;
};
