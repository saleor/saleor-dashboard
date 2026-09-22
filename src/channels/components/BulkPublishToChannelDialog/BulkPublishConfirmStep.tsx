import {
  type BulkPublishChannel,
  type BulkPublishDefaults,
  type BulkPublishWarehouse,
  type ProductPublishDraft,
  type PublishProgressItem,
} from "@dashboard/channels/components/BulkPublishToChannelDialog/types";
import { formatMoney, formatMoneyRange } from "@dashboard/components/Money";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Check, Circle, Loader2, X } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./BulkPublishConfirmStep.module.css";
import {
  type BulkPublishNumericRange,
  countBulkPublishDraftsKeepingPrice,
  countBulkPublishDraftsWithCostPrice,
  countBulkPublishDraftsWithStock,
  getBulkPublishCostPriceRange,
  getBulkPublishPriceRange,
  getBulkPublishProductNamePreview,
  getBulkPublishStockQuantityRange,
} from "./bulkPublishConfirmSummary";
import { countVariantsInDrafts } from "./bulkPublishDrafts";
import { getBulkPublishStockWarehouseName } from "./bulkPublishStockWarehouses";
import { messages } from "./messages";

interface BulkPublishConfirmStepProps {
  channel: BulkPublishChannel;
  channelWarehouses: BulkPublishWarehouse[];
  defaults: BulkPublishDefaults;
  productDrafts: ProductPublishDraft[];
  progress: PublishProgressItem[] | null;
}

interface SummarySectionProps {
  label: ReactNode;
  title?: ReactNode;
  detail?: ReactNode;
  children?: ReactNode;
}

const SummarySection = ({ label, title, detail, children }: SummarySectionProps) => (
  <Box className={styles.summarySection}>
    <Text className={styles.sectionLabel}>{label}</Text>
    {title ? (
      <Text className={styles.sectionTitle} size={3} fontWeight="medium">
        {title}
      </Text>
    ) : null}
    {detail ? (
      <Text className={styles.sectionDetail} size={2}>
        {detail}
      </Text>
    ) : null}
    {children}
  </Box>
);

const ProgressIcon = ({ status }: { status: PublishProgressItem["status"] }) => {
  if (status === "success") {
    return <Check aria-hidden size={16} />;
  }

  if (status === "error") {
    return <X aria-hidden size={16} />;
  }

  if (status === "in_progress") {
    return <Loader2 aria-hidden className={styles.spinner} size={16} />;
  }

  return <Circle aria-hidden size={16} />;
};

const formatBulkPublishMoneyRange = ({
  range,
  currency,
  locale,
}: {
  range: BulkPublishNumericRange;
  currency: string;
  locale: string;
}): string => {
  if (range.min === range.max) {
    return formatMoney({ amount: range.min, currency }, locale);
  }

  return formatMoneyRange({ amount: range.min, currency }, { amount: range.max, currency }, locale);
};

const VisibilityItem = ({ label }: { label: ReactNode }) => (
  <Box className={styles.visibilityItem}>
    <Box className={`${styles.visibilityIcon} ${styles.visibilityIconEnabled}`} aria-hidden>
      <Check size={16} />
    </Box>
    <Text size={2}>{label}</Text>
  </Box>
);

