import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { DetailSettingToggleRow } from "@dashboard/components/DetailSettingToggleRow/DetailSettingToggleRow";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { InsetSegmentedControl } from "@dashboard/components/InsetSegmentedControl/InsetSegmentedControl";
import { Placeholder } from "@dashboard/components/Placeholder";
import {
  type ChannelInput,
  createDiscountAmountTypeChangeHandler,
  createVoucherScopeChangeHandler,
} from "@dashboard/discounts/handlers";
import { type DiscountErrorFragment } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import getDiscountErrorMessage from "@dashboard/utils/errors/discounts";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { ShoppingBag, Tag, Truck } from "lucide-react";
import { type ChangeEvent, useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type VoucherDetailsPageFormData } from "../VoucherDetailsPage";
import { scrollToVoucherSection } from "../VoucherSectionNav/useVoucherSectionScrollSpy";
import { voucherSectionIds } from "../VoucherSectionNav/voucherSectionIds";
import { voucherDiscountSectionMessages as messages } from "./messages";
import {
  getVoucherDiscountAmountType,
  getVoucherDiscountScope,
  isShippingVoucher,
  voucherDiscountAmountType,
  voucherDiscountScope,
} from "./voucherDiscountForm";
import styles from "./VoucherDiscountSection.module.css";
import { VoucherDiscountSubsectionHeader } from "./VoucherDiscountSubsectionHeader";
import { VoucherFixedAmountChannelList } from "./VoucherFixedAmountChannelList";
import { VoucherScopeTile } from "./VoucherScopeTile";

interface VoucherDiscountSectionProps {
  data: VoucherDetailsPageFormData;
  errors: DiscountErrorFragment[];
  disabled: boolean;
  /** Details page still fetching voucher — no selected tiles / controls. */
  loading?: boolean;
  onChange: FormChange;
  onChannelChange: (channelId: string, input: ChannelInput) => void;
  onChannelsChange: (channels: ChannelVoucherData[]) => void;
}

export type VoucherDiscountSkeletonVariant = "shipping" | "value" | "unknown";

/** Layout-shaped discount body — `shipping` matches callout; `value`/`unknown` match amount + toggle. */
export const VoucherDiscountSectionSkeleton = ({
  variant = "unknown",
}: {
  variant?: VoucherDiscountSkeletonVariant;
}): JSX.Element => {
  const isShipping = variant === "shipping";

  return (
    <Box className={styles.section} data-test-id="discount-section-skeleton" aria-busy="true">
      <Box className={styles.subsectionBlock}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Skeleton __width="6rem" __height="1rem" />
          <Skeleton __width="14rem" __height="0.875rem" />
        </Box>
        <Box className={styles.scopeGrid}>
          <Skeleton __height="5.5rem" borderRadius={3} />
          <Skeleton __height="5.5rem" borderRadius={3} />
          <Skeleton __height="5.5rem" borderRadius={3} />
        </Box>
      </Box>
      <Box className={styles.subsectionDivider} />
      <Box className={styles.subsectionBlock}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Skeleton __width="5rem" __height="1rem" />
          <Skeleton __width="12rem" __height="0.875rem" />
        </Box>
        {isShipping ? (
          <Skeleton __height="4.5rem" borderRadius={3} />
        ) : (
          <>
            <Skeleton __height="2.5rem" borderRadius={3} />
            <Skeleton __width="14rem" __height="2.25rem" borderRadius={3} />
          </>
        )}
      </Box>
      {!isShipping ? (
        <>
          <Box className={styles.subsectionDivider} />
          <Box className={styles.subsectionBlock}>
            <Skeleton __height="3.5rem" borderRadius={3} />
          </Box>
        </>
      ) : null}
    </Box>
  );
};

