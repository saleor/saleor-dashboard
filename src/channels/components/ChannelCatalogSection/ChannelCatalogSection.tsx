import { getCatalogWarehouseReadiness } from "@dashboard/channels/utils/catalogWarehouseReadiness";
import { formatCatalogCount } from "@dashboard/channels/utils/formatCatalogCount";
import {
  type ChannelCatalogFilterChannel,
  productListUrlWithChannelCatalogFilters,
} from "@dashboard/channels/utils/productListCatalogUrls";
import {
  DetailSettingsCard,
  DetailSettingsCardIntro,
} from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { SetupChecklistReviewList } from "@dashboard/components/SetupChecklist/SetupChecklistReviewList";
import { type SetupChecklistReviewItem } from "@dashboard/components/SetupChecklist/types";
import { ProductsIcon } from "@dashboard/icons/Products";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Eye, Plus } from "lucide-react";
import { useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  type CatalogProductThumbnail,
  CatalogProductThumbnailStack,
} from "./CatalogProductThumbnailStack";
import styles from "./ChannelCatalogSection.module.css";
import { messages } from "./messages";

interface ChannelCatalogSectionProps {
  channel: ChannelCatalogFilterChannel & { currencyCode: string };
  publishedProductCount?: number;
  unpublishedProductCount?: number;
  listedInChannelCount?: number;
  totalProductCount?: number;
  recentlyPublishedProducts?: CatalogProductThumbnail[];
  channelWarehouseCount?: number;
  shopWarehouseCount?: number;
  canViewCatalogStats?: boolean;
  catalogStatsError?: boolean;
  loading?: boolean;
  onBulkPublishCatalog?: () => void;
}

