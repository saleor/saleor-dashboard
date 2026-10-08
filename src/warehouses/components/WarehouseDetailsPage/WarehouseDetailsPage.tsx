import { createCountryHandler } from "@dashboard/components/AddressEdit/createCountryHandler";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton/ConfirmButton";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form from "@dashboard/components/Form/Form";
import { FormDirtyStateSync } from "@dashboard/components/Form/FormDirtyStateSync";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts/Detail";
import { Savebar } from "@dashboard/components/Savebar";
import {
  type AccountErrorFragment,
  type CountryWithCodeFragment,
  WarehouseClickAndCollectOptionEnum,
  type WarehouseDetailsFragment,
  type WarehouseErrorFragment,
} from "@dashboard/graphql";
import useAddressValidation from "@dashboard/hooks/useAddressValidation";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { type FormChange, type SubmitPromise, type UseFormResult } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices, mapEdgesToItems } from "@dashboard/utils/maps";
import { messages } from "@dashboard/warehouses/messages";
import { pickupFormChange } from "@dashboard/warehouses/pickupOptionAfterPrivateChange";
import { defaultGraphiQLQuery } from "@dashboard/warehouses/queries";
import { warehouseListPath } from "@dashboard/warehouses/urls";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { ListChecks, Trash2 } from "lucide-react";
import { type ReactNode, useCallback, useMemo } from "react";
import { FormattedMessage, type IntlShape, useIntl } from "react-intl";

import { WarehouseAddressCard } from "../WarehouseAddressCard/WarehouseAddressCard";
import { WarehouseInfo } from "../WarehouseInfo/WarehouseInfo";
import { WarehousePickupCard } from "../WarehousePickupCard/WarehousePickupCard";
import { WarehouseShippingZonesCard } from "../WarehouseShippingZonesCard/WarehouseShippingZonesCard";
import { buildWarehouseSaveComposition, hasWarehouseSaveComposition } from "./saveComposition";
import { type WarehouseDetailsPageFormData } from "./types";
import { WarehouseDetailsPageLoading } from "./WarehouseDetailsPageLoading";
import { WarehouseSaveCompositionHint } from "./WarehouseSaveCompositionHint";

export type { WarehouseDetailsPageFormData } from "./types";

interface WarehouseDetailsPageProps {
  countries: CountryWithCodeFragment[];
  disabled: boolean;
  errors: WarehouseErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  warehouse: WarehouseDetailsFragment | undefined;
  /** Undefined while the shop stock mode is still loading. */
  legacyStockAvailability: boolean | undefined;
  /** Null when the count could not be loaded. */
  stockCount: number | null;
  stockCountLoading: boolean;
  channelsCard: ReactNode;
  channelBanner: ReactNode | null;
  /** Shown under the title once membership is known. */
  channelSubtitle: ReactNode | null;
  membershipStatus: "loading" | "error" | "ready";
  warehouseChannelIds: string[];
  channelNames: string[];
  canManageShippingZones: boolean;
  shippingZonesDisabled?: boolean;
  onRequestAssignZones: () => void;
  onRemoveShippingZone: (zoneId: string) => void;
  onDelete: () => void;
  onShowMetadata: () => void;
  onShowSetupChecklist?: () => void;
  onSubmit: (data: WarehouseDetailsPageFormData) => SubmitPromise;
}

const orEmpty = (value: string | null | undefined): string => value ?? "";

const warehouseToFormData = (
  warehouse: WarehouseDetailsFragment | undefined,
): WarehouseDetailsPageFormData => ({
  city: orEmpty(warehouse?.address.city),
  companyName: orEmpty(warehouse?.address.companyName),
  country: orEmpty(warehouse?.address.country.code),
  isPrivate: !!warehouse?.isPrivate,
  clickAndCollectOption:
    warehouse?.clickAndCollectOption || WarehouseClickAndCollectOptionEnum.DISABLED,
  countryArea: orEmpty(warehouse?.address.countryArea),
  name: orEmpty(warehouse?.name),
  email: orEmpty(warehouse?.email),
  phone: orEmpty(warehouse?.address.phone),
  postalCode: orEmpty(warehouse?.address.postalCode),
  streetAddress1: orEmpty(warehouse?.address.streetAddress1),
  streetAddress2: orEmpty(warehouse?.address.streetAddress2),
});

