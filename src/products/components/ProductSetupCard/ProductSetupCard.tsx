import { SetupChecklist } from "@dashboard/components/SetupChecklist/SetupChecklist";
import {
  type SetupChecklistReviewItem,
  type SetupChecklistTask,
} from "@dashboard/components/SetupChecklist/types";
import { Box, Button, Text, useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ArrowRight, FolderTree, Image, Search, Shapes, Store, Tag, Warehouse } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type ProductSetupReadiness } from "./getProductSetupReadiness";
import { messages } from "./messages";
import styles from "./ProductSetupCard.module.css";
import { scrollToProductSetupTarget } from "./scrollToProductSetupTarget";

interface ProductSetupCardProps {
  readiness: ProductSetupReadiness;
  disabled?: boolean;
  onDismiss?: () => void;
  onManageChannels: () => void;
  /** Opens channel setup for `setupChannelId`, or manage channels when unset. */
  onFinishChannelSetup: () => void;
  /** Sets published + available-for-purchase on listed channels (form draft). */
  onMakeAvailable: () => void;
  isShippingRequired: boolean;
  productAttributeCount?: number;
  variantAttributeCount?: number;
  onOpenProductType?: () => void;
}

const CtaLabel = ({ children }: { children: ReactNode }) => (
  <Box display="flex" alignItems="center" gap={1}>
    {children}
    <ArrowRight size={14} aria-hidden />
  </Box>
);

const taskStatus = (done: boolean, activeWhenPending: boolean): SetupChecklistTask["status"] => {
  if (done) {
    return "completed";
  }

  return activeWhenPending ? "active" : "pending";
};

