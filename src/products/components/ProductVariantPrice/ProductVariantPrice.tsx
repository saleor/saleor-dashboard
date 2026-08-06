import {
  type ChannelData,
  type ChannelPriceAndPreorderArgs,
  type ChannelPriceArgs,
  sortChannelShippingDataByName,
} from "@dashboard/channels/utils";
import { DashboardCard } from "@dashboard/components/Card";
import { ChannelIcon } from "@dashboard/components/ChannelAvailability/primitives";
import { PriceFieldV2 } from "@dashboard/components/PriceFieldV2/PriceFieldV2";
import { sanitizeSpreadsheetPrice } from "@dashboard/components/PriceFieldV2/utils";
import {
  type ProductChannelListingErrorFragment,
  type ProductErrorFragment,
} from "@dashboard/graphql";
import {
  type ChannelError,
  getFormChannelError,
  getFormChannelErrors,
  getFormErrors,
} from "@dashboard/utils/errors";
import getProductErrorMessage from "@dashboard/utils/errors/product";
import { applySpreadsheetPaste } from "@dashboard/utils/spreadsheetPaste/applySpreadsheetPaste";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { type ClipboardEvent, useCallback, useMemo } from "react";
import { FormattedMessage, type MessageDescriptor, useIntl } from "react-intl";

import { getVariantPricingChannelStatus } from "./channelStatus";
import { productVariantPriceMessages as messages } from "./messages";
import styles from "./ProductVariantPrice.module.css";

type VariantPricePasteField = "price" | "costPrice";

const VARIANT_PRICE_PASTE_FIELDS: VariantPricePasteField[] = ["price", "costPrice"];

const getVariantPricePasteFields = (
  startField: VariantPricePasteField,
): VariantPricePasteField[] => {
  const startIndex = VARIANT_PRICE_PASTE_FIELDS.indexOf(startField);

  return startIndex === -1 ? [] : VARIANT_PRICE_PASTE_FIELDS.slice(startIndex);
};

interface ProductVariantPriceProps {
  productVariantChannelListings?: ChannelData[];
  errors: Array<ProductErrorFragment | ProductChannelListingErrorFragment>;
  loading?: boolean;
  disabled?: boolean;
  onChange?: (id: string, data: ChannelPriceArgs | ChannelPriceAndPreorderArgs) => void;
  onChannelsReplace?: (listings: ChannelData[]) => void;
  onManageClick?: () => void;
  listedInChannelsCount?: number;
  availableChannelsCount?: number;
  disabledMessage?: MessageDescriptor;
}

