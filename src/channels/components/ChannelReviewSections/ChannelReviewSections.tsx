import { ChannelCatalogSection } from "@dashboard/channels/components/ChannelCatalogSection/ChannelCatalogSection";
import { ChannelReviewShortcutPanel } from "@dashboard/channels/components/ChannelReviewShortcutPanel/ChannelReviewShortcutPanel";
import { channelSectionIds } from "@dashboard/channels/components/ChannelSectionNav/channelSectionIds";
import { ChannelSection } from "@dashboard/channels/components/ChannelSectionNav/ChannelSectionNav";
import {
  useChannelReviewItems,
  type UseChannelReviewItemsArgs,
} from "@dashboard/channels/hooks/useChannelReviewItems";

export const ChannelReviewSections = (props: UseChannelReviewItemsArgs) => {
  const reviewItems = useChannelReviewItems({ ...props, interaction: "navigate" });
  const taxItem = reviewItems.find(item => item.id === "tax");
  const catalogItem = reviewItems.find(item => item.id === "catalog");

  return (
    <>
      {catalogItem && props.channel ? (
        <ChannelSection id={channelSectionIds.catalog}>
          <ChannelCatalogSection
            channel={props.channel}
            publishedProductCount={props.publishedProductCount}
            unpublishedProductCount={props.unpublishedProductCount}
            listedInChannelCount={props.listedInChannelCount}
            totalProductCount={props.totalProductCount}
            channelWarehouseCount={props.channelWarehouseCount}
            shopWarehouseCount={props.shopWarehouseCount}
            recentlyPublishedProducts={props.recentlyPublishedProducts}
            canViewCatalogStats={props.canViewCatalogStats}
            catalogStatsError={props.catalogStatsError}
            loading={props.catalogStatsLoading}
            onBulkPublishCatalog={props.onBulkPublishCatalog}
          />
        </ChannelSection>
      ) : null}
      {taxItem ? (
        <ChannelSection id={channelSectionIds.taxes}>
          <ChannelReviewShortcutPanel item={taxItem} data-test-id="channel-taxes-shortcut" />
        </ChannelSection>
      ) : null}
    </>
  );
};
