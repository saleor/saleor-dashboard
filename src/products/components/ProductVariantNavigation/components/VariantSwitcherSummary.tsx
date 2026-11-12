import { iconSize, iconStrokeWidth, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { SaleorThrobber } from "@dashboard/components/Throbber/SaleorThrobber";
import { Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { ChevronDown, ChevronLeft, ChevronRight, Image } from "lucide-react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import styles from "./VariantSwitcherSummary.module.css";

interface VariantSwitcherSummaryProps {
  /** Name of the open variant; undefined while it is not known yet. */
  name: string | undefined;
  thumbnailUrl?: string;
  isDefault: boolean;
  /** The variant is selected, but its details are still loading. */
  isPending: boolean;
  /** 1-based place of the open variant among the product's variants; null when unknown. */
  position: number | null;
  totalCount: number | null;
  expanded: boolean;
  /** Id of the list this summary opens and closes. */
  panelId: string;
  onToggle: () => void;
  /** Opens the variant before this one; leave undefined when there is none. */
  onPrevious?: () => void;
  /** Opens the variant after this one; leave undefined when there is none. */
  onNext?: () => void;
  /** Leave out the previous and next buttons: a variant being created has no neighbours. */
  hideSteps?: boolean;
}

/**
 * The variant list folded into one row: the open variant, its place among the product's
 * variants, steps to its neighbours, and a toggle for the whole list.
 */
export const VariantSwitcherSummary = ({
  name,
  thumbnailUrl,
  isDefault,
  isPending,
  position,
  totalCount,
  expanded,
  panelId,
  onToggle,
  onPrevious,
  onNext,
  hideSteps = false,
}: VariantSwitcherSummaryProps) => {
  const intl = useIntl();

  const place =
    totalCount === null
      ? null
      : position === null
        ? intl.formatMessage(messages.variantsCount, { count: totalCount })
        : intl.formatMessage(messages.variantPosition, { position, total: totalCount });
  const details = [place, isDefault ? intl.formatMessage(messages.defaultVariant) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={styles.summary}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        aria-busy={isPending || undefined}
        title={intl.formatMessage(expanded ? messages.hideVariantList : messages.showVariantList)}
        onClick={onToggle}
        data-test-id="variant-switcher-toggle"
      >
        <span className={styles.thumbnail}>
          {thumbnailUrl ? (
            <img className={styles.thumbnailImage} src={thumbnailUrl} alt="" />
          ) : (
            <Image size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
          )}
        </span>
        <span className={styles.text}>
          {name === undefined ? (
            <Skeleton __width="60%" />
          ) : (
            <Text className={styles.name} data-test-id="variant-switcher-current">
              {name}
            </Text>
          )}
          {details && (
            <Text className={styles.details} size={2} color="default2">
              {details}
            </Text>
          )}
        </span>
        {isPending && (
          <span className={styles.pending}>
            <SaleorThrobber size={16} />
          </span>
        )}
        <ChevronDown
          className={styles.chevron}
          size={iconSize.medium}
          strokeWidth={iconStrokeWidth}
        />
      </button>
      {!hideSteps && (
        <div className={styles.steps}>
          <Button
            variant="secondary"
            size="large"
            type="button"
            disabled={!onPrevious}
            onClick={onPrevious}
            aria-label={intl.formatMessage(messages.previousVariant)}
            title={intl.formatMessage(messages.previousVariant)}
            data-test-id="variant-switcher-previous"
            icon={<ChevronLeft size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
          />
          <Button
            variant="secondary"
            size="large"
            type="button"
            disabled={!onNext}
            onClick={onNext}
            aria-label={intl.formatMessage(messages.nextVariant)}
            title={intl.formatMessage(messages.nextVariant)}
            data-test-id="variant-switcher-next"
            icon={<ChevronRight size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
          />
        </div>
      )}
    </div>
  );
};

VariantSwitcherSummary.displayName = "VariantSwitcherSummary";