export const BulkPublishConfirmStep = ({
  channel,
  channelWarehouses,
  defaults,
  productDrafts,
  progress,
}: BulkPublishConfirmStepProps) => {
  const intl = useIntl();
  const locale = intl.locale;
  const variantCount = countVariantsInDrafts(productDrafts);
  const isPublishing = progress !== null;
  const priceRange = getBulkPublishPriceRange(productDrafts);
  const costPriceRange = getBulkPublishCostPriceRange(productDrafts);
  const costPricesCount = countBulkPublishDraftsWithCostPrice(productDrafts);
  const keepingPriceCount = countBulkPublishDraftsKeepingPrice(productDrafts);
  const stockQuantityRange = getBulkPublishStockQuantityRange(productDrafts);
  const productsWithStockCount = countBulkPublishDraftsWithStock(productDrafts);
  const { previewNames, remainingCount } = getBulkPublishProductNamePreview(productDrafts);
  const stockWarehouseName = getBulkPublishStockWarehouseName({
    channelWarehouses,
    stock: defaults.stock,
  });

  if (isPublishing) {
    return (
      <Box display="flex" flexDirection="column" gap={4}>
        <Text size={3} color="default2">
          <FormattedMessage {...messages.publishingDescription} />
        </Text>
        <Box className={styles.list} display="flex" flexDirection="column" gap={2}>
          {progress.map(item => (
            <Box key={item.productId} className={styles.progressRow} display="flex" gap={3}>
              <Box className={styles.icon} data-status={item.status}>
                <ProgressIcon status={item.status} />
              </Box>
              <Box className={styles.progressContent}>
                <Text>{item.name}</Text>
                {item.status === "error" && item.errorMessage ? (
                  <Text size={2} className={styles.progressError}>
                    {item.errorMessage}
                  </Text>
                ) : null}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  const productNamesDetail =
    remainingCount > 0 ? (
      <FormattedMessage
        {...messages.confirmProductNamesWithMore}
        values={{ previewNames, remainingCount }}
      />
    ) : (
      previewNames
    );

  // Keeping existing prices is the headline for a partial update, so it outranks cost-price detail.
  const pricingDetail =
    keepingPriceCount > 0 ? (
      <FormattedMessage
        {...messages.confirmPricesUnchanged}
        values={{ count: keepingPriceCount }}
      />
    ) : costPricesCount === 0 ? (
      <FormattedMessage {...messages.confirmNoCostPrices} />
    ) : costPricesCount < productDrafts.length ? (
      <FormattedMessage
        {...messages.confirmPartialCostPrices}
        values={{ count: costPricesCount }}
      />
    ) : costPriceRange ? (
      formatBulkPublishMoneyRange({
        range: costPriceRange,
        currency: channel.currencyCode,
        locale,
      })
    ) : (
      <FormattedMessage {...messages.confirmNoCostPrices} />
    );

  const stockTitle = (() => {
    if (!defaults.stock.enabled) {
      return <FormattedMessage {...messages.confirmStockSkippedTitle} />;
    }

    if (!stockQuantityRange) {
      return <FormattedMessage {...messages.confirmStockEnabledNoneTitle} />;
    }

    if (stockQuantityRange.min === stockQuantityRange.max) {
      return (
        <FormattedMessage
          {...messages.confirmStockQuantitySingle}
          values={{ quantity: stockQuantityRange.min }}
        />
      );
    }

    return (
      <FormattedMessage
        {...messages.confirmStockQuantityRange}
        values={{
          min: stockQuantityRange.min,
          max: stockQuantityRange.max,
        }}
      />
    );
  })();

  const stockDetail = (() => {
    if (!defaults.stock.enabled) {
      return <FormattedMessage {...messages.confirmStockSkippedDetail} />;
    }

    if (!stockQuantityRange) {
      return <FormattedMessage {...messages.confirmStockEnabledNoneDetail} />;
    }

    if (stockWarehouseName) {
      return (
        <FormattedMessage
          {...messages.confirmStockWarehouseSingle}
          values={{
            productCount: productsWithStockCount,
            warehouseName: stockWarehouseName,
          }}
        />
      );
    }

    return (
      <FormattedMessage
        {...messages.confirmStockWarehouseAll}
        values={{ productCount: productsWithStockCount }}
      />
    );
  })();

  const visibilityDetail = (() => {
    if (defaults.isPublished && defaults.visibleInListings && defaults.isAvailableForPurchase) {
      return <FormattedMessage {...messages.confirmVisibilityAllEnabled} />;
    }

    if (!defaults.isPublished) {
      return <FormattedMessage {...messages.confirmVisibilityNotPublished} />;
    }

    if (!defaults.isAvailableForPurchase) {
      return <FormattedMessage {...messages.confirmVisibilityNotAvailable} />;
    }

    return <FormattedMessage {...messages.confirmVisibilityHiddenFromListings} />;
  })();

  return (
    <Box className={styles.step}>
      <Text size={3} color="default2">
        <FormattedMessage
          {...messages.confirmIntro}
          values={{
            channelName: channel.name,
            strong: chunks => <strong>{chunks}</strong>,
          }}
        />
      </Text>
      <Box className={styles.summaryCard}>
        <SummarySection
          label={<FormattedMessage {...messages.confirmSectionProducts} />}
          title={
            <FormattedMessage
              {...messages.summary}
              values={{ productCount: productDrafts.length, variantCount }}
            />
          }
          detail={productNamesDetail}
        />
        <SummarySection
          label={<FormattedMessage {...messages.confirmSectionPricing} />}
          title={
            priceRange ? (
              formatBulkPublishMoneyRange({
                range: priceRange,
                currency: channel.currencyCode,
                locale,
              })
            ) : (
              <FormattedMessage {...messages.confirmNoPriceChanges} />
            )
          }
          detail={pricingDetail}
        />
        <SummarySection
          label={<FormattedMessage {...messages.confirmSectionStock} />}
          title={stockTitle}
          detail={stockDetail}
        />
        <SummarySection label={<FormattedMessage {...messages.confirmSectionVisibility} />}>
          <Box className={styles.visibilityList}>
            {defaults.isPublished ? (
              <VisibilityItem
                label={<FormattedMessage {...messages.confirmVisibilityPublished} />}
              />
            ) : null}
            {defaults.visibleInListings ? (
              <VisibilityItem label={<FormattedMessage {...messages.visibleInListings} />} />
            ) : null}
            {defaults.isAvailableForPurchase ? (
              <VisibilityItem label={<FormattedMessage {...messages.availableForPurchase} />} />
            ) : null}
          </Box>
          <Text className={styles.sectionDetail} size={2}>
            {visibilityDetail}
          </Text>
        </SummarySection>
      </Box>
    </Box>
  );
};