export const ChannelCatalogSection = ({
  channel,
  publishedProductCount,
  unpublishedProductCount,
  listedInChannelCount,
  totalProductCount,
  channelWarehouseCount = 0,
  shopWarehouseCount = 0,
  recentlyPublishedProducts,
  canViewCatalogStats = true,
  catalogStatsError = false,
  loading = false,
  onBulkPublishCatalog,
}: ChannelCatalogSectionProps) => {
  const intl = useIntl();
  const warehouseReadiness = getCatalogWarehouseReadiness({
    channelWarehouseCount,
    shopWarehouseCount,
  });
  const stats = useMemo(
    () =>
      publishedProductCount !== undefined &&
      unpublishedProductCount !== undefined &&
      listedInChannelCount !== undefined &&
      totalProductCount !== undefined
        ? {
            published: publishedProductCount,
            unpublished: unpublishedProductCount,
            total: totalProductCount,
            // The two counts come from separate queries, so a stale pair could go negative.
            notInChannel: Math.max(totalProductCount - listedInChannelCount, 0),
          }
        : undefined,
    [publishedProductCount, unpublishedProductCount, listedInChannelCount, totalProductCount],
  );
  const hasListedProducts = (listedInChannelCount ?? 0) > 0;

  const openChannelProductList = useCallback(
    (isPublished: boolean) => {
      // New tab keeps channel details open and avoids SPA filter-state races.
      window.open(
        productListUrlWithChannelCatalogFilters({ channel, isPublished }),
        "_blank",
        "noopener,noreferrer",
      );
    },
    [channel],
  );

  const catalogActions = useMemo((): SetupChecklistReviewItem[] => {
    const items: SetupChecklistReviewItem[] = [
      {
        id: "add",
        icon: <Plus size={16} />,
        iconVariant: "accent",
        title: <FormattedMessage {...messages.addProducts} />,
        description: <FormattedMessage {...messages.addProductsDescription} />,
        status: stats ? (
          <FormattedMessage
            {...messages.notInChannelStatus}
            values={{
              count: formatCatalogCount(stats.notInChannel, intl.locale),
            }}
          />
        ) : undefined,
        onClick: () => onBulkPublishCatalog?.(),
        disabled: !onBulkPublishCatalog,
      },
    ];

    if (hasListedProducts) {
      items.push({
        id: "unpublished",
        icon: <Eye size={16} />,
        title: <FormattedMessage {...messages.reviewUnpublished} />,
        description: <FormattedMessage {...messages.reviewUnpublishedDescription} />,
        status: stats ? (
          <FormattedMessage
            {...messages.unpublishedStatus}
            values={{
              count: formatCatalogCount(stats.unpublished, intl.locale),
            }}
          />
        ) : undefined,
        onClick: () => openChannelProductList(false),
      });
      items.push({
        id: "published",
        icon: <ProductsIcon />,
        title: <FormattedMessage {...messages.viewPublished} />,
        description: <FormattedMessage {...messages.viewPublishedDescription} />,
        status: stats ? (
          <FormattedMessage
            {...messages.publishedStatus}
            values={{
              count: formatCatalogCount(stats.published, intl.locale),
            }}
          />
        ) : undefined,
        onClick: () => openChannelProductList(true),
      });
    }

    return items;
  }, [hasListedProducts, stats, onBulkPublishCatalog, openChannelProductList, intl.locale]);

  return (
    <DetailSettingsCard
      data-test-id="channel-catalog"
      title={intl.formatMessage(messages.title)}
      contentFlush
    >
      <DetailSettingsCardIntro>
        <Text size={3} color="default2">
          {catalogStatsError ? (
            <FormattedMessage {...messages.catalogStatsError} />
          ) : stats ? (
            <FormattedMessage
              {...messages.subtitle}
              values={{
                currency: channel.currencyCode,
                total: stats.total,
              }}
            />
          ) : loading && canViewCatalogStats ? (
            <Skeleton __width="100%" __height="1.25rem" />
          ) : (
            <FormattedMessage
              {...messages.subtitleWithoutStats}
              values={{ currency: channel.currencyCode }}
            />
          )}
        </Text>
      </DetailSettingsCardIntro>
      {warehouseReadiness === "no_shop_warehouses" ? (
        <DetailSettingsCardIntro>
          <Text size={3} color="default2">
            <FormattedMessage {...messages.warehouseNoteNoShop} />
          </Text>
        </DetailSettingsCardIntro>
      ) : null}
      {warehouseReadiness === "no_channel_warehouses" ? (
        <DetailSettingsCardIntro>
          <Text size={3} color="default2">
            <FormattedMessage {...messages.warehouseNoteNoChannel} />
          </Text>
        </DetailSettingsCardIntro>
      ) : null}
      {loading ? (
        <Box className={styles.emptyContent} display="flex" flexDirection="column" gap={3}>
          <Skeleton __height="3rem" />
          <Skeleton __height="3.5rem" />
          <Skeleton __height="3.5rem" />
        </Box>
      ) : (
        <>
          {stats ? (
            <Box className={styles.stats}>
              <Box display="flex" flexDirection="column" gap={1}>
                <Text size={2} color="default2">
                  <FormattedMessage {...messages.publishedStat} />
                </Text>
                <Box className={styles.publishedStatRow}>
                  <Text size={4} fontWeight="medium" className={styles.statValue}>
                    {formatCatalogCount(stats.published, intl.locale)}
                  </Text>
                  <CatalogProductThumbnailStack products={recentlyPublishedProducts ?? []} />
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Text size={2} color="default2">
                  <FormattedMessage {...messages.unpublishedStat} />
                </Text>
                <Text size={4} fontWeight="medium" className={styles.statValue}>
                  {formatCatalogCount(stats.unpublished, intl.locale)}
                </Text>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Text size={2} color="default2">
                  <FormattedMessage {...messages.notInChannelStat} />
                </Text>
                <Text size={4} fontWeight="medium" className={styles.statValue}>
                  {formatCatalogCount(stats.notInChannel, intl.locale)}
                </Text>
              </Box>
            </Box>
          ) : null}
          <SetupChecklistReviewList items={catalogActions} data-test-id="catalog-action" />
        </>
      )}
    </DetailSettingsCard>
  );
};