const warehouseMenuItems = ({
  intl,
  warehouseId,
  onDelete,
  onOpenPlayground,
  onShowSetupChecklist,
}: {
  intl: IntlShape;
  warehouseId: string | undefined;
  onDelete: () => void;
  onOpenPlayground: () => void;
  onShowSetupChecklist?: () => void;
}): TopNavMenuItem[] => {
  if (!warehouseId) {
    return [];
  }

  return [
    {
      label: intl.formatMessage(messages.openGraphiQL),
      onSelect: onOpenPlayground,
      testId: "graphiql-redirect",
      icon: <GraphqlIcon />,
    },
    ...(onShowSetupChecklist
      ? [
          {
            label: intl.formatMessage(messages.showSetupChecklist),
            onSelect: onShowSetupChecklist,
            testId: "show-setup-checklist",
            icon: <ListChecks size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
          },
        ]
      : []),
    {
      label: intl.formatMessage(messages.deleteWarehouse),
      onSelect: onDelete,
      testId: "delete-warehouse",
      color: "critical1" as const,
      icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
    },
  ];
};

export const WarehouseDetailsPage = ({
  countries,
  disabled,
  errors,
  saveButtonBarState,
  warehouse,
  legacyStockAvailability,
  stockCount,
  stockCountLoading,
  channelsCard,
  channelBanner,
  channelSubtitle,
  membershipStatus,
  warehouseChannelIds,
  channelNames,
  canManageShippingZones,
  shippingZonesDisabled,
  onRequestAssignZones,
  onRemoveShippingZone,
  onDelete,
  onShowMetadata,
  onShowSetupChecklist,
  onSubmit,
}: WarehouseDetailsPageProps): ReactNode => {
  const intl = useIntl();
  const navigate = useNavigator();
  const devMode = useDevModeContext();
  const [displayCountry, setDisplayCountry] = useStateFromProps(
    warehouse?.address?.country.country || "",
  );
  const { errors: validationErrors, submit: handleSubmit } = useAddressValidation(onSubmit);
  // Warehouse fragment is the saved baseline for pristine checks and the save hint.
  const initialForm = useMemo(() => warehouseToFormData(warehouse), [warehouse]);
  const checkIfSaveIsDisabled = useCallback(
    (formValues: WarehouseDetailsPageFormData) =>
      disabled ||
      !warehouse ||
      !hasWarehouseSaveComposition(buildWarehouseSaveComposition(formValues, initialForm)),
    [disabled, initialForm, warehouse],
  );
  const warehouseListBackLink = useBackLinkWithState({
    path: warehouseListPath,
  });
  const openPlaygroundURL = useCallback(() => {
    devMode.setDevModeContent(defaultGraphiQLQuery);
    devMode.setVariables(`{ "id": "${warehouse?.id}" }`);
    devMode.setDevModeVisibility(true);
  }, [devMode, warehouse?.id]);
  const menuItems = useMemo(
    () =>
      warehouseMenuItems({
        intl,
        warehouseId: warehouse?.id,
        onDelete,
        onOpenPlayground: openPlaygroundURL,
        onShowSetupChecklist,
      }),
    [intl, onDelete, onShowSetupChecklist, openPlaygroundURL, warehouse?.id],
  );
  const zones = (mapEdgesToItems(warehouse?.shippingZones) ?? []).map(zone => ({
    id: zone.id,
    name: zone.name,
    channelIds: zone.channels.map(channel => channel.id),
  }));

  if (!warehouse) {
    return <WarehouseDetailsPageLoading channelsCard={channelsCard} />;
  }

  return (
    <Form
      key={warehouse.id}
      confirmLeave
      initial={initialForm}
      onSubmit={handleSubmit}
      disabled={disabled}
      checkIfSaveIsDisabled={checkIfSaveIsDisabled}
    >
      {formData => (
        <WarehouseDetailsForm
          change={formData.change}
          countries={countries}
          data={formData.data}
          disabled={disabled}
          displayCountry={displayCountry}
          errors={errors}
          initialForm={initialForm}
          isSaveDisabled={!!formData.isSaveDisabled}
          legacyStockAvailability={legacyStockAvailability}
          menuItems={menuItems}
          saveButtonBarState={saveButtonBarState}
          set={formData.set}
          triggerChange={formData.triggerChange}
          setDisplayCountry={setDisplayCountry}
          stockCount={stockCount}
          stockCountLoading={stockCountLoading}
          channelsCard={channelsCard}
          channelBanner={channelBanner}
          channelSubtitle={channelSubtitle}
          membershipStatus={membershipStatus}
          warehouseChannelIds={warehouseChannelIds}
          channelNames={channelNames}
          canManageShippingZones={canManageShippingZones}
          shippingZonesDisabled={shippingZonesDisabled}
          onRequestAssignZones={onRequestAssignZones}
          onRemoveShippingZone={onRemoveShippingZone}
          submit={formData.submit}
          validationErrors={validationErrors}
          warehouse={warehouse}
          warehouseListBackLink={warehouseListBackLink}
          zones={zones}
          onNavigateBack={() => navigate(warehouseListBackLink)}
          onShowMetadata={onShowMetadata}
        />
      )}
    </Form>
  );
};

