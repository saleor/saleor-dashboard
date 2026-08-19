import { hasPermission } from "@dashboard/auth/misc";
import { useUser } from "@dashboard/auth/useUser";
import { type ChannelShippingData } from "@dashboard/channels/utils";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import CardSpacer from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { type WithFormId } from "@dashboard/components/Form";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import {
  PermissionEnum,
  type PostalCodeRuleInclusionTypeEnum,
  type ShippingChannelsErrorFragment,
  type ShippingErrorFragment,
  ShippingMethodTypeEnum,
  type ShippingMethodTypeFragment,
  type ShippingZoneQuery,
  type TaxClassBaseFragment,
} from "@dashboard/graphql";
import useForm, { type SubmitPromise } from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useStateUpdate } from "@dashboard/hooks/useStateUpdate";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { handleTaxClassChange } from "@dashboard/productTypes/handlers";
import OrderValue from "@dashboard/shipping/components/OrderValue";
import OrderWeight from "@dashboard/shipping/components/OrderWeight";
import PricingCard from "@dashboard/shipping/components/PricingCard";
import ShippingMethodProducts from "@dashboard/shipping/components/ShippingMethodProducts";
import ShippingRateInfo from "@dashboard/shipping/components/ShippingRateInfo";
import { useShippingRateChannels } from "@dashboard/shipping/hooks/useShippingRateChannels";
import { useShippingRateEditChanges } from "@dashboard/shipping/hooks/useShippingRateEditChanges";
import { shippingMethodGraphiQLQuery } from "@dashboard/shipping/queries";
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { type FetchMoreProps, type ListActions, type ListProps } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { RichTextContext } from "@dashboard/utils/richText/context";
import useRichText from "@dashboard/utils/richText/useRichText";
import { Trash2 } from "lucide-react";
import { type FormEventHandler, useCallback, useLayoutEffect, useMemo } from "react";
import { useIntl } from "react-intl";

import { ShippingMethodChannelAvailabilityCard } from "../ShippingMethodChannelAvailabilityCard/ShippingMethodChannelAvailabilityCard";
import { ShippingMethodTaxes } from "../ShippingMethodTaxes/ShippingMethodTaxes";
import ShippingZonePostalCodes from "../ShippingZonePostalCodes";
import { messages } from "./messages";
import { ShippingMethodDetailsTitle } from "./Title";
import { type ShippingZoneRateUpdateFormData } from "./types";

interface ShippingZoneRatesPageProps
  extends Pick<ListProps, Exclude<keyof ListProps, "getRowHref">>,
    ListActions,
    WithFormId {
  allChannelsCount?: number;
  shippingChannels: ChannelShippingData[];
  savedChannelIds?: string[];
  savedShippingChannels?: ChannelShippingData[];
  hasPostalCodeChanges?: boolean;
  loading?: boolean;
  disabled: boolean;
  rate: NonNullable<NonNullable<ShippingZoneQuery["shippingZone"]>["shippingMethods"]>[number];
  channelErrors: ShippingChannelsErrorFragment[];
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  postalCodeRules?: NonNullable<
    NonNullable<ShippingZoneQuery["shippingZone"]>["shippingMethods"]
  >[number]["postalCodeRules"];
  postalCodeInclusionType?: PostalCodeRuleInclusionTypeEnum;
  backHref: string;
  shippingZoneName?: string;
  onDelete?: () => void;
  onShowMetadata: () => void;
  onSubmit: (data: ShippingZoneRateUpdateFormData) => SubmitPromise;
  onPostalCodeInclusionChange: (inclusion: PostalCodeRuleInclusionTypeEnum) => void;
  onPostalCodeAssign: () => void;
  onPostalCodeUnassign: (
    code: NonNullable<ShippingMethodTypeFragment["postalCodeRules"]>[number],
  ) => void;
  onChannelsChange: (data: ChannelShippingData[]) => void;
  openChannelsModal: () => void;
  focusChannelId?: string;
  onFocusChannelComplete?: () => void;
  onProductAssign: () => void;
  onProductUnassign: (ids: string[]) => void;
  variant: ShippingMethodTypeEnum;
  taxClasses: TaxClassBaseFragment[];
  fetchMoreTaxClasses: FetchMoreProps;
}

