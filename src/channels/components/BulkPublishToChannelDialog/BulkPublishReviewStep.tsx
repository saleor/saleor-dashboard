import {
  BULK_PUBLISH_MANY_VARIANTS_THRESHOLD,
  BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT,
  type BulkPublishChannel,
  type BulkPublishDefaults,
  type ProductPublishDraft,
} from "@dashboard/channels/components/BulkPublishToChannelDialog/types";
import { Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type ClipboardEvent, type ReactNode, useCallback, useMemo, useRef } from "react";
import { FormattedMessage } from "react-intl";

import { BulkPublishCallout } from "./BulkPublishCallout";
import {
  getDraftsExceedingVariantLimit,
  getDraftsMissingCategoryForPublish,
  getDraftsWithManyVariants,
} from "./bulkPublishDrafts";
import { type BulkPublishReviewField, BulkPublishReviewRow } from "./BulkPublishReviewRow";
import styles from "./BulkPublishReviewStep.module.css";
import { handleBulkPublishFieldPaste } from "./bulkPublishSpreadsheetPaste";
import { messages } from "./messages";

interface BulkPublishReviewStepProps {
  channel: BulkPublishChannel;
  defaults: BulkPublishDefaults;
  productDrafts: ProductPublishDraft[];
  onChange: (drafts: ProductPublishDraft[]) => void;
}

const ReviewColumnHeader = ({ title, hint }: { title: ReactNode; hint?: ReactNode }) => (
  <Box className={styles.columnHeader}>
    <Text size={2} color="default2" fontWeight="medium">
      {title}
    </Text>
    {hint ? (
      <Text size={1} color="default2">
        {hint}
      </Text>
    ) : null}
  </Box>
);

export const BulkPublishReviewStep = ({
  channel,
  defaults,
  productDrafts,
  onChange,
}: BulkPublishReviewStepProps) => {
  const showStock = defaults.stock.enabled;
  const fieldGroupClassName = clsx(styles.fieldGroup, showStock && styles.fieldGroupWithStock);
  const oversizedDrafts = useMemo(
    () => getDraftsExceedingVariantLimit(productDrafts),
    [productDrafts],
  );
  const missingCategoryDrafts = useMemo(
    () => getDraftsMissingCategoryForPublish(productDrafts, defaults.isPublished),
    [defaults.isPublished, productDrafts],
  );
  const manyVariantsDrafts = useMemo(
    () => getDraftsWithManyVariants(productDrafts).filter(draft => !draft.exceedsVariantLimit),
    [productDrafts],
  );
  const oversizedProductNames = oversizedDrafts.map(draft => draft.name).join(", ");
  const missingCategoryProductNames = missingCategoryDrafts.map(draft => draft.name).join(", ");

  // Rows are memoized, so the handlers they receive have to stay stable across keystrokes.
  const latestDraftsRef = useRef(productDrafts);

  latestDraftsRef.current = productDrafts;

  const handleFieldChange = useCallback(
    (productId: string, field: BulkPublishReviewField, value: string) => {
      onChange(
        latestDraftsRef.current.map(draft =>
          draft.productId === productId ? { ...draft, [field]: value } : draft,
        ),
      );
    },
    [onChange],
  );

  const handleFieldPaste = useCallback(
    (event: ClipboardEvent<HTMLElement>, productIndex: number, field: BulkPublishReviewField) => {
      handleBulkPublishFieldPaste({
        event,
        drafts: latestDraftsRef.current,
        startProductIndex: productIndex,
        startField: field,
        showStock,
        currency: channel.currencyCode,
        onChange,
      });
    },
    [channel.currencyCode, onChange, showStock],
  );

  return (
    <Box className={styles.step}>
      <Box className={styles.stepHeader}>
        <BulkPublishCallout variant="info">
          <FormattedMessage
            {...messages.reviewVariantLimitHint}
            values={{ max: BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT }}
          />
          {showStock ? (
            <>
              {" "}
              <FormattedMessage {...messages.reviewStockHint} />
            </>
          ) : null}
        </BulkPublishCallout>
        {manyVariantsDrafts.length > 0 ? (
          <BulkPublishCallout variant="info">
            <FormattedMessage
              {...messages.reviewManyVariantsWarning}
              values={{
                count: manyVariantsDrafts.length,
                threshold: BULK_PUBLISH_MANY_VARIANTS_THRESHOLD,
              }}
            />
          </BulkPublishCallout>
        ) : null}
        {oversizedDrafts.length > 0 ? (
          <BulkPublishCallout variant="warning">
            <FormattedMessage
              {...messages.reviewVariantLimitWarning}
              values={{
                count: oversizedDrafts.length,
                max: BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT,
                productNames: oversizedProductNames,
              }}
            />
          </BulkPublishCallout>
        ) : null}
        {missingCategoryDrafts.length > 0 ? (
          <BulkPublishCallout variant="warning">
            <FormattedMessage
              {...messages.reviewMissingCategoryWarning}
              values={{
                count: missingCategoryDrafts.length,
                productNames: missingCategoryProductNames,
              }}
            />
          </BulkPublishCallout>
        ) : null}
      </Box>
      <Box className={styles.tableCard}>
        <Text size={2} color="default2" className={styles.pasteHint}>
          <FormattedMessage
            {...messages.reviewSpreadsheetPasteHint}
            values={{ hasStock: showStock ? "true" : "other" }}
          />
        </Text>
        <Box className={styles.listScroll}>
          <Box className={styles.list}>
            <Box className={styles.headerRow}>
              <span />
              <Box className={fieldGroupClassName}>
                <Box className={styles.inputCell}>
                  <ReviewColumnHeader
                    title={<FormattedMessage {...messages.reviewColumnPrice} />}
                  />
                </Box>
                <Box className={styles.inputCell}>
                  <ReviewColumnHeader
                    title={<FormattedMessage {...messages.reviewColumnCostPrice} />}
                  />
                </Box>
                {showStock ? (
                  <Box className={styles.inputCell}>
                    <ReviewColumnHeader
                      title={<FormattedMessage {...messages.reviewColumnStock} />}
                    />
                  </Box>
                ) : null}
              </Box>
            </Box>
            {productDrafts.map((draft, productIndex) => (
              <BulkPublishReviewRow
                key={draft.productId}
                draft={draft}
                productIndex={productIndex}
                currency={channel.currencyCode}
                showStock={showStock}
                fieldGroupClassName={fieldGroupClassName}
                onFieldChange={handleFieldChange}
                onFieldPaste={handleFieldPaste}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
