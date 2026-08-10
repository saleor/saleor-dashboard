import { ChannelDetailsLink, ChannelDisplay } from "@dashboard/components/Channel/Channel";
import { CopyableText } from "@dashboard/components/CopyableText/CopyableText";
import { EmptyImage } from "@dashboard/components/EmptyImage";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Link } from "@dashboard/components/Link";
import { type GiftCardDetailsQuery } from "@dashboard/graphql";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import { productUrl } from "@dashboard/products/urls";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { AppWindow, Mail, Package, User, UserRoundCog } from "lucide-react";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { type ExtendedGiftCard } from "../providers/GiftCardDetailsProvider/types";
import {
  getGiftCardProvenanceActor,
  getGiftCardProvenanceOrder,
  type GiftCardProvenanceActorIcon,
} from "./getGiftCardProvenanceFields";
import styles from "./GiftCardProvenanceCard.module.css";
import { giftCardProvenanceCardMessages as messages } from "./messages";

const actorIcons: Record<GiftCardProvenanceActorIcon, ReactNode> = {
  user: <User size={iconSize.small} strokeWidth={iconStrokeWidth} />,
  mail: <Mail size={iconSize.small} strokeWidth={iconStrokeWidth} />,
  app: <AppWindow size={iconSize.small} strokeWidth={iconStrokeWidth} />,
  staff: <UserRoundCog size={iconSize.small} strokeWidth={iconStrokeWidth} />,
};

type GiftCardDetails = NonNullable<GiftCardDetailsQuery["giftCard"]>;

interface ChannelLike {
  id?: string;
  name: string;
  slug?: string;
  isActive?: boolean;
}

export interface GiftCardProvenanceCardViewProps {
  giftCard: ExtendedGiftCard<GiftCardDetails> | undefined;
  loading?: boolean;
  /** Resolved channel for `boughtInChannel` slug, when available. */
  channel?: ChannelLike | null;
}

export const GiftCardProvenanceCardView = ({
  giftCard,
  loading = false,
  channel = null,
}: GiftCardProvenanceCardViewProps): JSX.Element => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  if (loading || !giftCard) {
    return (
      <Box className={styles.card} data-test-id="gift-card-provenance-card">
        <Box className={styles.header}>
          <Text size={5} fontWeight="bold" as="h2">
            {intl.formatMessage(messages.title)}
          </Text>
        </Box>
        <Box className={styles.content}>
          <Skeleton />
        </Box>
      </Box>
    );
  }

  const { created, product, boughtInChannel } = giftCard;
  const actor = getGiftCardProvenanceActor(giftCard);
  const orderData = getGiftCardProvenanceOrder(giftCard);
  const hasPurchaseContext = Boolean(boughtInChannel || orderData);
  const channelLabel = channel?.name ?? boughtInChannel;

  return (
    <Box className={styles.card} data-test-id="gift-card-provenance-card">
      <Box className={styles.header}>
        <Text size={5} fontWeight="bold" as="h2">
          {intl.formatMessage(messages.title)}
        </Text>
      </Box>
      <Box className={styles.content}>
        <Box className={styles.field}>
          <Text size={2} color="default2">
            {intl.formatMessage(messages.creationLabel)}
          </Text>
          <Text size={3}>{localizeDate(created, "lll")}</Text>
        </Box>

        {product ? (
          <Box className={styles.field}>
            <Text size={2} color="default2">
              {intl.formatMessage(messages.productLabel)}
            </Text>
            <Link
              href={productUrl(product.id)}
              color="secondary"
              inline={false}
              className={styles.productRow}
            >
              <Box className={styles.productThumb}>
                {product.thumbnail?.url ? (
                  <Box
                    as="img"
                    src={product.thumbnail.url}
                    alt=""
                    className={styles.productThumbImg}
                  />
                ) : (
                  <EmptyImage />
                )}
              </Box>
              <Text size={3} ellipsis className={styles.productName}>
                {product.name}
              </Text>
            </Link>
          </Box>
        ) : null}

        {hasPurchaseContext ? (
          <Box className={styles.field}>
            <Text size={2} color="default2">
              {intl.formatMessage(messages.purchaseLabel)}
            </Text>
            <Box className={styles.valueRow} data-test-id="gift-card-purchase-context">
              <Box className={styles.leadingIcon} aria-hidden>
                <Package size={iconSize.small} strokeWidth={iconStrokeWidth} />
              </Box>
              <Box className={styles.valueContent}>
                <Box className={styles.purchaseLine}>
                  {channel?.id ? (
                    <ChannelDetailsLink
                      channel={channel}
                      size={3}
                      color="default1"
                      fontWeight="regular"
                      hideInactiveStatus
                      hideIcon
                    />
                  ) : channelLabel ? (
                    <ChannelDisplay
                      channel={{ name: channelLabel }}
                      size={3}
                      color="default1"
                      fontWeight="regular"
                      hideInactiveStatus
                      hideIcon
                    />
                  ) : null}
                  {channelLabel && orderData ? (
                    <Text size={3} className={styles.purchaseSeparator} aria-hidden>
                      /
                    </Text>
                  ) : null}
                  {orderData ? (
                    <Link href={orderData.link} color="secondary">
                      <Text size={3} as="span">
                        {orderData.text}
                      </Text>
                    </Link>
                  ) : null}
                </Box>
              </Box>
            </Box>
          </Box>
        ) : null}

        <Box className={styles.field}>
          <Text size={2} color="default2">
            {intl.formatMessage(actor.label)}
          </Text>
          <Box className={styles.valueRow} data-test-id="gift-card-provenance-actor">
            <Box className={styles.leadingIcon} aria-hidden>
              {actorIcons[actor.icon]}
            </Box>
            <Box className={styles.valueContent}>
              {actor.url && actor.copyText ? (
                <CopyableText text={actor.copyText}>
                  <Link href={actor.url} color="secondary">
                    <Text size={3} as="span">
                      {actor.name}
                    </Text>
                  </Link>
                </CopyableText>
              ) : actor.url ? (
                <Link href={actor.url} color="secondary">
                  <Text size={3} as="span">
                    {actor.name}
                  </Text>
                </Link>
              ) : actor.copyText ? (
                <CopyableText text={actor.copyText}>
                  <Text size={3}>{actor.name}</Text>
                </CopyableText>
              ) : (
                <Text size={3}>{actor.name}</Text>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