const ShippingZoneRatesPage = ({
  allChannelsCount,
  shippingChannels,
  savedChannelIds,
  savedShippingChannels = [],
  hasPostalCodeChanges = false,
  loading = false,
  channelErrors,
  disabled,
  errors,
  backHref,
  shippingZoneName,
  onDelete,
  onShowMetadata,
  onSubmit,
  onPostalCodeInclusionChange,
  onChannelsChange,
  onPostalCodeAssign,
  onPostalCodeUnassign,
  onProductAssign,
  onProductUnassign,
  openChannelsModal,
  focusChannelId,
  onFocusChannelComplete,
  rate,
  saveButtonBarState,
  postalCodeRules,
  postalCodeInclusionType,
  variant,
  formId,
  taxClasses,
  fetchMoreTaxClasses,
  ...listProps
}: ShippingZoneRatesPageProps) => {
  const navigate = useNavigator();
  const intl = useIntl();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const isPriceVariant = variant === ShippingMethodTypeEnum.PRICE;
  const initialForm: Omit<ShippingZoneRateUpdateFormData, "description"> = useMemo(
    () => ({
      channelListings: [],
      maxDays: rate?.maximumDeliveryDays?.toString() || "",
      maxValue: rate?.maximumOrderWeight?.value.toString() || "",
      minDays: rate?.minimumDeliveryDays?.toString() || "",
      minValue: rate?.minimumOrderWeight?.value.toString() || "",
      name: rate?.name || "",
      type: rate?.type || null,
      taxClassId: rate?.taxClass?.id || "",
    }),
    [rate],
  );
  const {
    change,
    data: formData,
    setIsSubmitDisabled,
    triggerChange,
  } = useForm(initialForm, undefined, { confirmLeave: true, formId });
  const { setExitDialogSubmitRef, setIsDirty } = useExitFormDialog({ formId });
  const [taxClassDisplayName, setTaxClassDisplayName] = useStateUpdate(rate?.taxClass?.name ?? "");
  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit,
  });
  const richText = useRichText({
    initial: rate?.description,
    loading,
    triggerChange,
  });
  const data: ShippingZoneRateUpdateFormData = {
    ...formData,
    description: null,
  };
  const { handleChannelsChange, replaceChannels, hasValidChannelPrices, pricedChannelIdsList } =
    useShippingRateChannels({
      shippingChannels,
      onChannelsChange,
      triggerChange,
    });
  const hasChanges = useShippingRateEditChanges({
    formData,
    initialFormData: initialForm,
    shippingChannels,
    savedShippingChannels,
    savedChannelIds,
    pricedChannelIds: pricedChannelIdsList,
    hasPostalCodeChanges,
    isDescriptionDirty: richText.isDirty,
  });
  // Prevents closing ref in submit functions
  const getData = async (): Promise<ShippingZoneRateUpdateFormData> => ({
    ...data,
    channelListings: shippingChannels,
    description: await richText.getValue(),
  });
  const handleFormElementSubmit: FormEventHandler = async event => {
    event.preventDefault();
    handleFormSubmit(await getData());
  };
  const handleSubmit = async () => handleFormSubmit(await getData());

  useLayoutEffect(
    function registerExitDialogSubmit() {
      setExitDialogSubmitRef(handleSubmit);
    },
    [handleSubmit, setExitDialogSubmitRef],
  );

  // Keep exit-dialog dirty state aligned with hasChanges. useForm.triggerChange and
  // useChannels can set isDirty independently; re-sync every render so a stale true
  // (e.g. confirming the channel picker without edits) does not block navigation.
  useLayoutEffect(() => {
    setIsDirty(hasChanges);
  });

  const isSaveDisabled = disabled || !hasValidChannelPrices || !hasChanges;

  setIsSubmitDisabled(isSaveDisabled);

  const devMode = useDevModeContext();
  const openPlaygroundURL = useCallback(() => {
    if (!rate?.id) {
      return;
    }

    devMode.setDevModeContent(shippingMethodGraphiQLQuery);
    devMode.setVariables(`{ "id": "${rate.id}" }`);
    devMode.setDevModeVisibility(true);
  }, [devMode, rate]);

  const menuItems = useMemo((): TopNavMenuItem[] => {
    const items: TopNavMenuItem[] = [];

    if (rate?.id) {
      items.push({
        label: intl.formatMessage(messages.openGraphiQL),
        onSelect: openPlaygroundURL,
        testId: "graphiql-redirect",
        icon: <GraphqlIcon />,
      });
    }

    if (onDelete) {
      items.push({
        label: intl.formatMessage(messages.deleteShippingMethod),
        onSelect: onDelete,
        testId: "delete-shipping-method",
        color: "critical1",
        icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
    }

    return items;
  }, [intl, onDelete, openPlaygroundURL, rate]);

  return (
    <RichTextContext.Provider value={richText}>
      <form onSubmit={handleFormElementSubmit}>
        <DetailPageLayout>
          <TopNav
            href={backHref}
            hrefIcon={<TopNavDestinationIcon.shipping />}
            hrefTitle={intl.formatMessage(topNavDestinationMessages.shippingZone)}
            title={
              <ShippingMethodDetailsTitle
                shippingZoneName={shippingZoneName}
                rateName={rate?.name}
                loading={loading}
              />
            }
            actionsGap={3}
          >
            <TopNav.MetadataButton
              onClick={onShowMetadata}
              disabled={!rate}
              data-test-id="show-shipping-method-metadata"
              title={intl.formatMessage(messages.editShippingMethodMetadata)}
            />
            {canTranslate && rate?.id && (
              <TranslationsButton
                onClick={() =>
                  navigate(
                    languageEntityUrl(
                      lastUsedLocaleOrFallback,
                      TranslatableEntities.shippingMethods,
                      rate.id,
                    ),
                  )
                }
              />
            )}
            {menuItems.length > 0 && (
              <TopNav.Menu
                items={
                  disabled || !rate
                    ? menuItems.map(item => ({ ...item, disabled: true }))
                    : menuItems
                }
                dataTestId="menu"
              />
            )}
          </TopNav>
          <DetailPageLayout.Content paddingBottom={10}>
            <ShippingRateInfo data={data} disabled={disabled} errors={errors} onChange={change} />
            <CardSpacer />
            <PricingCard
              channels={shippingChannels}
              onChange={handleChannelsChange}
              onChannelsReplace={replaceChannels}
              disabled={disabled}
              errors={channelErrors}
              focusChannelId={focusChannelId}
              isFocusReady={!loading && richText.isReadyForMount}
              onFocusChannelComplete={onFocusChannelComplete}
            />
            <CardSpacer />
            {isPriceVariant ? (
              <OrderValue
                channels={shippingChannels}
                errors={channelErrors}
                disabled={disabled}
                onChannelChange={handleChannelsChange}
                onChannelsReplace={replaceChannels}
              />
            ) : (
              <OrderWeight
                disabled={disabled}
                minValue={data.minValue}
                maxValue={data.maxValue}
                onChange={change}
                errors={errors}
              />
            )}
            <CardSpacer />
            <ShippingZonePostalCodes
              disabled={disabled}
              inclusionType={postalCodeInclusionType}
              onPostalCodeDelete={onPostalCodeUnassign}
              onPostalCodeInclusionChange={onPostalCodeInclusionChange}
              onPostalCodeRangeAdd={onPostalCodeAssign}
              postalCodes={postalCodeRules}
            />
            <CardSpacer />
            <ShippingMethodProducts
              products={loading ? undefined : mapEdgesToItems(rate?.excludedProducts)}
              onProductAssign={onProductAssign}
              onProductUnassign={onProductUnassign}
              disabled={disabled}
              {...listProps}
            />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar paddingTop={6}>
            <ShippingMethodChannelAvailabilityCard
              channels={shippingChannels}
              savedChannelIds={savedChannelIds}
              pricedChannelIds={pricedChannelIdsList}
              totalChannelsCount={allChannelsCount ?? 0}
              errors={channelErrors}
              isLoading={loading}
              managePermissions={[PermissionEnum.MANAGE_SHIPPING]}
              onManageClick={openChannelsModal}
            />
            <CardSpacer />
            <ShippingMethodTaxes
              value={formData.taxClassId}
              taxClassDisplayName={taxClassDisplayName}
              taxClasses={taxClasses}
              disabled={false}
              onChange={event =>
                handleTaxClassChange(event, taxClasses, change, setTaxClassDisplayName)
              }
              onFetchMore={fetchMoreTaxClasses}
            />
          </DetailPageLayout.RightSidebar>
          <Savebar>
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(backHref)} />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={handleSubmit}
              disabled={isSaveDisabled}
              tooltip={
                !hasValidChannelPrices &&
                intl.formatMessage({
                  id: "38mk3k",
                  defaultMessage: "Set prices for assigned channels to save",
                  description: "save button disabled tooltip on shipping rate edit",
                })
              }
            />
          </Savebar>
        </DetailPageLayout>
      </form>
    </RichTextContext.Provider>
  );
};

export default ShippingZoneRatesPage;
