// @ts-strict-ignore
import { ChannelDeliveryCard } from "@dashboard/channels/components/ChannelDeliveryCard/ChannelDeliveryCard";
import { ChannelInventoryCard } from "@dashboard/channels/components/ChannelInventoryCard/ChannelInventoryCard";
import { channelSectionIds } from "@dashboard/channels/components/ChannelSectionNav/channelSectionIds";
import {
  ChannelSectionNav,
  type ChannelSectionNavItem,
} from "@dashboard/channels/components/ChannelSectionNav/ChannelSectionNav";
import { messages as sectionNavMessages } from "@dashboard/channels/components/ChannelSectionNav/messages";
import { useChannelSectionScrollSpy } from "@dashboard/channels/components/ChannelSectionNav/useChannelSectionScrollSpy";
import { defaultGraphiQLQuery } from "@dashboard/channels/queries";
import { channelsListUrl } from "@dashboard/channels/urls";
import { getChannelCreateDefaults } from "@dashboard/channels/utils/getChannelCreateDefaults";
import { getSuggestedCurrencyCode } from "@dashboard/channels/utils/getSuggestedCurrencyCode";
import { validateChannelFormData } from "@dashboard/channels/validation";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import CardSpacer from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form from "@dashboard/components/Form";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { Savebar } from "@dashboard/components/Savebar";
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
import { Box, type Option } from "@saleor/macaw-ui-next";
import { Receipt, Trash2 } from "lucide-react";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { ChannelForm, type FormData } from "../../components/ChannelForm";
import { ChannelStatus } from "../../components/ChannelStatus/ChannelStatus";
import {
  createShippingZoneRemoveHandler,
  createWarehouseRemoveHandler,
  createWarehouseReorderHandler,
} from "./handlers";
import { messages } from "./messages";
import { type ChannelShippingZones, type ChannelWarehouses } from "./types";
import { parseDateTimeToDateAndTime } from "./utils";

interface ChannelDetailsPageProps<TErrors extends ChannelErrorFragment[]> {
  channel?: ChannelDetailsFragment;
  currencyCodes?: Option[];
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
  /** Opens in-place warehouse create when the shop has none yet. */
  onCreateWarehouse?: () => void;
  /** Opens assign-warehouse dialog for the inventory card. */
  onAssignWarehouse?: () => void;
  /** `warehouseCreate` requires MANAGE_PRODUCTS. */
  canCreateWarehouse?: boolean;
  /** Opens in-place shipping create when the shop has none yet. */
  onCreateShipping?: () => void;
  /** Opens assign-shipping dialog for the delivery card. */
  onAssignShipping?: () => void;
  onDelete?: () => void;
  onShowMetadata?: () => void;
  onSubmit: (data: FormData) => SubmitPromise<TErrors>;
  updateChannelStatus?: () => void;
}

