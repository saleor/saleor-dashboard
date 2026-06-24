// @ts-strict-ignore
import { hasPermission } from "@dashboard/auth/misc";
import { useUser } from "@dashboard/auth/useUser";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { CountryList } from "@dashboard/components/CountryList";
import Form from "@dashboard/components/Form";
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
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { shippingZonesListPath } from "@dashboard/shipping/urls";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { type Option } from "@saleor/macaw-ui-next";
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
  onWarehouseAdd: () => void;
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

const ShippingZoneDetailsPage = ({
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
  onWarehouseAdd,
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
  const initialForm = getInitialFormData(shippingZone);
  const warehouseChoices = warehouses.map(warehouseToChoice);
  const zoneChannels =
    shippingZone?.channels.map(channel => ({
      id: channel.id,
      name: channel.name,
      currencyCode: channel.currencyCode,
    })) ?? [];
  const shippingZonesListBackLink = useBackLinkWithState({
    path: shippingZonesListPath,
  });

  return (
    <Form initial={initialForm} onSubmit={onSubmit} confirmLeave disabled={disabled}>
      {({ change, data, isSaveDisabled, submit }) => {
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
                onWarehouseAdd={onWarehouseAdd}
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
      }}
    </Form>
  );
};

ShippingZoneDetailsPage.displayName = "ShippingZoneDetailsPage";
export default ShippingZoneDetailsPage;
