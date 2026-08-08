import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { DetailPageSectionLayout } from "@dashboard/components/DetailPageSectionLayout/DetailPageSectionLayout";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { VOUCHER_CODES_PAGINATE_BY } from "@dashboard/config";
import { DiscountTypeEnum } from "@dashboard/discounts/types";
import { voucherListPath } from "@dashboard/discounts/urls";
import {
  DiscountValueTypeEnum,
  PermissionEnum,
  type VoucherDetailsFragment,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { type ReactNode, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { VoucherChannelAvailabilityCard } from "../VoucherChannelAvailabilityCard/VoucherChannelAvailabilityCard";
import { VoucherCodesAddButton } from "../VoucherCodesAddButton/VoucherCodesAddButton";
import { VoucherCodesTable } from "../VoucherCodesTable/VoucherCodesTable";
import { VoucherDetailsTitle } from "../VoucherDetailsTitle/VoucherDetailsTitle";
import { voucherDiscountSectionMessages } from "../VoucherDiscountSection/messages";
import {
  VoucherDiscountSectionSkeleton,
  type VoucherDiscountSkeletonVariant,
} from "../VoucherDiscountSection/VoucherDiscountSection";
import voucherLimitsMessages from "../VoucherLimits/messages";
import { VoucherRedemptionsCard } from "../VoucherRedemptionsCard/VoucherRedemptionsCard";
import { VoucherScheduleCard } from "../VoucherScheduleCard/VoucherScheduleCard";
import {
  resolveVoucherSectionVisibility,
  useVoucherSectionNavItems,
} from "../VoucherSectionNav/useVoucherSectionNavItems";
import { voucherSectionIds } from "../VoucherSectionNav/voucherSectionIds";
import {
  VoucherSection,
  VoucherSectionNav,
  type VoucherSectionNavItem,
} from "../VoucherSectionNav/VoucherSectionNav";

const emptyScheduleData = {
  startDate: "",
  startTime: "",
  hasEndDate: false,
  endDate: "",
  endTime: "",
};

const noop = (): void => undefined;

interface VoucherDetailsPageLoadingProps {
  /** When present (codes still settling), nav + discount skeleton match the entity. */
  voucher?: VoucherDetailsFragment | null;
}

/**
 * Layout-shaped loading shell for voucher details (Geist: match final structure,
 * no fake selected defaults). Mount the real form only after voucher + codes settle.
 */
export const VoucherDetailsPageLoading = ({
  voucher = null,
}: VoucherDetailsPageLoadingProps): ReactNode => {
  const intl = useIntl();
  const voucherListBackLink = useBackLinkWithState({ path: voucherListPath });

  const visibility = voucher
    ? resolveVoucherSectionVisibility({
        discountType:
          voucher.type === VoucherTypeEnum.SHIPPING
            ? DiscountTypeEnum.SHIPPING
            : voucher.discountValueType === DiscountValueTypeEnum.PERCENTAGE
              ? DiscountTypeEnum.VALUE_PERCENTAGE
              : DiscountTypeEnum.VALUE_FIXED,
        type: voucher.type,
      })
    : { showCatalogue: false, showCountries: false };

  const baseNavItems = useVoucherSectionNavItems(visibility);

  // Section map is layout chrome with unknown final labels (Countries vs Catalogue) —
  // skeleton every item (Geist: match shape, no premature truth).
  const sectionNavItems = useMemo((): VoucherSectionNavItem[] => {
    const skeletonWidths = ["3.5rem", "3rem", "4rem", "4.5rem", "5.5rem", "3rem", "3rem"];
    const withOptionalSlot: VoucherSectionNavItem[] = [...baseNavItems];

    // Reserve catalogue/countries slot only while type is unknown — once voucher
    // exists without either section, matching 6 items avoids 7→6 CLS on reveal.
    if (!voucher && !visibility.showCatalogue && !visibility.showCountries) {
      const discountIndex = withOptionalSlot.findIndex(
        item => item.id === voucherSectionIds.discount,
      );

      if (discountIndex >= 0) {
        withOptionalSlot.splice(discountIndex + 1, 0, {
          id: voucherSectionIds.countries,
          label: null,
        });
      }
    }

    return withOptionalSlot.map((item, index) => ({
      ...item,
      label: <Skeleton __width={skeletonWidths[index] ?? "4rem"} __height="0.875rem" aria-hidden />,
    }));
  }, [baseNavItems, voucher, visibility.showCatalogue, visibility.showCountries]);

  const discountSkeletonVariant: VoucherDiscountSkeletonVariant = !voucher
    ? "unknown"
    : voucher.type === VoucherTypeEnum.SHIPPING
      ? "shipping"
      : "value";

  return (
    <DetailPageLayout data-test-id="voucher-details-loading">
      <TopNav
        href={voucherListBackLink}
        hrefIcon={<TopNavDestinationIcon.discounts />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.allVouchers)}
        title={<VoucherDetailsTitle voucher={voucher} />}
        actionsGap={3}
      >
        <Skeleton __width="2rem" __height="2rem" borderRadius={2} />
        <Skeleton __width="2rem" __height="2rem" borderRadius={2} />
        <Skeleton __width="2rem" __height="2rem" borderRadius={2} />
      </TopNav>
      <DetailPageLayout.Content>
        <DetailPageSectionLayout
          nav={
            <VoucherSectionNav
              items={sectionNavItems}
              activeId={voucherSectionIds.details}
              onSelect={noop}
            />
          }
        >
          <VoucherSection id={voucherSectionIds.details}>
            <DetailSettingsCard
              data-test-id="voucher-details-section"
              title={intl.formatMessage({
                id: "5xOAYZ",
                defaultMessage: "Details",
                description: "voucher details section title",
              })}
              intro={
                <Text size={3} color="default2">
                  <FormattedMessage
                    id="tQnYA/"
                    defaultMessage="Internal name for staff. Customers redeem voucher codes at checkout, not this label."
                    description="voucher details section intro"
                  />
                </Text>
              }
            >
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                data-test-id="voucher-details-skeleton"
                aria-busy="true"
              >
                <Skeleton __width="6rem" __height="0.875rem" />
                <Skeleton __height="2.5rem" />
              </Box>
            </DetailSettingsCard>
          </VoucherSection>

          <VoucherSection id={voucherSectionIds.codes}>
            <DetailSettingsCard
              data-test-id="voucher-codes-section"
              title={<FormattedMessage defaultMessage="Voucher codes" id="kVL3LM" />}
              intro={
                <Text size={3} color="default2">
                  <FormattedMessage
                    id="Xzp951"
                    defaultMessage="All codes share the same discount rules. Delete codes you no longer want customers to redeem."
                    description="voucher codes section intro"
                  />
                </Text>
              }
              headerEnd={
                <VoucherCodesAddButton
                  disabled
                  onMultiCodesGenerate={noop}
                  onSingleCodesGenerate={noop}
                />
              }
              contentFlush
            >
              <VoucherCodesTable
                codes={[]}
                loading
                disabled
                selectedCodesIds={[]}
                onSelectedCodesChange={noop}
                onDeleteCode={noop}
                onBulkDelete={noop}
                settings={{ rowNumber: VOUCHER_CODES_PAGINATE_BY }}
                onSettingsChange={noop}
              />
            </DetailSettingsCard>
          </VoucherSection>

          <VoucherSection id={voucherSectionIds.discount}>
            <DetailSettingsCard
              contentFlush
              data-test-id="discount-section"
              title={intl.formatMessage(voucherDiscountSectionMessages.cardTitle)}
            >
              <VoucherDiscountSectionSkeleton variant={discountSkeletonVariant} />
            </DetailSettingsCard>
          </VoucherSection>

          {visibility.showCountries ? (
            <VoucherSection id={voucherSectionIds.countries}>
              <DetailSettingsCard
                data-test-id="voucher-countries-section"
                title={intl.formatMessage({
                  id: "ibnmEd",
                  defaultMessage: "Countries",
                  description: "voucher country range",
                })}
                intro={
                  <Text size={3} color="default2">
                    <FormattedMessage
                      id="glT6fm"
                      defaultMessage="Voucher is limited to these countries"
                    />
                  </Text>
                }
              >
                <Box display="flex" flexDirection="column" gap={2} aria-busy="true">
                  <Skeleton __height="2.5rem" />
                  <Skeleton __height="2.5rem" />
                </Box>
              </DetailSettingsCard>
            </VoucherSection>
          ) : null}

          {visibility.showCatalogue ? (
            <VoucherSection id={voucherSectionIds.catalogue}>
              <DetailSettingsCard
                data-test-id="voucher-catalogue-section"
                title={intl.formatMessage({
                  id: "sIsiBT",
                  defaultMessage: "Eligible products",
                  description: "voucher catalogue section title",
                })}
              >
                <Box display="flex" flexDirection="column" gap={2} aria-busy="true">
                  <Skeleton __height="2.5rem" />
                  <Skeleton __height="6rem" />
                </Box>
              </DetailSettingsCard>
            </VoucherSection>
          ) : null}

          <VoucherSection id={voucherSectionIds.requirements}>
            <DetailSettingsCard
              data-test-id="minimum-requirements-section"
              title={intl.formatMessage({
                id: "yhv3HX",
                defaultMessage: "Minimum Requirements",
                description: "voucher requirements, header",
              })}
              intro={
                <Text size={3} color="default2">
                  <FormattedMessage
                    id="CQS9eE"
                    defaultMessage="Optional thresholds customers must meet before the voucher can be applied."
                    description="voucher requirements section intro"
                  />
                </Text>
              }
              contentFlush
            >
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                paddingX={6}
                paddingY={4}
                aria-busy="true"
              >
                <Skeleton __height="3.5rem" />
                <Skeleton __height="3.5rem" />
              </Box>
            </DetailSettingsCard>
          </VoucherSection>

          <VoucherSection id={voucherSectionIds.limits}>
            <DetailSettingsCard
              data-test-id="usage-limit-section"
              title={intl.formatMessage(voucherLimitsMessages.usageLimitsTitle)}
              intro={
                <Text size={3} color="default2">
                  <FormattedMessage
                    id="tU6CwL"
                    defaultMessage="Control how many times this voucher can be redeemed and who can use it."
                    description="voucher limits section intro"
                  />
                </Text>
              }
              contentFlush
            >
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                paddingX={6}
                paddingY={4}
                aria-busy="true"
              >
                <Skeleton __height="3.5rem" />
                <Skeleton __height="3.5rem" />
                <Skeleton __height="3.5rem" />
                <Skeleton __height="3.5rem" />
              </Box>
            </DetailSettingsCard>
          </VoucherSection>
        </DetailPageSectionLayout>
      </DetailPageLayout.Content>

      <DetailPageLayout.RightSidebar paddingTop={6}>
        <Box display="flex" flexDirection="column" gap={4}>
          {/* Only skeleton when the entity has a cap — uncapped vouchers omit this card. */}
          {voucher?.usageLimit != null ? (
            <VoucherRedemptionsCard
              used={0}
              hasUsageLimit
              usageLimit={voucher.usageLimit}
              codesCount={0}
              channelsCount={0}
              scheduleData={emptyScheduleData}
              loading
            />
          ) : null}
          <VoucherScheduleCard
            data={emptyScheduleData}
            errors={[]}
            disabled
            loading
            onChange={noop}
          />
          <VoucherChannelAvailabilityCard
            channels={[]}
            totalChannelsCount={0}
            disabled
            loading
            managePermissions={[PermissionEnum.MANAGE_DISCOUNTS]}
            onManageClick={noop}
            scheduleData={emptyScheduleData}
          />
        </Box>
      </DetailPageLayout.RightSidebar>

      <Savebar>
        <Savebar.Spacer />
        <Savebar.CancelButton onClick={noop} disabled />
        <Savebar.ConfirmButton transitionState="default" disabled type="button" />
      </Savebar>
    </DetailPageLayout>
  );
};
