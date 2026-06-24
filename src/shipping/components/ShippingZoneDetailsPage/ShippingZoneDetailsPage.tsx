// @ts-strict-ignore
import { hasPermission } from "@dashboard/auth/misc";
import { useUser } from "@dashboard/auth/useUser";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { CountryList } from "@dashboard/components/CountryList";
import { useExitFormDialog } from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
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
import { shippingZonesListPath } from "@dashboard/shipping/urls";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { type Option } from "@saleor/macaw-ui-next";
import { useLayoutEffect, useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";

import { getStringOrPlaceholder } from "../../../misc";
import { type FetchMoreProps, type SearchProps } from "../../../types";
import { type ShippingZoneUpdateFormData } from "../../components/ShippingZoneDetailsPage/types";
import ShippingZoneInfo from "../ShippingZoneInfo";
import { ShippingZoneRates } from "../ShippingZoneRates/ShippingZoneRates";
import ShippingZoneSettingsCard from "../ShippingZoneSettingsCard";
import { ShippingZoneDetailsTitle } from "./Title";
import { getInitialFormData } from "./utils";

const messages = defineMessages({
  countries: {
    id: "55LMJv",
    defaultMessage: "Countries",
    description: "country list header",
  },
  noCountriesAssigned: {
    id: "y7mfbl",
    defaultMessage: "Currently, there are no countries assigned to this shipping zone",
  },
  shipping: {
    id: "G0+gAp",
    defaultMessage: "Shipping",
    description: "shipping section header",
  },
});

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
  const warehouseChoices = useMemo(() => {
    const searchChoices = warehouses.map(warehouseToChoice);
    const selectedNotInSearch = data.warehouses.filter(
      selectedWarehouse => !searchChoices.some(choice => choice.value === selectedWarehouse.value),
    );

    return [...searchChoices, ...selectedNotInSearch];
  }, [data.warehouses, warehouses]);
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
      <DetailPageLayout.Content paddingBottom={10}>
        <ShippingZoneInfo data={data} disabled={disabled} errors={errors} onChange={change} />
        <CardSpacer />
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
        <CardSpacer />
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
        <CardSpacer />
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
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar>
        <ShippingZoneSettingsCard
          formData={data}
          hasMoreWarehouses={hasMore}
          loading={loading}
          onWarehouseChange={change}
          onFetchMoreWarehouses={onFetchMore}
          onWarehousesSearchChange={onSearchChange}
          warehousesChoices={warehouseChoices}
          allChannels={allChannels}
          onChannelChange={change}
        />
      </DetailPageLayout.RightSidebar>
      <Savebar>
        <Savebar.DeleteButton onClick={onDelete} />
        <Savebar.Spacer />
        <Savebar.CancelButton onClick={() => navigate(shippingZonesListBackLink)} />
        <Savebar.ConfirmButton
          transitionState={saveButtonBarState}
          onClick={submit}
          disabled={isSaveDisabled}
        />
      </Savebar>
    </DetailPageLayout>
  );
};

ShippingZoneDetailsPage.displayName = "ShippingZoneDetailsPage";