export const ProductVariantPrice = ({
  disabled = false,
  errors = [],
  productVariantChannelListings = [],
  loading = false,
  onChange,
  onChannelsReplace,
  onManageClick,
  listedInChannelsCount,
  availableChannelsCount,
  disabledMessage,
}: ProductVariantPriceProps): JSX.Element => {
  const intl = useIntl();
  const channelApiErrors = errors.filter(
    (error): error is ProductChannelListingErrorFragment => "channels" in error,
  );
  const apiErrors = getFormChannelErrors(
    ["price", "costPrice"],
    channelApiErrors as ChannelError[],
  );
  const sortedListings = useMemo(
    () => sortChannelShippingDataByName(productVariantChannelListings),
    [productVariantChannelListings],
  );
  const inputsDisabled = disabled || loading;
  const listedCount = listedInChannelsCount ?? productVariantChannelListings.length;
  const showSubtitle = availableChannelsCount !== undefined && availableChannelsCount > 0;
  const manageChannelsButton =
    onManageClick && !loading ? (
      <Button
        variant="secondary"
        disabled={inputsDisabled}
        data-test-id="manage-channels-button"
        onClick={onManageClick}
      >
        {intl.formatMessage(messages.manageChannels)}
      </Button>
    ) : null;

  const getEmptyStateMessage = (): string | null => {
    if (disabledMessage) {
      return intl.formatMessage(disabledMessage);
    }

    if (loading || (disabled && !onManageClick)) {
      return null;
    }

    if (onManageClick && availableChannelsCount === 0) {
      return intl.formatMessage(messages.emptyNoProductChannels);
    }

    if (onManageClick) {
      return intl.formatMessage(messages.emptyWithManage);
    }

    return intl.formatMessage(messages.emptySimpleProduct);
  };

  const cardTitle = (
    <Box display="grid" gap={2}>
      {intl.formatMessage(messages.title)}
      {showSubtitle && (
        <Text size={2} color="default2">
          {intl.formatMessage(messages.subtitle, {
            listedInChannelsCount: listedCount,
            availableChannelsCount,
          })}
        </Text>
      )}
    </Box>
  );

  const handlePaste = useCallback(
    (
      event: ClipboardEvent<HTMLElement>,
      startIndex: number,
      startField: VariantPricePasteField,
    ) => {
      if (!onChannelsReplace) {
        return;
      }

      const pastedText = event.clipboardData.getData("text/plain");

      if (pastedText === "") {
        return;
      }

      const { rows, handled } = applySpreadsheetPaste({
        rows: sortedListings,
        startRowIndex: startIndex,
        fields: getVariantPricePasteFields(startField),
        pastedText,
        sanitize: (_field, cell, row) => sanitizeSpreadsheetPrice(cell, row.currency ?? ""),
        setField: (row, field, value) => ({ ...row, [field]: value }),
      });

      if (!handled) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      onChannelsReplace(rows);
    },
    [onChannelsReplace, sortedListings],
  );

  if (!productVariantChannelListings.length) {
    const emptyStateMessage = getEmptyStateMessage();

    return (
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title>{cardTitle}</DashboardCard.Title>
        </DashboardCard.Header>
        <DashboardCard.Content>
          {(emptyStateMessage || manageChannelsButton) && (
            <Box display="flex" flexDirection="column" gap={4} alignItems="flex-start">
              {emptyStateMessage && (
                <Text size={2} color="default2">
                  {emptyStateMessage}
                </Text>
              )}
              {manageChannelsButton}
            </Box>
          )}
        </DashboardCard.Content>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{cardTitle}</DashboardCard.Title>
        {manageChannelsButton && (
          <DashboardCard.Toolbar>{manageChannelsButton}</DashboardCard.Toolbar>
        )}
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box className={styles.list} data-test-id="product-variant-pricing-channel-list">
          <Text size={2} color="default2" className={styles.pasteHint}>
            <FormattedMessage
              id="hxuCJ7"
              defaultMessage="You can paste from a spreadsheet. Select a field and paste tab-separated rows to fill selling and cost prices down the list."
              description="product variant pricing spreadsheet paste hint"
            />
          </Text>
          <Box className={styles.headerRow}>
            <Text size={2} color="default2">
              <FormattedMessage
                id="c8UT0c"
                defaultMessage="Channel Name"
                description="tabel column header"
              />
            </Text>
            <Text size={2} color="default2">
              <FormattedMessage
                id="JFtFgc"
                defaultMessage="Selling Price"
                description="tabel column header"
              />
            </Text>
            <Text size={2} color="default2">
              <FormattedMessage
                id="2zCmiR"
                defaultMessage="Cost price"
                description="tabel column header"
              />
            </Text>
          </Box>
          {sortedListings.map((listing, index) => {
            const fieldName = `${listing.id}-channelListing-price`;
            const formErrors = getFormErrors([fieldName], errors);
            const channelPriceError = getFormChannelError(apiErrors.price, listing.id);
            const fieldPriceError = formErrors[fieldName];
            const priceApiError = channelPriceError ?? fieldPriceError;
            const costPriceError = getFormChannelError(apiErrors.costPrice, listing.id);
            const priceErrorMessage = priceApiError
              ? getProductErrorMessage(
                  priceApiError as ProductErrorFragment | ProductChannelListingErrorFragment,
                  intl,
                )
              : undefined;
            const costPriceErrorMessage = costPriceError
              ? getProductErrorMessage(costPriceError as ProductChannelListingErrorFragment, intl)
              : undefined;
            const channelStatus = getVariantPricingChannelStatus(listing, intl);

            return (
              <Box key={listing.id} className={styles.row} data-test-id={listing.name}>
                <Box className={styles.channelNameCell}>
                  <Tooltip>
                    <Tooltip.Trigger>
                      <Box>
                        <ChannelIcon statusType={channelStatus.type} />
                      </Box>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="right">
                      <Tooltip.Arrow />
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Text size={2} fontWeight="medium">
                          {channelStatus.label}
                        </Text>
                        <Text size={1} color="default2">
                          {channelStatus.description}
                        </Text>
                      </Box>
                    </Tooltip.Content>
                  </Tooltip>
                  <Text size={3} className={styles.channelName} title={listing.name}>
                    {listing.name}
                  </Text>
                </Box>
                <div
                  className={styles.inputCell}
                  onPasteCapture={event => handlePaste(event, index, "price")}
                >
                  <PriceFieldV2
                    className={styles.amountInput}
                    data-test-id="price-field"
                    disabled={inputsDisabled}
                    error={!!priceApiError}
                    helperText={priceErrorMessage}
                    name={fieldName}
                    currencySymbol={listing.currency ?? ""}
                    aria-label={intl.formatMessage(
                      {
                        id: "swMMqF",
                        defaultMessage: "Selling price for {channelName}",
                        description: "product variant channel selling price aria label",
                      },
                      { channelName: listing.name },
                    )}
                    value={listing.price ?? ""}
                    onChange={value =>
                      onChange?.(listing.id, {
                        costPrice: listing.costPrice ?? "",
                        price: value,
                        preorderThreshold: listing.preorderThreshold ?? null,
                      })
                    }
                  />
                </div>
                <div
                  className={styles.inputCell}
                  onPasteCapture={event => handlePaste(event, index, "costPrice")}
                >
                  <PriceFieldV2
                    className={styles.amountInput}
                    data-test-id="cost-price-field"
                    disabled={inputsDisabled}
                    error={!!costPriceError}
                    helperText={costPriceErrorMessage}
                    name={`${listing.id}-channel-costPrice`}
                    currencySymbol={listing.currency ?? ""}
                    aria-label={intl.formatMessage(
                      {
                        id: "rQaDCQ",
                        defaultMessage: "Cost price for {channelName}",
                        description: "product variant channel cost price aria label",
                      },
                      { channelName: listing.name },
                    )}
                    value={listing.costPrice ?? ""}
                    onChange={value =>
                      onChange?.(listing.id, {
                        costPrice: value,
                        price: listing.price ?? "",
                        preorderThreshold: listing.preorderThreshold ?? null,
                      })
                    }
                  />
                </div>
              </Box>
            );
          })}
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