export const ProductSetupCard = ({
  readiness,
  disabled,
  onDismiss,
  onManageChannels,
  onFinishChannelSetup,
  onMakeAvailable,
  isShippingRequired,
  productAttributeCount = 0,
  variantAttributeCount = 0,
  onOpenProductType,
}: ProductSetupCardProps) => {
  const intl = useIntl();
  const { theme } = useTheme();
  const {
    hasChannels,
    hasShopReadyChannel,
    hasCategory,
    hasVariants,
    hasOffer,
    hasStock,
    needsStock,
    isLive,
    channelCount,
    mediaCount,
    seoStatus,
    coreReady,
  } = readiness;

  const progressTotal = 4 + Number(needsStock);
  const progressDone =
    Number(hasShopReadyChannel) +
    Number(hasCategory) +
    Number(hasOffer) +
    (needsStock ? Number(hasStock) : 0) +
    Number(isLive);

  const channelActive = !hasShopReadyChannel;
  const categoryActive = hasShopReadyChannel && !hasCategory;
  const offerActive = hasShopReadyChannel && hasCategory && !hasOffer;
  const stockActive = needsStock && hasShopReadyChannel && hasCategory && hasOffer && !hasStock;
  const liveActive =
    hasShopReadyChannel && hasCategory && hasOffer && (!needsStock || hasStock) && !isLive;

  const tasks: SetupChecklistTask[] = [
    {
      id: "channel",
      title: <FormattedMessage {...messages.channelTitle} />,
      description: hasShopReadyChannel ? (
        <FormattedMessage {...messages.channelDone} values={{ count: channelCount }} />
      ) : !hasChannels ? (
        <FormattedMessage {...messages.channelDescriptionAssign} />
      ) : (
        <FormattedMessage
          {...messages.channelDescriptionSetup}
          values={{ shipping: isShippingRequired ? "true" : "false" }}
        />
      ),
      status: taskStatus(hasShopReadyChannel, channelActive),
      details: <FormattedMessage {...messages.channelDetails} />,
      detailsIcon: <Store size={16} />,
      action: !hasShopReadyChannel ? (
        <Button
          variant="primary"
          type="button"
          data-test-id="setup-product-channels"
          onClick={!hasChannels ? onManageChannels : onFinishChannelSetup}
          disabled={disabled}
        >
          <CtaLabel>
            <FormattedMessage
              {...(!hasChannels ? messages.channelAssignAction : messages.channelSetupAction)}
            />
          </CtaLabel>
        </Button>
      ) : undefined,
    },
    {
      id: "category",
      title: <FormattedMessage {...messages.categoryTitle} />,
      description: hasCategory ? (
        <FormattedMessage {...messages.categoryDone} />
      ) : (
        <FormattedMessage {...messages.categoryDescription} />
      ),
      status: taskStatus(hasCategory, categoryActive),
      details: <FormattedMessage {...messages.categoryDetails} />,
      detailsIcon: <FolderTree size={16} />,
      action: !hasCategory ? (
        <Button
          variant="primary"
          type="button"
          data-test-id="setup-product-category"
          onClick={() => scrollToProductSetupTarget("category")}
          disabled={disabled}
        >
          <CtaLabel>
            <FormattedMessage {...messages.categoryAction} />
          </CtaLabel>
        </Button>
      ) : undefined,
    },
    {
      id: "offer",
      title: (
        <FormattedMessage {...(hasVariants ? messages.offerTitle : messages.offerTitleVariants)} />
      ),
      description: hasOffer ? (
        <FormattedMessage {...messages.offerDone} />
      ) : hasVariants ? (
        <FormattedMessage {...messages.offerDescription} />
      ) : (
        <FormattedMessage {...messages.offerDescriptionVariants} />
      ),
      status: taskStatus(hasOffer, offerActive),
      details: <FormattedMessage {...messages.offerDetails} />,
      detailsIcon: <Tag size={16} />,
      action: !hasOffer ? (
        <Button
          variant="primary"
          type="button"
          data-test-id="setup-product-offer"
          onClick={() => scrollToProductSetupTarget("variants")}
          disabled={disabled}
        >
          <CtaLabel>
            <FormattedMessage
              {...(hasVariants ? messages.offerAction : messages.offerActionVariants)}
            />
          </CtaLabel>
        </Button>
      ) : undefined,
    },
  ];

  if (needsStock) {
    tasks.push({
      id: "stock",
      title: <FormattedMessage {...messages.stockTitle} />,
      description: hasStock ? (
        <FormattedMessage {...messages.stockDone} />
      ) : (
        <FormattedMessage {...messages.stockDescription} />
      ),
      status: taskStatus(hasStock, stockActive),
      details: <FormattedMessage {...messages.stockDetails} />,
      detailsIcon: <Warehouse size={16} />,
      action: !hasStock ? (
        <Button
          variant="primary"
          type="button"
          data-test-id="setup-product-stock"
          onClick={() => scrollToProductSetupTarget("variants")}
          disabled={disabled}
        >
          <CtaLabel>
            <FormattedMessage {...messages.stockAction} />
          </CtaLabel>
        </Button>
      ) : undefined,
    });
  }

  tasks.push({
    id: "live",
    title: <FormattedMessage {...messages.liveTitle} />,
    description: isLive ? (
      <FormattedMessage {...messages.liveDone} />
    ) : (
      <FormattedMessage {...messages.liveDescription} />
    ),
    status: taskStatus(isLive, liveActive),
    details: <FormattedMessage {...messages.liveDetails} />,
    detailsIcon: <Store size={16} />,
    // Only surface the primary CTA when this step is active — earlier blockers
    // already own the header action (matches voucher/channel checklist rhythm).
    action:
      !isLive && liveActive ? (
        <Button
          variant="primary"
          type="button"
          data-test-id="setup-product-make-available"
          onClick={onMakeAvailable}
          disabled={disabled}
        >
          <CtaLabel>
            <FormattedMessage {...messages.liveAction} />
          </CtaLabel>
        </Button>
      ) : undefined,
  });

  const attributeCount = productAttributeCount + variantAttributeCount;
  const handleAttributesReviewClick = () => {
    if (productAttributeCount > 0) {
      scrollToProductSetupTarget("attributes");

      return;
    }

    if (variantAttributeCount > 0) {
      scrollToProductSetupTarget("variants");

      return;
    }

    if (onOpenProductType) {
      onOpenProductType();
    }
  };

  const reviewItems: SetupChecklistReviewItem[] = [
    {
      id: "media",
      icon: <Image size={16} />,
      title: <FormattedMessage {...messages.mediaReviewTitle} />,
      description: <FormattedMessage {...messages.mediaReviewDescription} />,
      status: <FormattedMessage {...messages.mediaReviewStatus} values={{ count: mediaCount }} />,
      onClick: () => scrollToProductSetupTarget("media"),
      disabled,
    },
    {
      id: "attributes",
      icon: <Shapes size={16} />,
      title: <FormattedMessage {...messages.attributesReviewTitle} />,
      description: (
        <FormattedMessage
          {...(attributeCount > 0
            ? messages.attributesReviewDescriptionAssigned
            : messages.attributesReviewDescriptionEmpty)}
        />
      ),
      status:
        attributeCount > 0 ? (
          <FormattedMessage
            {...messages.attributesReviewStatusCount}
            values={{ count: attributeCount }}
          />
        ) : (
          <FormattedMessage {...messages.attributesReviewStatusNone} />
        ),
      onClick: handleAttributesReviewClick,
      disabled,
    },
    {
      id: "seo",
      icon: <Search size={16} />,
      title: <FormattedMessage {...messages.seoReviewTitle} />,
      description: <FormattedMessage {...messages.seoReviewDescription} />,
      status:
        seoStatus === "complete" ? (
          <FormattedMessage {...messages.seoReviewStatusComplete} />
        ) : seoStatus === "partial" ? (
          <FormattedMessage {...messages.seoReviewStatusPartial} />
        ) : (
          <FormattedMessage {...messages.seoReviewStatusEmpty} />
        ),
      onClick: () => scrollToProductSetupTarget("seo"),
      disabled,
    },
  ];

  const nextUpTask = !hasShopReadyChannel
    ? intl.formatMessage(messages.channelTitle)
    : !hasCategory
      ? intl.formatMessage(messages.categoryTitle)
      : !hasOffer
        ? intl.formatMessage(hasVariants ? messages.offerTitle : messages.offerTitleVariants)
        : needsStock && !hasStock
          ? intl.formatMessage(messages.stockTitle)
          : !isLive
            ? intl.formatMessage(messages.liveTitle)
            : null;

  return (
    <Box paddingX={6} paddingTop={6} marginBottom={10}>
      <SetupChecklist
        className={clsx(styles.elevated, theme === "defaultDark" && styles.elevatedDark)}
        data-test-id="product-setup-card"
        title={<FormattedMessage {...messages.title} />}
        subtitle={
          coreReady ? (
            <FormattedMessage {...messages.allDone} />
          ) : (
            <FormattedMessage {...messages.subtitle} />
          )
        }
        progress={{ done: progressDone, total: progressTotal }}
        tasksSection={{
          title: <FormattedMessage {...messages.tasksSectionTitle} />,
        }}
        tasks={tasks}
        reviewSection={{
          title: <FormattedMessage {...messages.reviewSectionTitle} />,
          subtitle: <FormattedMessage {...messages.reviewSectionSubtitle} />,
          items: reviewItems,
        }}
        nextUp={
          nextUpTask ? (
            <FormattedMessage
              {...messages.nextUp}
              values={{
                task: (
                  <Text as="span" size={2} fontWeight="medium" color="default1">
                    {nextUpTask}
                  </Text>
                ),
              }}
            />
          ) : (
            <FormattedMessage {...messages.nextUpDone} />
          )
        }
        footerActions={
          onDismiss ? (
            <Button
              variant="tertiary"
              type="button"
              onClick={onDismiss}
              disabled={disabled}
              data-test-id="setup-dismiss"
            >
              <FormattedMessage {...(coreReady ? messages.dismissComplete : messages.dismiss)} />
            </Button>
          ) : undefined
        }
      />
    </Box>
  );
};
