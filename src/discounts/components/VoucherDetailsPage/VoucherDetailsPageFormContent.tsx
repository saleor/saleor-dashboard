// @ts-strict-ignore
import { type ChannelVoucherData } from "@dashboard/channels/utils";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { CountryList } from "@dashboard/components/CountryList";
import { DetailPageSectionLayout } from "@dashboard/components/DetailPageSectionLayout/DetailPageSectionLayout";
import { FormDirtyStateSync } from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { createChannelsChangeHandler } from "@dashboard/discounts/handlers";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { type ExtensionWithParams } from "@dashboard/extensions/types";
import {
  type DiscountErrorFragment,
  PermissionEnum,
  type SearchProductFragment,
} from "@dashboard/graphql";
import { type UseFormResult } from "@dashboard/hooks/useForm";
import { type UseListSettings } from "@dashboard/hooks/useListSettings";
import { type LocalPagination } from "@dashboard/hooks/useLocalPaginator";
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { type ChannelProps } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Divider } from "@saleor/macaw-ui-next";
import isEqual from "lodash/isEqual";
import type * as React from "react";
import { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { VoucherCatalogueSection } from "../VoucherCatalogueSection/VoucherCatalogueSection";
import { VoucherChannelAvailabilityCard } from "../VoucherChannelAvailabilityCard/VoucherChannelAvailabilityCard";
import { VoucherCodesCard } from "../VoucherCodesCard/VoucherCodesCard";
import { type VoucherCode } from "../VoucherCodesDatagrid/types";
import { type GenerateMultipleVoucherCodeFormData } from "../VoucherCodesGenerateDialog";
import { formatVoucherCountriesErrorMessage } from "../VoucherCountriesErrors/voucherCountriesErrors";
import { VoucherDetailsTitle } from "../VoucherDetailsTitle/VoucherDetailsTitle";
import { VoucherDiscountSection } from "../VoucherDiscountSection/VoucherDiscountSection";
import VoucherInfo from "../VoucherInfo";
import VoucherLimits from "../VoucherLimits";
import { VoucherRedemptionsCard } from "../VoucherRedemptionsCard/VoucherRedemptionsCard";
import { VoucherRequirements } from "../VoucherRequirements/VoucherRequirements";
import { VoucherScheduleCard } from "../VoucherScheduleCard/VoucherScheduleCard";
import {
  getVoucherSectionIds,
  resolveVoucherSectionVisibility,
  useVoucherSectionNavItems,
} from "../VoucherSectionNav/useVoucherSectionNavItems";
import { useVoucherSectionScrollSpy } from "../VoucherSectionNav/useVoucherSectionScrollSpy";
import { voucherSectionIds } from "../VoucherSectionNav/voucherSectionIds";
import { VoucherSection, VoucherSectionNav } from "../VoucherSectionNav/VoucherSectionNav";
import { getVoucherSetupReadiness } from "../VoucherSetupCard/getVoucherSetupReadiness";
import { VoucherSetupCard } from "../VoucherSetupCard/VoucherSetupCard";
import { buildVoucherSaveComposition, hasVoucherSaveComposition } from "./saveComposition";
import {
  type VoucherDetailsPageFormData,
  type VoucherDetailsPageTab,
  type VoucherDetailsPageVoucher,
  type VoucherTabItemsCount,
} from "./VoucherDetailsPage";
import { VoucherSaveCompositionHint } from "./VoucherSaveCompositionHint";

interface VoucherDetailsPageFormContentProps extends ChannelProps {
  isChecked: (id: string) => boolean;
  selected: number;
  toggle: (id: string) => void;
  toggleAll: (items: unknown[], selected: number) => void;
  categoryListToolbar?: React.ReactNode;
  collectionListToolbar?: React.ReactNode;
  productListToolbar?: React.ReactNode;
  variantListToolbar?: React.ReactNode;
  form: UseFormResult<VoucherDetailsPageFormData>;
  activeTab: VoucherDetailsPageTab;
  tabItemsCount: VoucherTabItemsCount;
  errors: DiscountErrorFragment[];
  localErrors: DiscountErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  voucher: VoucherDetailsPageVoucher;
  allChannelsCount: number;
  /** Live channel drafts from the view (modal + price edits). Used for dirty/save. */
  channelListings: ChannelVoucherData[];
  savedChannelListings: ChannelVoucherData[];
  initialUsageLimit: number;
  selectedVoucherCodesIds: string[];
  voucherCodes: VoucherCode[];
  /** Draft codes pending save — live source for dirty/save (form.codes syncs via initial). */
  addedVoucherCodes: VoucherCode[];
  /** Server code node ids staged for delete on Save. */
  pendingRemovedCodeIds?: string[];
  hasCatalogueDraftChanges?: boolean;
  hasCountriesDraftChanges?: boolean;
  voucherCodesLoading: boolean;
  voucherCodesPagination: LocalPagination;
  voucherCodesSettings: UseListSettings["settings"];
  deleteVoucherCodesTransitionState: ConfirmButtonTransitionState;
  voucherListBackLink: string;
  menuItems: TopNavMenuItem[];
  canTranslate: boolean;
  onTranslate: () => void;
  onShowMetadata: () => void;
  onRemove: () => void;
  setupEmphasized?: boolean;
  setupCardDismissed?: boolean;
  setupCardDisplayReady?: boolean;
  onDismissSetupCard?: () => void;
  onCancel: () => void;
  onSubmit: (data: VoucherDetailsPageFormData) => void;
  onTabClick: (tab: VoucherDetailsPageTab) => void;
  onChannelsChange: (data: ChannelVoucherData[]) => void;
  openChannelsModal: () => void;
  onCategoryAssign: () => void;
  onCategoryUnassign: (id: string) => void;
  onCollectionAssign: () => void;
  onCollectionUnassign: (id: string) => void;
  onCountryAssign: () => void;
  onCountryUnassign: (code: string) => void;
  onProductAssign: () => void;
  onProductUnassign: (id: string) => void;
  onVariantAssign: () => void;
  onVariantUnassign: (id: string) => void;
  catalogueNumberOfRows: number;
  onCatalogueListSettingsUpdate: (key: "rowNumber", value: number) => void;
  onMultipleVoucherCodesGenerate: (data: GenerateMultipleVoucherCodeFormData) => void;
  onCustomVoucherCodeGenerate: (code: string) => void;
  onDeleteVoucherCodes: () => Promise<boolean>;
  onSelectedCodesChange: (ids: string[]) => void;
  onVoucherCodesSettingsChange: UseListSettings["updateListSettings"];
  voucherWidgets: ExtensionWithParams[];
  disabled?: boolean;
}

export const VoucherDetailsPageFormContent = ({
  form,
  activeTab,
  tabItemsCount,
  errors,
  localErrors,
  saveButtonBarState,
  voucher,
  allChannelsCount,
  channelListings,
  savedChannelListings,
  initialUsageLimit,
  selectedVoucherCodesIds,
  voucherCodes,
  addedVoucherCodes,
  pendingRemovedCodeIds = [],
  hasCatalogueDraftChanges = false,
  hasCountriesDraftChanges = false,
  voucherCodesLoading,
  voucherCodesPagination,
  voucherCodesSettings,
  deleteVoucherCodesTransitionState,
  voucherListBackLink,
  menuItems,
  canTranslate,
  onTranslate,
  onShowMetadata,
  setupEmphasized = false,
  setupCardDismissed = false,
  setupCardDisplayReady = true,
  onDismissSetupCard,
  onCancel,
  onSubmit,
  onTabClick,
  openChannelsModal,
  onChannelsChange,
  onCategoryAssign,
  onCategoryUnassign,
  onCollectionAssign,
  onCollectionUnassign,
  onCountryAssign,
  onCountryUnassign,
  onProductAssign,
  onProductUnassign,
  onVariantAssign,
  onVariantUnassign,
  catalogueNumberOfRows,
  onCatalogueListSettingsUpdate,
  onMultipleVoucherCodesGenerate,
  onCustomVoucherCodeGenerate,
  onDeleteVoucherCodes,
  onSelectedCodesChange,
  onVoucherCodesSettingsChange,
  voucherWidgets,
  disabled,
  isChecked,
  selected,
  toggle,
  toggleAll,
  categoryListToolbar,
  collectionListToolbar,
  productListToolbar,
  variantListToolbar,
}: VoucherDetailsPageFormContentProps) => {
  const intl = useIntl();
  const { data, change, set, triggerChange, changedData, setIsSubmitDisabled } = form;
  const allErrors = [...localErrors, ...errors];
  const countriesErrorMessage = formatVoucherCountriesErrorMessage(allErrors, intl);
  // Form mounts only after voucher exists — keep type-dependent sections gated on data.
  const visibility = resolveVoucherSectionVisibility(data);
  const showCatalogue = visibility.showCatalogue;
  const showCountries = visibility.showCountries;
  const sectionNavItems = useVoucherSectionNavItems({ showCatalogue, showCountries });
  const sectionIds = getVoucherSectionIds({ showCatalogue, showCountries });
  const { activeId, selectSection } = useVoucherSectionScrollSpy({ sectionIds });
  // Prefer live view state for channels/codes — form.initial merge can lag one frame
  // behind channel-modal confirm and draft-code generate.
  const saveComposition = buildVoucherSaveComposition(
    Object.keys(changedData),
    channelListings,
    savedChannelListings,
    addedVoucherCodes.length,
    {
      hasCatalogue: hasCatalogueDraftChanges,
      hasCountries: hasCountriesDraftChanges,
      pendingRemovedCodesCount: pendingRemovedCodeIds.length,
      discountType: data.discountType,
    },
  );
  const hasUnsavedChanges = hasVoucherSaveComposition(saveComposition);
  const isSaveDisabled = !!disabled || !hasUnsavedChanges;
  const submitData: VoucherDetailsPageFormData = {
    ...data,
    channelListings,
    codes: addedVoucherCodes,
  };

  setIsSubmitDisabled(isSaveDisabled);

  // Keep form channel drafts aligned with the view after channel-modal confirm
  // (modal writes parent state only; price/paste already dual-write).
  useEffect(() => {
    if (!isEqual(data.channelListings, channelListings)) {
      set({ channelListings });
    }
  }, [channelListings, data.channelListings, set]);

  const setupReadiness = getVoucherSetupReadiness({
    voucher,
    formData: data,
    voucherCodes,
    pendingRemovedCodesCount: pendingRemovedCodeIds.length,
    tabItemsCount,
    countriesCount: voucher?.countries?.length ?? 0,
  });
  const showSetupCard =
    !!voucher &&
    setupCardDisplayReady &&
    (setupEmphasized || (!setupCardDismissed && !setupReadiness.coreReady));

  const handleChannelsChange = (channels: ChannelVoucherData[]) => {
    set({ channelListings: channels });
    onChannelsChange(channels);
  };

  // Must update form state in the same tick — controlled price inputs bind to
  // `data.channelListings`, not parent channel state alone. Exit dirty is derived
  // from save composition (FormDirtyStateSync), not ad-hoc triggerChange.
  const handleChannelChange = createChannelsChangeHandler(
    data.channelListings,
    channels => {
      set({ channelListings: channels });
      onChannelsChange(channels);
    },
    () => undefined,
  );

  return (
    <DetailPageLayout>
      <FormDirtyStateSync
        enabled={!!voucher}
        isSaveDisabled={!hasUnsavedChanges}
        triggerChange={triggerChange}
      />
      <TopNav
        href={voucherListBackLink}
        hrefIcon={<TopNavDestinationIcon.discounts />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.allVouchers)}
        title={<VoucherDetailsTitle voucher={voucher} name={data.name} />}
        actionsGap={3}
      >
        <TopNav.MetadataButton
          title={intl.formatMessage({
            defaultMessage: "Edit voucher metadata",
            description: "voucher metadata button title",
            id: "sT2PzH",
          })}
          onClick={onShowMetadata}
          data-test-id="show-voucher-metadata"
        />
        {canTranslate && <TranslationsButton onClick={onTranslate} />}
        {menuItems.length > 0 && <TopNav.Menu items={menuItems} dataTestId="menu" />}
      </TopNav>
      <DetailPageLayout.Content>
        {showSetupCard ? (
          <VoucherSetupCard
            readiness={setupReadiness}
            disabled={disabled}
            onManageChannels={openChannelsModal}
            onDismiss={
              onDismissSetupCard
                ? () => {
                    onDismissSetupCard();
                  }
                : undefined
            }
          />
        ) : null}
        <DetailPageSectionLayout
          nav={
            <VoucherSectionNav
              items={sectionNavItems}
              activeId={activeId}
              onSelect={selectSection}
            />
          }
        >
          <VoucherSection id={voucherSectionIds.details}>
            <VoucherInfo data={data} disabled={disabled} errors={errors} onChange={change} />
          </VoucherSection>
          <VoucherSection id={voucherSectionIds.codes}>
            <VoucherCodesCard
              selectedCodesIds={selectedVoucherCodesIds}
              onSelectedCodesChange={onSelectedCodesChange}
              onDeleteCodes={onDeleteVoucherCodes}
              deleteCodesTransitionState={deleteVoucherCodesTransitionState}
              loading={voucherCodesLoading}
              onMultiCodesGenerate={onMultipleVoucherCodesGenerate}
              onCustomCodeGenerate={onCustomVoucherCodeGenerate}
              disabled={disabled}
              codes={voucherCodes}
              voucherCodesPagination={voucherCodesPagination}
              onSettingsChange={onVoucherCodesSettingsChange}
              settings={voucherCodesSettings}
              errors={errors}
            />
          </VoucherSection>
          <VoucherSection id={voucherSectionIds.discount}>
            <VoucherDiscountSection
              data={data}
              disabled={disabled}
              errors={allErrors}
              onChange={change}
              onChannelChange={handleChannelChange}
              onChannelsChange={handleChannelsChange}
            />
          </VoucherSection>
          {showCatalogue && (
            <VoucherSection id={voucherSectionIds.catalogue}>
              <VoucherCatalogueSection
                activeTab={activeTab}
                tabItemsCount={tabItemsCount}
                disabled={disabled}
                errors={allErrors}
                onTabClick={onTabClick}
                categories={mapEdgesToItems(voucher?.categories)}
                collections={mapEdgesToItems(voucher?.collections)}
                products={mapEdgesToItems(voucher?.products) as unknown as SearchProductFragment[]}
                variants={voucher?.variants}
                onCategoryAssign={onCategoryAssign}
                onCategoryUnassign={onCategoryUnassign}
                onCollectionAssign={onCollectionAssign}
                onCollectionUnassign={onCollectionUnassign}
                onProductAssign={onProductAssign}
                onProductUnassign={onProductUnassign}
                onVariantAssign={onVariantAssign}
                onVariantUnassign={onVariantUnassign}
                numberOfRows={catalogueNumberOfRows}
                onUpdateListSettings={onCatalogueListSettingsUpdate}
                isChecked={isChecked}
                selected={selected}
                toggle={toggle}
                toggleAll={toggleAll}
                categoryListToolbar={categoryListToolbar}
                collectionListToolbar={collectionListToolbar}
                productListToolbar={productListToolbar}
                variantListToolbar={variantListToolbar}
              />
            </VoucherSection>
          )}
          {showCountries && (
            <VoucherSection id={voucherSectionIds.countries}>
              <CountryList
                countries={voucher?.countries}
                disabled={disabled}
                emptyText={intl.formatMessage({
                  id: "jd/LWa",
                  defaultMessage: "Voucher applies to all countries",
                })}
                summaryContext="voucher"
                title={intl.formatMessage({
                  id: "ibnmEd",
                  defaultMessage: "Countries",
                  description: "voucher country range",
                })}
                description={
                  <FormattedMessage
                    id="glT6fm"
                    defaultMessage="Voucher is limited to these countries"
                  />
                }
                errorMessage={countriesErrorMessage}
                onCountryAssign={onCountryAssign}
                onCountryUnassign={onCountryUnassign}
              />
            </VoucherSection>
          )}
          <VoucherSection id={voucherSectionIds.requirements}>
            <VoucherRequirements
              data={data}
              disabled={disabled}
              errors={allErrors}
              onChange={change}
              onChannelChange={handleChannelChange}
              onChannelsChange={handleChannelsChange}
            />
          </VoucherSection>
          <VoucherSection id={voucherSectionIds.limits}>
            <VoucherLimits
              data={data}
              initialUsageLimit={initialUsageLimit}
              disabled={disabled}
              errors={errors}
              onChange={change}
              setData={set}
              isNewVoucher={false}
            />
          </VoucherSection>
        </DetailPageSectionLayout>
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar paddingTop={6}>
        <Box display="flex" flexDirection="column" gap={4}>
          <VoucherRedemptionsCard
            used={data.used}
            hasUsageLimit={data.hasUsageLimit}
            usageLimit={data.usageLimit}
            codesCount={Math.max(
              0,
              (voucher?.codesCount?.totalCount ?? 0) +
                addedVoucherCodes.length -
                pendingRemovedCodeIds.length,
            )}
            channelsCount={data.channelListings.length}
            scheduleData={{
              startDate: data.startDate,
              startTime: data.startTime,
              hasEndDate: data.hasEndDate,
              endDate: data.endDate,
              endTime: data.endTime,
            }}
          />
          <VoucherScheduleCard
            data={{
              startDate: data.startDate,
              startTime: data.startTime,
              hasEndDate: data.hasEndDate,
              endDate: data.endDate,
              endTime: data.endTime,
            }}
            errors={errors}
            disabled={disabled}
            onChange={change}
          />
          <VoucherChannelAvailabilityCard
            channels={channelListings}
            totalChannelsCount={allChannelsCount}
            disabled={disabled}
            managePermissions={[PermissionEnum.MANAGE_DISCOUNTS]}
            onManageClick={openChannelsModal}
            scheduleData={{
              startDate: data.startDate,
              startTime: data.startTime,
              hasEndDate: data.hasEndDate,
              endDate: data.endDate,
              endTime: data.endTime,
            }}
          />
          {voucherWidgets.length > 0 && voucher?.id && (
            <Box paddingX={6}>
              <Divider />
              <AppWidgets extensions={voucherWidgets} params={{ voucherId: voucher?.id }} />
            </Box>
          )}
        </Box>
      </DetailPageLayout.RightSidebar>
      <Savebar>
        <Savebar.Spacer />
        <VoucherSaveCompositionHint composition={saveComposition} />
        <Savebar.CancelButton onClick={onCancel} />
        <Savebar.ConfirmButton
          transitionState={saveButtonBarState}
          onClick={() => onSubmit(submitData)}
          disabled={isSaveDisabled}
        />
      </Savebar>
    </DetailPageLayout>
  );
};