export const VoucherDiscountSection = ({
  data,
  disabled,
  loading = false,
  errors,
  onChange,
  onChannelChange,
  onChannelsChange,
}: VoucherDiscountSectionProps): JSX.Element => {
  const intl = useIntl();
  const formErrors = getFormErrors(["discountType", "discountValue", "type"], errors);
  const isShipping = isShippingVoucher(data);
  const scope = getVoucherDiscountScope(data);
  const amountType = getVoucherDiscountAmountType(data);
  const isPercentage = amountType === voucherDiscountAmountType.percentage;

  const handleScopeChange = useCallback(
    (nextScope: string) => {
      if (nextScope === scope) {
        return;
      }

      createVoucherScopeChangeHandler(onChange, () => {
        if (!data.channelListings?.length) {
          return;
        }

        onChannelsChange(
          data.channelListings.map(channel => ({
            ...channel,
            discountValue: "",
            percentageDiscountValue: "",
          })),
        );
      })(nextScope, data.discountType);
    },
    [data.channelListings, data.discountType, onChange, onChannelsChange, scope],
  );

  const handleAmountTypeChange = useCallback(
    (nextAmountType: string) => {
      // Only flip the active type — percentage and fixed drafts are independent per channel
      // and must survive toggling; they reset from the server after a successful save.
      createDiscountAmountTypeChangeHandler(onChange)(nextAmountType as "PERCENTAGE" | "FIXED");
    },
    [onChange],
  );

  const handleCountriesLinkClick = () => {
    scrollToVoucherSection(voucherSectionIds.countries);
  };

  return (
    <DetailSettingsCard
      contentFlush
      data-test-id="discount-section"
      title={intl.formatMessage(messages.cardTitle)}
    >
      {loading ? (
        <VoucherDiscountSectionSkeleton variant={isShippingVoucher(data) ? "shipping" : "value"} />
      ) : (
        <Box className={styles.section}>
          <Box className={styles.subsectionBlock}>
            <VoucherDiscountSubsectionHeader
              title={<FormattedMessage {...messages.scopeTitle} />}
              hint={<FormattedMessage {...messages.scopeHint} />}
            />
            <Box
              role="radiogroup"
              aria-label={intl.formatMessage(messages.scopeTitle)}
              className={styles.scopeGrid}
            >
              <VoucherScopeTile
                value={voucherDiscountScope.entireOrder}
                checked={scope === voucherDiscountScope.entireOrder}
                title={intl.formatMessage(messages.entireOrderTitle)}
                description={intl.formatMessage(messages.entireOrderDescription)}
                icon={ShoppingBag}
                disabled={disabled}
                onSelect={handleScopeChange}
                data-test-id="voucher-scope-entire-order"
              />
              <VoucherScopeTile
                value={voucherDiscountScope.specificProduct}
                checked={scope === voucherDiscountScope.specificProduct}
                title={intl.formatMessage(messages.specificProductTitle)}
                description={intl.formatMessage(messages.specificProductDescription)}
                icon={Tag}
                disabled={disabled}
                onSelect={handleScopeChange}
                data-test-id="voucher-scope-specific-product"
              />
              <VoucherScopeTile
                value={voucherDiscountScope.shipping}
                checked={scope === voucherDiscountScope.shipping}
                title={intl.formatMessage(messages.freeShippingTitle)}
                description={intl.formatMessage(messages.freeShippingDescription)}
                icon={Truck}
                disabled={disabled}
                onSelect={handleScopeChange}
                data-test-id="voucher-scope-shipping"
              />
            </Box>
            {formErrors.type ? (
              <Text size={2} color="critical1">
                {getDiscountErrorMessage(formErrors.type, intl)}
              </Text>
            ) : null}
          </Box>

          <Box className={styles.subsectionDivider} />

          <Box className={styles.subsectionBlock}>
            <VoucherDiscountSubsectionHeader
              title={<FormattedMessage {...messages.amountTitle} />}
              hint={
                isShipping ? (
                  <FormattedMessage {...messages.shippingAmountHint} />
                ) : (
                  <FormattedMessage {...messages.amountHint} />
                )
              }
            />

            {isShipping ? (
              <Box className={styles.shippingCallout}>
                <Truck
                  size={iconSize.small}
                  strokeWidth={iconStrokeWidthBySize.small}
                  aria-hidden
                />
                <Text size={3} color="default2">
                  <FormattedMessage
                    {...messages.shippingCountriesCallout}
                    values={{
                      countriesLink: (
                        <button
                          type="button"
                          className={styles.sectionLink}
                          onClick={handleCountriesLinkClick}
                        >
                          <FormattedMessage {...messages.countriesLink} />
                        </button>
                      ),
                    }}
                  />
                </Text>
              </Box>
            ) : (
              <Box className={styles.amountControlRow}>
                <InsetSegmentedControl
                  className={styles.amountTypeControl}
                  size="lg"
                  value={amountType}
                  onChange={handleAmountTypeChange}
                  data-test-id="voucher-discount-amount-type"
                  aria-label={intl.formatMessage(messages.amountTitle)}
                  options={[
                    {
                      value: voucherDiscountAmountType.percentage,
                      label: intl.formatMessage(messages.percentageLabel),
                      testId: "voucher-amount-percentage",
                    },
                    {
                      value: voucherDiscountAmountType.fixed,
                      label: intl.formatMessage(messages.fixedAmountLabel),
                      testId: "voucher-amount-fixed",
                    },
                  ]}
                />

                {isPercentage ? (
                  data.channelListings?.length === 0 ? (
                    <Placeholder>
                      <FormattedMessage {...messages.percentageNeedsChannelsHint} />
                    </Placeholder>
                  ) : (
                    <Box className={styles.fixedAmountBlock}>
                      <VoucherDiscountSubsectionHeader
                        title={<FormattedMessage {...messages.percentagePerChannelTitle} />}
                        hint={<FormattedMessage {...messages.percentageValueHint} />}
                      />
                      <VoucherFixedAmountChannelList
                        amountKind="percentage"
                        channelListings={data.channelListings}
                        disabled={disabled}
                        errors={errors}
                        onChannelChange={onChannelChange}
                        onChannelsChange={onChannelsChange}
                      />
                    </Box>
                  )
                ) : data.channelListings?.length === 0 ? (
                  <Placeholder>
                    <FormattedMessage id="/glQgs" defaultMessage="No channels found" />
                  </Placeholder>
                ) : (
                  <Box className={styles.fixedAmountBlock}>
                    <VoucherDiscountSubsectionHeader
                      title={<FormattedMessage {...messages.fixedAmountPerChannelTitle} />}
                      hint={<FormattedMessage {...messages.fixedAmountPerChannelHint} />}
                    />
                    <VoucherFixedAmountChannelList
                      channelListings={data.channelListings}
                      disabled={disabled}
                      errors={errors}
                      onChannelChange={onChannelChange}
                      onChannelsChange={onChannelsChange}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {!isShipping && (
            <>
              <Box className={styles.subsectionDivider} />
              <DetailSettingToggleRow
                title={
                  <FormattedMessage
                    id="Y3zr/B"
                    defaultMessage="Apply only to a single cheapest eligible product"
                    description="voucher application, switch button"
                  />
                }
                description={
                  <FormattedMessage
                    id="gToMwN"
                    defaultMessage="When off, the discount is calculated for every eligible line in the order."
                    description="voucher apply once per order description"
                  />
                }
                pressed={data.applyOncePerOrder}
                onPressedChange={pressed =>
                  onChange({
                    target: {
                      name: "applyOncePerOrder",
                      value: pressed,
                    },
                  } as ChangeEvent<any>)
                }
                disabled={disabled}
              />
            </>
          )}
        </Box>
      )}
    </DetailSettingsCard>
  );
};
