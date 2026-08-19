// @ts-strict-ignore
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { type CatalogProductThumbnail } from "@dashboard/channels/components/ChannelCatalogSection/CatalogProductThumbnailStack";
import { ChannelDeliveryCard } from "@dashboard/channels/components/ChannelDeliveryCard/ChannelDeliveryCard";
import { messages as channelFormMessages } from "@dashboard/channels/components/ChannelForm/messages";
import { ChannelInventoryCard } from "@dashboard/channels/components/ChannelInventoryCard/ChannelInventoryCard";
import { ChannelPaymentGatewaysSection } from "@dashboard/channels/components/ChannelPaymentGatewaysSection/ChannelPaymentGatewaysSection";
import { ChannelReviewSections } from "@dashboard/channels/components/ChannelReviewSections/ChannelReviewSections";
import { channelSectionIds } from "@dashboard/channels/components/ChannelSectionNav/channelSectionIds";
import {
  ChannelSection,
  ChannelSectionNav,
  type ChannelSectionNavItem,
} from "@dashboard/channels/components/ChannelSectionNav/ChannelSectionNav";
import { ChannelSectionScrollProvider } from "@dashboard/channels/components/ChannelSectionNav/ChannelSectionScrollContext";
import { messages as sectionNavMessages } from "@dashboard/channels/components/ChannelSectionNav/messages";
import { useChannelSectionScrollSpy } from "@dashboard/channels/components/ChannelSectionNav/useChannelSectionScrollSpy";
import { type ChannelPaymentApp } from "@dashboard/channels/hooks/useChannelPaymentApps";
import { defaultGraphiQLQuery } from "@dashboard/channels/queries";
import { channelsListUrl } from "@dashboard/channels/urls";
import { getChannelCreateDefaults } from "@dashboard/channels/utils/getChannelCreateDefaults";
import { validateChannelFormData } from "@dashboard/channels/validation";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import CardSpacer from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageSectionLayout } from "@dashboard/components/DetailPageSectionLayout/DetailPageSectionLayout";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form, { FormDirtyStateSync } from "@dashboard/components/Form";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { hasOneOfPermissions, hasPermissions } from "@dashboard/components/RequirePermissions";
import { Savebar } from "@dashboard/components/Savebar";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import {
  type ChannelDetailsFragment,
  type ChannelErrorFragment,
  type CountryCode,
  type CountryFragment,
  PermissionEnum,
} from "@dashboard/graphql";
import { type ChangeEvent, type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { taxConfigurationListUrl } from "@dashboard/taxes/urls";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { Box } from "@saleor/macaw-ui-next";
import { Copy, ListChecks, Receipt, Trash2 } from "lucide-react";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { ChannelForm, type FormData } from "../../components/ChannelForm";
import { ChannelStatus } from "../../components/ChannelStatus/ChannelStatus";
import {
  type ChannelAssignmentActionsRef,
  type ChannelDisplayedAssignmentIds,
} from "./ChannelAssignmentActions";
import { ChannelAssignmentActionsBridge } from "./ChannelAssignmentActionsBridge";
import { ChannelDetailsTitle } from "./ChannelDetailsTitle";
import { isChannelUpdateFormPristine, mergeChannelFormData } from "./channelFormPristine";
import { ChannelSaveCompositionHint } from "./ChannelSaveCompositionHint";
import {
  createShippingZoneAddHandler,
  createShippingZoneRemoveHandler,
  createWarehouseAddHandler,
  createWarehouseRemoveHandler,
  createWarehouseReorderHandler,
} from "./handlers";
import { messages } from "./messages";
import { buildChannelSaveComposition } from "./saveComposition";
import { type ChannelShippingZones, type ChannelWarehouses } from "./types";
import { parseDateTimeToDateAndTime } from "./utils";

interface ChannelDetailsPageProps<TErrors extends ChannelErrorFragment[]> {
  channel?: ChannelDetailsFragment;
  /** True while the channel query is in flight. */
  loading?: boolean;
  disabled: boolean;
  disabledStatus?: boolean;
  errors: ChannelErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  channelShippingZones?: ChannelShippingZones;
  /** Shop-wide shipping zone count (edit sidebar). */
  allShippingZonesCount?: number;
  channelWarehouses?: ChannelWarehouses;
  /** Shop-wide warehouse count (edit sidebar). */
  allWarehousesCount?: number;
  countries: CountryFragment[];
  /** Setup checklist + in-flow create actions (edit only). */
  setupCard?: ReactNode;
  /** Installed payment apps for the Payment gateways section. */
  paymentApps?: ChannelPaymentApp[];
  paymentAppsLoading?: boolean;
  hasMorePaymentApps?: boolean;
  showPaymentGatewaysSection?: boolean;
  /** Setup review row stats for tax/catalog shortcut panels. */
  paymentAppsCount?: number;
  publishedProductCount?: number;
  unpublishedProductCount?: number;
  listedInChannelCount?: number;
  totalProductCount?: number;
  recentlyPublishedProducts?: CatalogProductThumbnail[];
  canViewCatalogStats?: boolean;
  catalogStatsError?: boolean;
  catalogStatsLoading?: boolean;
  onBulkPublishCatalog?: () => void;
  onCreateWarehouse?: () => void;
  /** Opens assign-warehouse dialog for the inventory card. */
  onAssignWarehouse?: () => void;
  /** `warehouseCreate` requires MANAGE_PRODUCTS. */
  canCreateWarehouse?: boolean;
  /** Opens in-place shipping create when the shop has none yet. */
  onCreateShipping?: () => void;
  /** Opens assign-shipping dialog for the delivery card. */
  onAssignShipping?: () => void;
  /**
   * Refs filled with form-staged assign actions / displayed ids so URL-driven
   * dialogs in the view can stage membership until Save and filter choices.
   */
  assignmentActionsRef?: ChannelAssignmentActionsRef;
  onDisplayedAssignmentIdsChange?: (ids: ChannelDisplayedAssignmentIds) => void;
  onDelete?: () => void;
  /** Opens create dialog prefilled from this channel's settings and assignments. */
  onDuplicate?: () => void;
  /**
   * Reopens the setup checklist (clears local dismiss + emphasizes setup).
   * Shown in the cogs menu when the card is currently hidden.
   */
  onShowSetupChecklist?: () => void;
  onShowMetadata?: () => void;
  onSubmit: (data: FormData) => SubmitPromise<TErrors>;
  /** Opens activate/deactivate confirmation (live action, not part of Save). */
  onToggleChannelStatus?: () => void;
}

const ChannelDetailsPage = function <TErrors extends ChannelErrorFragment[]>({
  channel,
  loading = false,
  disabled,
  disabledStatus,
  onSubmit,
  errors,
  onDelete,
  onDuplicate,
  onShowSetupChecklist,
  saveButtonBarState,
  channelShippingZones = [],
  allShippingZonesCount = 0,
  channelWarehouses = [],
  allWarehousesCount = 0,
  countries,
  setupCard,
  paymentApps = [],
  paymentAppsLoading = false,
  hasMorePaymentApps = false,
  showPaymentGatewaysSection = false,
  paymentAppsCount,
  publishedProductCount,
  unpublishedProductCount,
  listedInChannelCount,
  totalProductCount,
  recentlyPublishedProducts,
  canViewCatalogStats,
  catalogStatsError,
  catalogStatsLoading,
  onBulkPublishCatalog,
  onCreateWarehouse,
  onAssignWarehouse,
  canCreateWarehouse = false,
  onCreateShipping,
  onAssignShipping,
  assignmentActionsRef,
  onDisplayedAssignmentIdsChange,
  onShowMetadata,
  onToggleChannelStatus,
}: ChannelDetailsPageProps<TErrors>) {
  const navigate = useNavigator();
  const intl = useIntl();
  const devMode = useDevModeContext();
  const userPermissions = useUserPermissions() ?? [];
  const isEditLoading = loading && !channel;
  // Status moved to the header — don't leave an empty bordered sidebar column.
  const showDeliveryCard = hasPermissions(userPermissions, [PermissionEnum.MANAGE_SHIPPING]);
  const showInventoryCard = hasOneOfPermissions(userPermissions, [
    PermissionEnum.MANAGE_SHIPPING,
    PermissionEnum.MANAGE_ORDERS,
    PermissionEnum.MANAGE_PRODUCTS,
  ]);
  const showRightSidebar = showDeliveryCard || showInventoryCard;
  const channelId = channel?.id;
  const taxConfigurationId = channel?.taxConfiguration?.id;
  const createDefaults = getChannelCreateDefaults();
  const sectionNavItems = useMemo((): ChannelSectionNavItem[] => {
    const items: ChannelSectionNavItem[] = [
      {
        id: channelSectionIds.general,
        label: intl.formatMessage(sectionNavMessages.general),
      },
      {
        id: channelSectionIds.orders,
        label: intl.formatMessage(sectionNavMessages.orders),
      },
      {
        id: channelSectionIds.payments,
        label: intl.formatMessage(channelFormMessages.paymentsCheckoutSectionTitle),
      },
    ];

    if (showPaymentGatewaysSection) {
      items.push({
        id: channelSectionIds.paymentGateways,
        label: intl.formatMessage(sectionNavMessages.paymentGateways),
      });
    }

    items.push(
      {
        id: channelSectionIds.catalog,
        label: intl.formatMessage(sectionNavMessages.catalog),
      },
      {
        id: channelSectionIds.taxes,
        label: intl.formatMessage(sectionNavMessages.taxes),
      },
    );

    return items;
  }, [intl, showPaymentGatewaysSection]);
  const sectionIds = useMemo(() => sectionNavItems.map(item => item.id), [sectionNavItems]);
  const { activeId: activeSectionId, selectSection } = useChannelSectionScrollSpy({
    sectionIds,
    enabled: !isEditLoading,
  });
  const paymentGatewaysSection = showPaymentGatewaysSection ? (
    <ChannelSection id={channelSectionIds.paymentGateways}>
      <ChannelPaymentGatewaysSection
        apps={paymentApps}
        loading={paymentAppsLoading}
        hasMoreApps={hasMorePaymentApps}
      />
    </ChannelSection>
  ) : null;
  const reviewSections = channel ? (
    <ChannelReviewSections
      taxConfigurationId={channel.taxConfiguration?.id}
      chargeTaxes={channel.taxConfiguration?.chargeTaxes}
      taxCalculationStrategy={channel.taxConfiguration?.taxCalculationStrategy}
      channel={{
        id: channel.id,
        name: channel.name,
        slug: channel.slug,
        currencyCode: channel.currencyCode,
      }}
      channelSlug={channel.slug}
      paymentAppsCount={paymentAppsCount}
      publishedProductCount={publishedProductCount}
      unpublishedProductCount={unpublishedProductCount}
      listedInChannelCount={listedInChannelCount}
      totalProductCount={totalProductCount}
      recentlyPublishedProducts={recentlyPublishedProducts}
      canViewCatalogStats={canViewCatalogStats}
      catalogStatsError={catalogStatsError}
      channelWarehouseCount={channelWarehouses.length}
      shopWarehouseCount={allWarehousesCount}
      catalogStatsLoading={catalogStatsLoading}
      onBulkPublishCatalog={onBulkPublishCatalog}
    />
  ) : null;
  const openPlaygroundURL = useCallback(() => {
    if (!channelId) {
      return;
    }

    devMode.setDevModeContent(defaultGraphiQLQuery);
    devMode.setVariables(`{ "id": "${channelId}" }`);
    devMode.setDevModeVisibility(true);
  }, [channelId, devMode]);
  const menuItems = useMemo((): TopNavMenuItem[] => {
    const items: TopNavMenuItem[] = [];

    if (taxConfigurationId) {
      items.push({
        label: intl.formatMessage(messages.taxSettings),
        onSelect: () => navigate(taxConfigurationListUrl(taxConfigurationId)),
        testId: "open-tax-settings",
        icon: <Receipt size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
    }

    if (channelId) {
      items.push({
        label: intl.formatMessage(messages.openGraphiQL),
        onSelect: openPlaygroundURL,
        testId: "graphiql-redirect",
        icon: <GraphqlIcon />,
      });
    }

    if (onDuplicate) {
      items.push({
        label: intl.formatMessage(messages.duplicateChannel),
        onSelect: onDuplicate,
        testId: "duplicate-channel",
        icon: <Copy size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
    }

    if (onShowSetupChecklist) {
      items.push({
        label: intl.formatMessage(messages.showSetupChecklist),
        onSelect: onShowSetupChecklist,
        testId: "show-setup-checklist",
        icon: <ListChecks size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
    }

    if (onDelete) {
      items.push({
        label: intl.formatMessage(messages.deleteChannel),
        onSelect: onDelete,
        testId: "delete-channel",
        color: "critical1",
        icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
    }

    return items;
  }, [
    channelId,
    taxConfigurationId,
    intl,
    navigate,
    onDelete,
    onDuplicate,
    onShowSetupChecklist,
    openPlaygroundURL,
  ]);
  const [validationErrors, setValidationErrors] = useState<ChannelErrorFragment[]>([]);
  const [selectedCountryDisplayName, setSelectedCountryDisplayName] = useStateFromProps(
    channel?.defaultCountry.country || "",
  );
  const countryChoices = mapCountriesToChoices(countries || []);
  const {
    defaultCountry,
    stockSettings,
    orderSettings,
    paymentSettings,
    checkoutSettings,
    taxConfiguration: _taxConfiguration,
    ...formData
  } = channel || ({} as ChannelDetailsFragment);
  const cutOffDateTime = parseDateTimeToDateAndTime(
    checkoutSettings?.automaticCompletionCutOffDate,
  );
  const initialData: FormData = useMemo(
    () => ({
      currencyCode: "",
      name: "",
      slug: "",
      shippingZonesIdsToAdd: [],
      shippingZonesIdsToRemove: [],
      warehousesIdsToAdd: [],
      warehousesIdsToRemove: [],
      defaultCountry: (defaultCountry?.code || "") as CountryCode,
      ...formData,
      allocationStrategy: stockSettings?.allocationStrategy ?? createDefaults.allocationStrategy,
      shippingZonesToDisplay: channelShippingZones,
      warehousesToDisplay: channelWarehouses,
      markAsPaidStrategy: orderSettings?.markAsPaidStrategy ?? createDefaults.markAsPaidStrategy,
      expireOrdersAfter: orderSettings?.expireOrdersAfter ?? createDefaults.expireOrdersAfter,
      deleteExpiredOrdersAfter:
        orderSettings?.deleteExpiredOrdersAfter ?? createDefaults.deleteExpiredOrdersAfter,
      allowUnpaidOrders: orderSettings?.allowUnpaidOrders ?? createDefaults.allowUnpaidOrders,
      automaticallyConfirmAllNewOrders:
        orderSettings?.automaticallyConfirmAllNewOrders ??
        createDefaults.automaticallyConfirmAllNewOrders,
      automaticallyFulfillNonShippableGiftCard:
        orderSettings?.automaticallyFulfillNonShippableGiftCard ??
        createDefaults.automaticallyFulfillNonShippableGiftCard,
      defaultTransactionFlowStrategy:
        paymentSettings?.defaultTransactionFlowStrategy ??
        createDefaults.defaultTransactionFlowStrategy,
      releaseFundsForExpiredCheckouts:
        paymentSettings?.releaseFundsForExpiredCheckouts ??
        createDefaults.releaseFundsForExpiredCheckouts,
      checkoutTtlBeforeReleasingFunds:
        paymentSettings?.checkoutTtlBeforeReleasingFunds ??
        createDefaults.checkoutTtlBeforeReleasingFunds,
      allowLegacyGiftCardUse:
        checkoutSettings?.allowLegacyGiftCardUse ?? createDefaults.allowLegacyGiftCardUse,
      automaticallyCompleteCheckouts:
        checkoutSettings?.automaticallyCompleteFullyPaidCheckouts ??
        createDefaults.automaticallyCompleteCheckouts,
      automaticCompletionDelay:
        checkoutSettings?.automaticCompletionDelay ?? createDefaults.automaticCompletionDelay,
      automaticCompletionCutOffDate: cutOffDateTime.date,
      automaticCompletionCutOffTime: cutOffDateTime.time,
    }),
    // Channel fragment + assigned lists are the saved baseline for pristine checks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channel, channelShippingZones, channelWarehouses],
  );
  const checkIfSaveIsDisabled = useCallback(
    (data: FormData) => {
      if (disabled) {
        return true;
      }

      return isChannelUpdateFormPristine(data, initialData);
    },
    [disabled, initialData],
  );
  const handleSubmit = async (data: FormData) => {
    const errors = validateChannelFormData(data);

    setValidationErrors(errors);

    if (errors.length) {
      return errors;
    }

    return onSubmit(data);
  };

  if (isEditLoading) {
    return (
      <DetailPageLayout gridTemplateColumns={showRightSidebar ? 12 : 1}>
        <TopNav
          href={channelsListUrl()}
          hrefIcon={<TopNavDestinationIcon.channels />}
          hrefTitle={intl.formatMessage(topNavDestinationMessages.allChannels)}
          title={null}
        />
        <DetailPageLayout.Content>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            paddingY={12}
            data-test-id="channel-details-loader"
          >
            <SaleorThrobber />
          </Box>
        </DetailPageLayout.Content>
        {showRightSidebar ? (
          <DetailPageLayout.RightSidebar paddingTop={6}>{null}</DetailPageLayout.RightSidebar>
        ) : null}
      </DetailPageLayout>
    );
  }

  return (
    <Form
      confirmLeave
      onSubmit={handleSubmit}
      initial={initialData}
      disabled={disabled}
      checkIfSaveIsDisabled={checkIfSaveIsDisabled}
      mergeFunc={mergeChannelFormData}
    >
      {({ change, data, submit, set, triggerChange, isSaveDisabled }) => {
        const saveComposition = channel
          ? buildChannelSaveComposition(data, initialData)
          : undefined;

        const handleDefaultCountrySelect = (event: ChangeEvent) => {
          createSingleAutocompleteSelectHandler(
            change,
            setSelectedCountryDisplayName,
            countryChoices,
          )(event);
        };
        const addShippingZone = createShippingZoneAddHandler(data, set);
        const removeShippingZone = createShippingZoneRemoveHandler(data, set);
        const addWarehouse = createWarehouseAddHandler(data, set);
        const removeWarehouse = createWarehouseRemoveHandler(data, set);
        const reorderWarehouse = createWarehouseReorderHandler(data, set);
        const allErrors = [...errors, ...validationErrors];
        const channelFormProps = {
          data,
          disabled,
          countries: countryChoices,
          selectedCountryDisplayName,
          savedAutomaticallyCompleteCheckouts:
            checkoutSettings?.automaticallyCompleteFullyPaidCheckouts ?? false,
          savedAutomaticCompletionCutOffDate: cutOffDateTime.date,
          savedAutomaticCompletionCutOffTime: cutOffDateTime.time,
          onChange: change,
          onDefaultCountryChange: handleDefaultCountrySelect,
          errors: allErrors,
        };

        return (
          <DetailPageLayout gridTemplateColumns={showRightSidebar ? 12 : 1}>
            <FormDirtyStateSync
              enabled={!!channel}
              isSaveDisabled={isSaveDisabled}
              triggerChange={triggerChange}
            />
            <ChannelAssignmentActionsBridge
              assignmentActionsRef={assignmentActionsRef}
              onDisplayedAssignmentIdsChange={onDisplayedAssignmentIdsChange}
              actions={{
                assignWarehouses: addWarehouse,
                assignShippingZones: addShippingZone,
              }}
              warehouseIds={data.warehousesToDisplay.map(warehouse => warehouse.id)}
              shippingZoneIds={(data.shippingZonesToDisplay ?? []).map(zone => zone.id)}
            />
            <TopNav
              href={channelsListUrl()}
              hrefIcon={<TopNavDestinationIcon.channels />}
              hrefTitle={intl.formatMessage(topNavDestinationMessages.allChannels)}
              title={channel ? <ChannelDetailsTitle channel={channel} /> : null}
              actionsGap={3}
            >
              {onToggleChannelStatus && (
                <ChannelStatus
                  isActive={!!channel?.isActive}
                  disabled={disabled || !!disabledStatus}
                  onClick={onToggleChannelStatus}
                />
              )}
              {onShowMetadata && (
                <TopNav.MetadataButton
                  onClick={onShowMetadata}
                  disabled={disabled || !channel}
                  data-test-id="show-channel-metadata"
                  title={intl.formatMessage(messages.editChannelMetadata)}
                />
              )}
              {menuItems.length > 0 && (
                <TopNav.Menu
                  items={
                    disabled ? menuItems.map(item => ({ ...item, disabled: true })) : menuItems
                  }
                  dataTestId="menu"
                />
              )}
            </TopNav>
            <DetailPageLayout.Content>
              <ChannelSectionScrollProvider selectSection={selectSection}>
                {setupCard}
                <DetailPageSectionLayout
                  nav={
                    <ChannelSectionNav
                      items={sectionNavItems}
                      activeId={activeSectionId}
                      onSelect={selectSection}
                    />
                  }
                >
                  <ChannelForm
                    {...channelFormProps}
                    sectionLayout
                    trailingSection={
                      <>
                        {paymentGatewaysSection}
                        {reviewSections}
                      </>
                    }
                  />
                </DetailPageSectionLayout>
              </ChannelSectionScrollProvider>
            </DetailPageLayout.Content>
            {showRightSidebar && (
              <DetailPageLayout.RightSidebar paddingTop={6}>
                {showInventoryCard && (
                  <>
                    <ChannelInventoryCard
                      warehouses={data.warehousesToDisplay}
                      removeWarehouse={removeWarehouse}
                      reorderWarehouses={reorderWarehouse}
                      disabled={disabled}
                      availableWarehousesCount={allWarehousesCount}
                      canCreateWarehouse={canCreateWarehouse}
                      onAssignWarehouse={onAssignWarehouse}
                      onCreateWarehouse={onCreateWarehouse}
                      allocationStrategy={data.allocationStrategy}
                      onAllocationStrategyChange={change}
                    />
                    {showDeliveryCard ? <CardSpacer /> : null}
                  </>
                )}
                {showDeliveryCard && (
                  <ChannelDeliveryCard
                    shippingZones={data.shippingZonesToDisplay}
                    removeShippingZone={removeShippingZone}
                    disabled={disabled}
                    availableShippingZonesCount={allShippingZonesCount}
                    // Card is gated by MANAGE_SHIPPING — same permission as shippingZoneCreate.
                    canCreateShipping
                    onAssignShipping={onAssignShipping}
                    onCreateShipping={onCreateShipping}
                  />
                )}
              </DetailPageLayout.RightSidebar>
            )}
            <Savebar>
              <Savebar.Spacer />
              <ChannelSaveCompositionHint composition={saveComposition} />
              <Savebar.CancelButton onClick={() => navigate(channelsListUrl())} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={isSaveDisabled}
              />
            </Savebar>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

ChannelDetailsPage.displayName = "ChannelDetailsPage";
export default ChannelDetailsPage;