interface WarehouseDetailsFormProps {
  change: FormChange;
  countries: CountryWithCodeFragment[];
  data: WarehouseDetailsPageFormData;
  disabled: boolean;
  displayCountry: string;
  errors: WarehouseErrorFragment[];
  initialForm: WarehouseDetailsPageFormData;
  isSaveDisabled: boolean;
  legacyStockAvailability: boolean | undefined;
  menuItems: TopNavMenuItem[];
  saveButtonBarState: ConfirmButtonTransitionState;
  set: UseFormResult<WarehouseDetailsPageFormData>["set"];
  triggerChange: UseFormResult<WarehouseDetailsPageFormData>["triggerChange"];
  setDisplayCountry: (country: string) => void;
  stockCount: number | null;
  stockCountLoading: boolean;
  channelsCard: ReactNode;
  channelBanner: ReactNode | null;
  channelSubtitle: ReactNode | null;
  membershipStatus: "loading" | "error" | "ready";
  warehouseChannelIds: string[];
  channelNames: string[];
  canManageShippingZones: boolean;
  shippingZonesDisabled?: boolean;
  onRequestAssignZones: () => void;
  onRemoveShippingZone: (zoneId: string) => void;
  submit: UseFormResult<WarehouseDetailsPageFormData>["submit"];
  validationErrors: AccountErrorFragment[];
  warehouse: WarehouseDetailsFragment;
  warehouseListBackLink: string;
  zones: Array<{ id: string; name: string; channelIds: string[] }>;
  onNavigateBack: () => void;
  onShowMetadata: () => void;
}

