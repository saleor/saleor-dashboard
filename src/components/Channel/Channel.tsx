import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { channelUrl } from "@dashboard/channels/urls";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { orderListUrlWithChannel } from "@dashboard/orders/urls";
import { Box, Skeleton, Text, type TextProps } from "@saleor/macaw-ui-next";
import { Globe } from "lucide-react";
import { useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import styles from "./Channel.module.css";
import { messages } from "./messages";

type ChannelTextSize = NonNullable<TextProps["size"]>;

interface ChannelLike {
  id?: string;
  name: string;
  slug?: string;
  isActive?: boolean;
}

interface ChannelProps {
  /**
   * The channel to display. Pass `undefined` to render a skeleton placeholder while loading.
   */
  channel: ChannelLike | undefined;
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
   * Macaw font weight token used for the channel name.
   * @default "medium"
   */
  fontWeight?: TextProps["fontWeight"];
  /**
   * Render inline for embedding in headings or sentences.
   * @default false
   */
  inline?: boolean;
  /**
   * Optional override for the `data-test-id` attribute.
   * @default "channel-display"
   */
  "data-test-id"?: string;
  /**
   * Native hover tooltip for the channel name.
   * @default channel.name
   */
  title?: string;
}

interface ChannelLinkProps extends ChannelProps {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
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

export const ChannelDisplay = ({
  channel,
  hideIcon = false,
  hideInactiveStatus = false,
  size = 2,
  color = "default2",
  fontWeight = "medium",
  inline = false,
  "data-test-id": dataTestId = "channel-display",
  title,
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
  const nameTitle = title ?? channel.name;

  const content = (
    <Text
      size={size}
      color={color}
      fontWeight={fontWeight}
      display={inline ? "inline" : "flex"}
      alignItems={inline ? undefined : "center"}
      gap={inline ? undefined : 1}
      data-test-id={dataTestId}
      aria-label={ariaLabel}
    >
      {!hideIcon && (
        <Globe
          size={iconSize}
          aria-hidden="true"
          className={inline ? styles.inlineIcon : undefined}
        />
      )}
      <span className={inline ? styles.inlineName : styles.name} title={nameTitle}>
        {channel.name}
      </span>
      {isInactive && !hideInactiveStatus && (
        <Text size={size} color="default2" fontWeight="regular">
          ({intl.formatMessage(messages.inactive)})
        </Text>
      )}
    </Text>
  );

  return content;
};

export const ClickableChannel = (props: ChannelLinkProps): JSX.Element => {
  const { channel } = props;
  const intl = useIntl();
  const userPermissions = useUserPermissions();
  const canViewChannelOrders = hasPermissions(userPermissions ?? [], [
    PermissionEnum.MANAGE_ORDERS,
  ]);

  if (!channel?.id || !channel.slug || !canViewChannelOrders) {
    return <ChannelDisplay {...props} />;
  }

  const orderListChannel = {
    id: channel.id,
    name: channel.name,
    slug: channel.slug,
  };
  const linkLabel = intl.formatMessage(messages.viewOrdersFromChannel, {
    channelName: channel.name,
  });

  return (
    <RouterLink
      to={orderListUrlWithChannel(orderListChannel)}
      className={styles.link}
      title={linkLabel}
      aria-label={linkLabel}
    >
      <ChannelDisplay {...props} title={linkLabel} />
    </RouterLink>
  );
};

export const ChannelDetailsLink = ({ onClick, ...props }: ChannelLinkProps): JSX.Element => {
  const { channel } = props;
  const intl = useIntl();

  if (!channel?.id) {
    return <ChannelDisplay {...props} />;
  }

  const linkLabel = intl.formatMessage(messages.viewChannelDetails, {
    channelName: channel.name,
  });

  return (
    <RouterLink
      to={channelUrl(channel.id)}
      className={styles.detailsLink}
      title={linkLabel}
      aria-label={linkLabel}
      onClick={onClick}
    >
      <ChannelDisplay {...props} title={linkLabel} />
    </RouterLink>
  );
};
