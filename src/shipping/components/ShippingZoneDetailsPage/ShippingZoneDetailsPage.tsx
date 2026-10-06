// @ts-strict-ignore
import { useApolloClient } from "@apollo/client";
import { hasPermission } from "@dashboard/auth/misc";
import { useUser } from "@dashboard/auth/useUser";
import ActionDialog from "@dashboard/components/ActionDialog/ActionDialog";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton/ConfirmButton";
import { CountryList } from "@dashboard/components/CountryList/CountryList";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { DetailPageLayout } from "@dashboard/components/Layouts/Detail";
import { Savebar } from "@dashboard/components/Savebar";
import {
  type ChannelFragment,
  PermissionEnum,
  type ShippingErrorFragment,
  ShippingMethodTypeEnum,
  type ShippingZoneDetailsFragment,
  type ShippingZoneQuery,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import useForm, { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useShippingZoneEditChanges } from "@dashboard/shipping/hooks/useShippingZoneEditChanges";
import {
  useLegacyStockAvailability,
  useZoneWarehouseEligibility,
  warehousesUnlinkedByRemovingZoneChannels,
} from "@dashboard/shipping/hooks/useZoneWarehouseEligibility";
import { shippingZonesListPath } from "@dashboard/shipping/urls";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { type Option } from "@saleor/macaw-ui-next";
import { useLayoutEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getStringOrPlaceholder } from "../../../misc";
import { type FetchMoreProps, type SearchProps } from "../../../types";
import { type ShippingZoneUpdateFormData } from "../../components/ShippingZoneDetailsPage/types";
import ShippingZoneInfo from "../ShippingZoneInfo/ShippingZoneInfo";
import { ShippingZoneRates } from "../ShippingZoneRates/ShippingZoneRates";
import ShippingZoneSettingsCard from "../ShippingZoneSettingsCard/ShippingZoneSettingsCard";
import { messages } from "./messages";
import { buildShippingZoneSaveComposition } from "./saveComposition";
import { ShippingZoneSaveCompositionHint } from "./ShippingZoneSaveCompositionHint";
import { ShippingZoneDetailsTitle } from "./Title";
import { getInitialFormData } from "./utils";

interface ShippingZoneDetailsPageProps extends FetchMoreProps, SearchProps {
  zoneLoading?: boolean;
  disabled: boolean;
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  shippingZone: ShippingZoneQuery["shippingZone"];
  warehouses: ShippingZoneDetailsFragment["warehouses"];
  onCountryAdd: () => void;
  onCountryRemove: (code: string) => void;
  onDelete: () => void;
  onShowMetadata: () => void;
  onFetchMore: () => void;
  onPriceRateAdd: () => void;
  getPriceRateEditHref: (id: string) => string;
  getRateChannelSetupHref: (rateId: string, channelId: string) => string;
  onRateRemove: (rateId: string) => void;
  onSubmit: (data: ShippingZoneUpdateFormData) => SubmitPromise;
  onWeightRateAdd: () => void;
  getWeightRateEditHref: (id: string) => string;
  allChannels?: ChannelFragment[];
}

function warehouseToChoice(warehouse: Record<"id" | "name", string>): Option {
  return {
    label: warehouse.name,
    value: warehouse.id,
  };
}

export const ShippingZoneDetailsPage = ({
  zoneLoading = false,
  disabled,
  errors,
  hasMore,
  loading,
  onCountryAdd,
  onCountryRemove,
  onDelete,
  onShowMetadata,
  onFetchMore,
  onPriceRateAdd,
  getPriceRateEditHref,
  getRateChannelSetupHref,
  onRateRemove,
  onSearchChange,
  onSubmit,
  onWeightRateAdd,
  getWeightRateEditHref,
  saveButtonBarState,
  shippingZone,
  warehouses,
  allChannels,
}: ShippingZoneDetailsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const getRateTranslationHref = canTranslate
    ? (rateId: string) =>
        languageEntityUrl(lastUsedLocaleOrFallback, TranslatableEntities.shippingMethods, rateId)
    : undefined;
  const initialForm = useMemo(() => getInitialFormData(shippingZone), [shippingZone]);
  const { change, data, formId, setIsSubmitDisabled, submit } = useForm(initialForm, onSubmit, {
    confirmLeave: true,
    disabled,
  });
  const { setIsDirty } = useExitFormDialog({ formId });
  const hasChanges = useShippingZoneEditChanges({
    formData: data,
    initialFormData: initialForm,
  });
  const saveComposition = buildShippingZoneSaveComposition(data, initialForm);
  const warehouseChoices = useMemo(() => {
    const searchChoices = warehouses.map(warehouseToChoice);
    const selectedNotInSearch = data.warehouses.filter(
      selectedWarehouse => !searchChoices.some(choice => choice.value === selectedWarehouse.value),
    );

    return [...searchChoices, ...selectedNotInSearch];
  }, [data.warehouses, warehouses]);
  const client = useApolloClient();
  const legacyStockAvailability = useLegacyStockAvailability();
  const [unlinkNames, setUnlinkNames] = useState<string[] | null>(null);
  const eligibilityWarehouses = useMemo(
    () => warehouseChoices.map(choice => ({ id: choice.value, name: String(choice.label) })),
    [warehouseChoices],
  );
  const channelIds = data.channels.map(channel => channel.value);
  const eligibility = useZoneWarehouseEligibility({
    warehouses: eligibilityWarehouses,
    channelIds,
  });
  const selectableChoices = eligibility.loading
    ? data.warehouses
    : warehouseChoices.filter(
        choice =>
          eligibility.eligible.some(warehouse => warehouse.id === choice.value) ||
          data.warehouses.some(selected => selected.value === choice.value),
      );
  const requestSave = async (): Promise<void> => {
    const originalChannelIds = new Set(initialForm.channels.map(channel => channel.value));
    const removedChannel = [...originalChannelIds].some(
      channelId => !channelIds.includes(channelId),
    );

    if (legacyStockAvailability === true && removedChannel && shippingZone) {
      try {
        const unlinked = await warehousesUnlinkedByRemovingZoneChannels({
          client,
          linked: shippingZone.warehouses.map(warehouse => ({
            id: warehouse.id,
            name: warehouse.name,
          })),
          remainingChannelIds: channelIds,
        });

        if (unlinked.length > 0) {
          setUnlinkNames(unlinked.map(warehouse => warehouse.name));

          return;
        }
      } catch {
        // The server still removes a link that no longer shares a channel.
      }
    }

    submit();
  };
  const zoneChannels =
    shippingZone?.channels.map(channel => ({
      id: channel.id,
      name: channel.name,
      currencyCode: channel.currencyCode,
    })) ?? [];
  const shippingZonesListBackLink = useBackLinkWithState({
    path: shippingZonesListPath,
  });
  const isSaveDisabled = disabled || !hasChanges;

  // Keep exit-dialog dirty state aligned with hasChanges. useForm.triggerChange can set
  // isDirty independently; re-sync every render so a stale true (e.g. multiselect blur
  // without edits) does not block navigation.
  useLayoutEffect(() => {
    setIsDirty(hasChanges);
  });

  setIsSubmitDisabled(isSaveDisabled);

  return (
    <DetailPageLayout>
      <TopNav
        href={shippingZonesListBackLink}
        hrefIcon={<TopNavDestinationIcon.shipping />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.allShippingZones)}
        title={<ShippingZoneDetailsTitle name={shippingZone?.name} loading={zoneLoading} />}
        actionsGap={3}
      >
        <TopNav.MetadataButton
          onClick={onShowMetadata}
          disabled={!shippingZone}
          data-test-id="show-shipping-zone-metadata"
          title={intl.formatMessage({
            defaultMessage: "Edit shipping zone metadata",
            description: "shipping zone detail page, top-bar metadata button tooltip",
            id: "6YUTdO",
          })}
        />
      </TopNav>
      <DetailPageLayout.Content>
        <DetailPageContent>
          <ShippingZoneInfo data={data} disabled={disabled} errors={errors} onChange={change} />
          <CountryList
            countries={zoneLoading ? undefined : shippingZone?.countries}
            disabled={disabled}
            emptyText={getStringOrPlaceholder(
              shippingZone && intl.formatMessage(messages.noCountriesAssigned),
            )}
            summaryContext="shipping-zone"
            onCountryAssign={onCountryAdd}
            onCountryUnassign={onCountryRemove}
            title={intl.formatMessage(messages.countries)}
          />
          <ShippingZoneRates
            disabled={disabled}
            onRateAdd={onPriceRateAdd}
            getRateEditHref={getPriceRateEditHref}
            getRateChannelSetupHref={getRateChannelSetupHref}
            getRateTranslationHref={getRateTranslationHref}
            onRateRemove={onRateRemove}
            rates={shippingZone?.shippingMethods?.filter(
              method => method.type === ShippingMethodTypeEnum.PRICE,
            )}
            variant="price"
            zoneChannels={zoneChannels}
            testId="add-price-rate"
          />
          <ShippingZoneRates
            disabled={disabled}
            onRateAdd={onWeightRateAdd}
            getRateEditHref={getWeightRateEditHref}
            getRateChannelSetupHref={getRateChannelSetupHref}
            getRateTranslationHref={getRateTranslationHref}
            onRateRemove={onRateRemove}
            rates={shippingZone?.shippingMethods?.filter(
              method => method.type === ShippingMethodTypeEnum.WEIGHT,
            )}
            variant="weight"
            zoneChannels={zoneChannels}
            testId="add-weight-rate"
          />
        </DetailPageContent>
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar>
        <ShippingZoneSettingsCard
          formData={data}
          hasMoreWarehouses={hasMore}
          loading={loading}
          onWarehouseChange={change}
          onFetchMoreWarehouses={onFetchMore}
          onWarehousesSearchChange={onSearchChange}
          warehousesChoices={selectableChoices}
          allChannels={allChannels}
          onChannelChange={change}
          legacyStockAvailability={legacyStockAvailability}
          ineligibleWarehouses={eligibility.ineligible}
          zoneChannelNames={data.channels.map(channel => String(channel.label))}
        />
      </DetailPageLayout.RightSidebar>
      <Savebar>
        <Savebar.DeleteButton onClick={onDelete} />
        <Savebar.Spacer />
        <ShippingZoneSaveCompositionHint composition={saveComposition} />
        <Savebar.CancelButton onClick={() => navigate(shippingZonesListBackLink)} />
        <Savebar.ConfirmButton
          transitionState={saveButtonBarState}
          onClick={requestSave}
          disabled={isSaveDisabled}
        />
      </Savebar>
      <ActionDialog
        open={unlinkNames !== null}
        title={intl.formatMessage(messages.unlinkWarehousesTitle)}
        confirmButtonState="default"
        variant="delete"
        onClose={() => setUnlinkNames(null)}
        onConfirm={() => {
          setUnlinkNames(null);
          submit();
        }}
      >
        <FormattedMessage
          {...messages.unlinkWarehousesBody}
          values={{ warehouses: unlinkNames?.join(", ") ?? "" }}
        />
      </ActionDialog>
    </DetailPageLayout>
  );
};

ShippingZoneDetailsPage.displayName = "ShippingZoneDetailsPage";
