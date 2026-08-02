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
      {taxItem ? (
        <ChannelSection id={channelSectionIds.taxes}>
          <ChannelReviewShortcutPanel item={taxItem} data-test-id="channel-taxes-shortcut" />
        </ChannelSection>
      ) : null}
      {catalogItem ? (
        <ChannelSection id={channelSectionIds.catalog}>
          <ChannelReviewShortcutPanel item={catalogItem} data-test-id="channel-catalog-shortcut" />
        </ChannelSection>
      ) : null}
    </>
  );
};