const ChannelDetailsPage = function <TErrors extends ChannelErrorFragment[]>({
  channel,
  currencyCodes,
  disabled,
  disabledStatus,
  onSubmit,
  errors,
  onDelete,
  saveButtonBarState,
  updateChannelStatus,
  channelShippingZones = [],
  allShippingZonesCount = 0,
  channelWarehouses = [],
  allWarehousesCount = 0,
  countries,
  setupCard,
  onCreateWarehouse,
  onAssignWarehouse,
  canCreateWarehouse = false,
  onCreateShipping,
  onAssignShipping,
  onShowMetadata,
}: ChannelDetailsPageProps<TErrors>) {
  const navigate = useNavigator();
  const intl = useIntl();
  const devMode = useDevModeContext();
  const isCreate = !channel;
  const channelId = channel?.id;
  const taxConfigurationId = channel?.taxConfiguration?.id;
  const createDefaults = getChannelCreateDefaults();
  const sectionNavItems = useMemo((): ChannelSectionNavItem[] => {
    if (isCreate) {
      return [];
    }

    return [
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
        label: intl.formatMessage(sectionNavMessages.payments),
      },
    ];
  }, [intl, isCreate]);
  const sectionIds = useMemo(() => sectionNavItems.map(item => item.id), [sectionNavItems]);
  const { activeId: activeSectionId, selectSection } = useChannelSectionScrollSpy({ sectionIds });
  const openPlaygroundURL = useCallback(() => {
    if (!channelId) {
      return;
    }

    devMode.setDevModeContent(defaultGraphiQLQuery);
    devMode.setVariables(`{ "id": "${channelId}" }`);
    devMode.setDevModeVisibility(true);
  }, [channelId, devMode]);
  const menuItems = useMemo((): TopNavMenuItem[] => {
    if (isCreate) {
      return [];
    }

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
  }, [channelId, taxConfigurationId, intl, isCreate, navigate, onDelete, openPlaygroundURL]);
  const [validationErrors, setValidationErrors] = useState<ChannelErrorFragment[]>([]);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState("");
  const [currencyManuallyEdited, setCurrencyManuallyEdited] = useState(false);
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
  const initialData: FormData = {
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
  };
  const handleSubmit = async (data: FormData) => {
    const errors = validateChannelFormData(data);

    setValidationErrors(errors);

    if (errors.length) {
      return errors;
    }

    return onSubmit(data);
  };

  return (
    <Form confirmLeave onSubmit={handleSubmit} initial={initialData}>
      {({ change, data, submit, set, triggerChange }) => {
        const handleCurrencyCodeSelect = (event: ChangeEvent) => {
          setCurrencyManuallyEdited(true);
          createSingleAutocompleteSelectHandler(
            change,
            setSelectedCurrencyCode,
            currencyCodes,
          )(event);
        };
        const handleDefaultCountrySelect = (event: ChangeEvent) => {
          createSingleAutocompleteSelectHandler(
            change,
            setSelectedCountryDisplayName,
            countryChoices,
          )(event);

          if (isCreate && !currencyManuallyEdited) {
            const suggested = getSuggestedCurrencyCode(String(event.target.value));

            if (suggested) {
              setSelectedCurrencyCode(suggested);
              change({
                target: {
                  name: "currencyCode",
                  value: suggested,
                },
              });
            }
          }
        };
        const removeShippingZone = createShippingZoneRemoveHandler(data, set, triggerChange);
        const removeWarehouse = createWarehouseRemoveHandler(data, set, triggerChange);
        const reorderWarehouse = createWarehouseReorderHandler(data, set);
        const allErrors = [...errors, ...validationErrors];
        const channelFormProps = {
          data,
          disabled,
          currencyCodes,
          countries: countryChoices,
          selectedCurrencyCode,
          selectedCountryDisplayName,
          savedAutomaticallyCompleteCheckouts:
            checkoutSettings?.automaticallyCompleteFullyPaidCheckouts ?? false,
          savedAutomaticCompletionCutOffDate: cutOffDateTime.date,
          savedAutomaticCompletionCutOffTime: cutOffDateTime.time,
          onChange: change,
          onCurrencyCodeChange: handleCurrencyCodeSelect,
          onDefaultCountryChange: handleDefaultCountrySelect,
          errors: allErrors,
        };

        return (
          <DetailPageLayout gridTemplateColumns={isCreate ? 1 : 12}>
            <TopNav
              href={channelsListUrl()}
              title={
                channel?.name ||
                intl.formatMessage({
                  id: "DnghuS",
                  defaultMessage: "New Channel",
                  description: "channel create",
                })
              }
              actionsGap={3}
            >
              {!isCreate && onShowMetadata && (
                <TopNav.MetadataButton
                  onClick={onShowMetadata}
                  disabled={!channel}
                  data-test-id="show-channel-metadata"
                  title={intl.formatMessage(messages.editChannelMetadata)}
                />
              )}
              {menuItems.length > 0 && <TopNav.Menu items={menuItems} dataTestId="menu" />}
            </TopNav>
            <DetailPageLayout.Content>
              {setupCard}
              {isCreate ? (
                <ChannelForm {...channelFormProps} isCreate />
              ) : (
                <Box display="flex" gap={8} paddingX={6} paddingBottom={6}>
                  <Box
                    display={{ mobile: "none", tablet: "block", desktop: "block" }}
                    flexShrink="0"
                  >
                    <ChannelSectionNav
                      items={sectionNavItems}
                      activeId={activeSectionId}
                      onSelect={selectSection}
                    />
                  </Box>
                  <Box flexGrow="1" __minWidth="0">
                    <ChannelForm {...channelFormProps} sectionLayout />
                  </Box>
                </Box>
              )}
            </DetailPageLayout.Content>
            {!isCreate && (
              <DetailPageLayout.RightSidebar>
                {!!updateChannelStatus && (
                  <>
                    <ChannelStatus
                      isActive={channel?.isActive}
                      disabled={disabledStatus}
                      updateChannelStatus={updateChannelStatus}
                    />
                    <CardSpacer />
                  </>
                )}
                <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_SHIPPING]}>
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
                  <CardSpacer />
                </RequirePermissions>
                <RequirePermissions
                  oneOfPermissions={[
                    PermissionEnum.MANAGE_SHIPPING,
                    PermissionEnum.MANAGE_ORDERS,
                    PermissionEnum.MANAGE_PRODUCTS,
                  ]}
                >
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
                </RequirePermissions>
              </DetailPageLayout.RightSidebar>
            )}
            <Savebar>
              {!isCreate && <Savebar.DeleteButton onClick={onDelete} />}
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(channelsListUrl())} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={disabled}
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
