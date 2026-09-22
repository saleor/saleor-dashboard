import {
  BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT,
  type ProductPublishDraft,
} from "@dashboard/channels/components/BulkPublishToChannelDialog/types";
import { formatMoney, formatMoneyRange } from "@dashboard/components/Money";
import { PriceFieldV2 } from "@dashboard/components/PriceFieldV2/PriceFieldV2";
import { Box, Chip, Input, Text, Tooltip } from "@saleor/macaw-ui-next";
import { type ClipboardEvent, memo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { hasBulkPublishPrice } from "./bulkPublishDrafts";
import styles from "./BulkPublishReviewStep.module.css";
import { type BulkPublishPasteField } from "./bulkPublishSpreadsheetPaste";
import { messages } from "./messages";

export type BulkPublishReviewField = Extract<
  BulkPublishPasteField,
  "price" | "costPrice" | "stock"
>;

interface BulkPublishReviewRowProps {
  draft: ProductPublishDraft;
  productIndex: number;
  currency: string;
  showStock: boolean;
  fieldGroupClassName: string;
  onFieldChange: (productId: string, field: BulkPublishReviewField, value: string) => void;
  onFieldPaste: (
    event: ClipboardEvent<HTMLElement>,
    productIndex: number,
    field: BulkPublishReviewField,
  ) => void;
}

/**
 * Memoized so editing one row doesn't re-render the other 49 — the wizard caps selection at 50
 * products and every row holds up to three controlled inputs.
 */
export const BulkPublishReviewRow = memo(
  ({
    draft,
    productIndex,
    currency,
    showStock,
    fieldGroupClassName,
    onFieldChange,
    onFieldPaste,
  }: BulkPublishReviewRowProps) => {
    const intl = useIntl();
    const { currentListing } = draft;
    const currentPrice = currentListing?.price;
    const willChangePrice = hasBulkPublishPrice(draft.price);
    const pricePlaceholder = currentPrice
      ? currentPrice.isMixed
        ? formatMoneyRange(
            { amount: currentPrice.min, currency },
            { amount: currentPrice.max, currency },
            intl.locale,
          )
        : formatMoney({ amount: currentPrice.min, currency }, intl.locale)
      : draft.alreadyInChannel
        ? intl.formatMessage(messages.reviewPriceUnchangedPlaceholder)
        : undefined;
    // A blank price cannot create a listing, so these variants stay unsellable unless one is set.
    const staleUnlistedVariantCount =
      !willChangePrice && currentListing ? currentListing.unlistedVariantCount : 0;

    return (
      <Box className={styles.row} data-price-changed={willChangePrice ? "true" : undefined}>
        <Box className={styles.rowMain}>
          <Text size={3} fontWeight="medium">
            {draft.name}
          </Text>
          <Box className={styles.rowMeta}>
            <Text size={2} color="default2">
              <FormattedMessage {...messages.variantCount} values={{ count: draft.variantCount }} />
            </Text>
            {draft.alreadyInChannel ? (
              <Tooltip>
                <Tooltip.Trigger>
                  <span>
                    <Chip size="small">
                      <FormattedMessage {...messages.alreadyInChannel} />
                    </Chip>
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Content side="top">
                  <Tooltip.Arrow />
                  <FormattedMessage
                    {...messages.alreadyInChannelTooltip}
                    values={{ hasStock: showStock }}
                  />
                </Tooltip.Content>
              </Tooltip>
            ) : null}
            {draft.hasManyVariants && !draft.exceedsVariantLimit ? (
              <Chip size="small">
                <FormattedMessage {...messages.productManyVariants} />
              </Chip>
            ) : null}
            {draft.exceedsVariantLimit ? (
              <Chip size="small">
                <FormattedMessage
                  {...messages.productExceedsVariantLimit}
                  values={{ max: BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT }}
                />
              </Chip>
            ) : null}
            {!draft.hasCategory ? (
              <Chip size="small">
                <FormattedMessage {...messages.productMissingCategory} />
              </Chip>
            ) : null}
          </Box>
          {currentPrice?.isMixed && willChangePrice ? (
            <Text size={1} className={styles.rowWarning}>
              <FormattedMessage
                {...messages.reviewPriceOverwritesMixed}
                values={{ count: currentListing?.listedVariantCount ?? 0 }}
              />
            </Text>
          ) : null}
          {staleUnlistedVariantCount > 0 ? (
            <Text size={1} className={styles.rowWarning}>
              <FormattedMessage
                {...messages.reviewVariantsStayUnlisted}
                values={{ count: staleUnlistedVariantCount }}
              />
            </Text>
          ) : null}
        </Box>
        <Box className={fieldGroupClassName}>
          <div
            className={styles.inputCell}
            onPasteCapture={event => onFieldPaste(event, productIndex, "price")}
          >
            <PriceFieldV2
              aria-label={intl.formatMessage(messages.productPrice)}
              size="small"
              currencySymbol={currency}
              placeholder={pricePlaceholder}
              value={draft.price}
              onChange={price => onFieldChange(draft.productId, "price", price)}
            />
          </div>
          <div
            className={styles.inputCell}
            onPasteCapture={event => onFieldPaste(event, productIndex, "costPrice")}
          >
            <PriceFieldV2
              aria-label={intl.formatMessage(messages.productCostPrice)}
              size="small"
              currencySymbol={currency}
              placeholder={
                draft.alreadyInChannel
                  ? intl.formatMessage(messages.reviewPriceUnchangedPlaceholder)
                  : undefined
              }
              value={draft.costPrice}
              onChange={costPrice => onFieldChange(draft.productId, "costPrice", costPrice)}
            />
          </div>
          {showStock ? (
            <div
              className={styles.inputCell}
              onPasteCapture={event => onFieldPaste(event, productIndex, "stock")}
            >
              <Input
                aria-label={intl.formatMessage(messages.productStock)}
                size="small"
                type="text"
                inputMode="numeric"
                value={draft.stock}
                onChange={event => onFieldChange(draft.productId, "stock", event.target.value)}
              />
            </div>
          ) : null}
        </Box>
      </Box>
    );
  },
);

BulkPublishReviewRow.displayName = "BulkPublishReviewRow";