const WarehouseDetailsForm = ({
  change,
  countries,
  data,
  disabled,
  displayCountry,
  errors,
  initialForm,
  isSaveDisabled,
  legacyStockAvailability,
  menuItems,
  saveButtonBarState,
  set,
  triggerChange,
  setDisplayCountry,
  stockCount,
  stockCountLoading,
  channelsCard,
  channelBanner,
  channelSubtitle,
  membershipStatus,
  warehouseChannelIds,
  channelNames,
  canManageShippingZones,
  shippingZonesDisabled,
  onRequestAssignZones,
  onRemoveShippingZone,
  submit,
  validationErrors,
  warehouse,
  warehouseListBackLink,
  zones,
  onNavigateBack,
  onShowMetadata,
}: WarehouseDetailsFormProps): ReactNode => {
  const intl = useIntl();
  const saveComposition = buildWarehouseSaveComposition(data, initialForm);
  const countryChoices = mapCountriesToChoices(countries);
  const countrySelect = createSingleAutocompleteSelectHandler(
    change,
    setDisplayCountry,
    countryChoices,
  );
  const handleCountrySelect = createCountryHandler(countrySelect, set);
  const stockMeta = stockCountLoading ? (
    <Skeleton __width="6rem" __height="1rem" />
  ) : stockCount !== null ? (
    <Text
      color="default2"
      fontSize={2}
      __whiteSpace="nowrap"
      data-test-id="warehouse-stock-count"
      display={{ mobile: "none", tablet: "block", desktop: "block" }}
    >
      <FormattedMessage {...messages.stockCount} values={{ count: stockCount }} />
    </Text>
  ) : null;

  return (
    <DetailPageLayout>
      <FormDirtyStateSync enabled isSaveDisabled={isSaveDisabled} triggerChange={triggerChange} />
      <TopNav
        href={warehouseListBackLink}
        hrefIcon={<TopNavDestinationIcon.warehouses />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.allWarehouses)}
        title={
          warehouse.name ? (
            <Box display="flex" alignItems="center" gap={2} flexWrap="nowrap" __minWidth="0">
              <Box
                title={warehouse.name}
                __maxWidth="320px"
                __overflow="hidden"
                __textOverflow="ellipsis"
                __whiteSpace="nowrap"
                __minWidth="0"
              >
                {warehouse.name}
              </Box>
              {channelSubtitle}
              {stockMeta}
            </Box>
          ) : null
        }
        actionsGap={3}
      >
        <TopNav.MetadataButton
          onClick={onShowMetadata}
          disabled={disabled}
          data-test-id="show-warehouse-metadata"
          title={intl.formatMessage(messages.editMetadata)}
        />
        {menuItems.length > 0 && (
          <TopNav.Menu
            items={disabled ? menuItems.map(item => ({ ...item, disabled: true })) : menuItems}
            dataTestId="warehouse-menu"
          />
        )}
      </TopNav>
      <DetailPageLayout.Content>
        <DetailPageContent>
          {channelBanner}
          <WarehouseInfo data={data} disabled={disabled} errors={errors} onChange={change} />
          <WarehouseAddressCard
            countries={countryChoices}
            data={data}
            disabled={disabled}
            displayCountry={displayCountry}
            errors={[...errors, ...validationErrors]}
            showPickupNotice={
              data.clickAndCollectOption !== WarehouseClickAndCollectOptionEnum.DISABLED
            }
            onChange={change}
            onCountryChange={handleCountrySelect}
          />
          <WarehousePickupCard
            clickAndCollectOption={data.clickAndCollectOption}
            savedClickAndCollectOption={initialForm.clickAndCollectOption}
            disabled={disabled}
            onOptionChange={option => {
              set(pickupFormChange({ option, saved: initialForm }));
              triggerChange();
            }}
          />
        </DetailPageContent>
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar paddingTop={6}>
        <Box display="flex" flexDirection="column" gap={4}>
          {channelsCard}
          <WarehouseShippingZonesCard
            legacyStockAvailability={legacyStockAvailability}
            zones={zones}
            totalCount={warehouse.shippingZones?.totalCount ?? null}
            membershipStatus={membershipStatus}
            warehouseChannelIds={warehouseChannelIds}
            channelNames={channelNames}
            pickupEnabled={
              data.clickAndCollectOption !== WarehouseClickAndCollectOptionEnum.DISABLED
            }
            canManage={canManageShippingZones}
            disabled={shippingZonesDisabled}
            onRequestAssign={onRequestAssignZones}
            onRemove={onRemoveShippingZone}
          />
        </Box>
      </DetailPageLayout.RightSidebar>
      <Savebar>
        <Savebar.Spacer />
        <WarehouseSaveCompositionHint composition={saveComposition} />
        <Savebar.CancelButton onClick={onNavigateBack} />
        <Savebar.ConfirmButton
          transitionState={saveButtonBarState}
          onClick={submit}
          disabled={isSaveDisabled}
        />
      </Savebar>
    </DetailPageLayout>
  );
};

WarehouseDetailsPage.displayName = "WarehouseDetailsPage";
