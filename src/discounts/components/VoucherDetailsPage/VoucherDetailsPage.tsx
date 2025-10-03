// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import { hasPermission } from "@dashboard/auth/misc";
import { ChannelVoucherData } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import CountryList from "@dashboard/components/CountryList";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata, MetadataFormData } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { Tab, TabContainer } from "@dashboard/components/Tab";
import {
  createChannelsChangeHandler,
  createDiscountTypeChangeHandler,
  createVoucherUpdateHandler,
} from "@dashboard/discounts/handlers";
import { itemsQuantityMessages } from "@dashboard/discounts/translations";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import { voucherListPath } from "@dashboard/discounts/urls";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForVoucherDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  DiscountErrorFragment,
  DiscountValueTypeEnum,
  PermissionEnum,
  SearchProductFragment,
  VoucherDetailsFragment,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { UseListSettings } from "@dashboard/hooks/useListSettings";
import { LocalPagination } from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { mapEdgesToItems, mapMetadataItemToInput } from "@dashboard/utils/maps";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { Box, Divider, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { splitDateTime } from "../../../misc";
import { ChannelProps, ListProps, TabListActions } from "../../../types";
import DiscountCategories from "../DiscountCategories";
import DiscountCollections from "../DiscountCollections";
import DiscountDates from "../DiscountDates";
import DiscountProducts from "../DiscountProducts";
import DiscountVariants from "../DiscountVariants";
import { VoucherCodes } from "../VoucherCodes";
import { VoucherCode } from "../VoucherCodesDatagrid/types";
import { GenerateMultipleVoucherCodeFormData } from "../VoucherCodesGenerateDialog";
import VoucherInfo from "../VoucherInfo";
import VoucherLimits from "../VoucherLimits";
import VoucherRequirements from "../VoucherRequirements";
import VoucherSummary from "../VoucherSummary";
import VoucherTypes from "../VoucherTypes";
import VoucherValue from "../VoucherValue";

export enum VoucherDetailsPageTab {
  categories = "categories",
  collections = "collections",
  products = "products",
  variants = "variants",
}

export type VoucherTabItemsCount = Partial<Record<VoucherDetailsPageTab, number>>;

export interface VoucherDetailsPageFormData extends MetadataFormData {
  applyOncePerCustomer: boolean;
  applyOncePerOrder: boolean;
  onlyForStaff: boolean;
  channelListings: ChannelVoucherData[];
  name: string;
  discountType: DiscountTypeEnum;
  endDate: string;
  endTime: string;
  hasEndDate: boolean;
  hasUsageLimit: boolean;
  minCheckoutItemsQuantity: string;
  requirementsPicker: RequirementsPicker;
  startDate: string;
  startTime: string;
  type: VoucherTypeEnum;
  codes: VoucherCode[];
  usageLimit: number;
  used: number;
  singleUse: boolean;
}

interface VoucherDetailsPageProps
  extends Pick<ListProps, Exclude<keyof ListProps, "getRowHref">>,
    TabListActions<
      "categoryListToolbar" | "collectionListToolbar" | "productListToolbar" | "variantListToolbar"
    >,
    ChannelProps {
  activeTab: VoucherDetailsPageTab;
  tabItemsCount: VoucherTabItemsCount;
  errors: DiscountErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  voucher: VoucherDetailsFragment;
  allChannelsCount: number;
  channelListings: ChannelVoucherData[];
  selectedVoucherCodesIds: string[];
  voucherCodes: VoucherCode[];
  addedVoucherCodes: VoucherCode[];
  voucherCodesLoading: boolean;
  onSelectVoucherCodesIds: (rows: number[], clearSelection: () => void) => void;
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
  onRemove: () => void;
  onSubmit: (data: VoucherDetailsPageFormData) => void;
  onTabClick: (index: VoucherDetailsPageTab) => void;
  onChannelsChange: (data: ChannelVoucherData[]) => void;
  openChannelsModal: () => void;
  onMultipleVoucherCodesGenerate: (data: GenerateMultipleVoucherCodeFormData) => void;
  onCustomVoucherCodeGenerate: (code: string) => void;
  onDeleteVoucherCodes: () => void;
  onVoucherCodesSettingsChange: UseListSettings["updateListSettings"];
  voucherCodesPagination: LocalPagination;
  voucherCodesSettings: UseListSettings["settings"];
}

const CategoriesTab = Tab(VoucherDetailsPageTab.categories);
const CollectionsTab = Tab(VoucherDetailsPageTab.collections);
const ProductsTab = Tab(VoucherDetailsPageTab.products);
const VariantsTab = Tab(VoucherDetailsPageTab.variants);

const VoucherDetailsPage: React.FC<VoucherDetailsPageProps> = ({
  activeTab,
  tabItemsCount = {},
  allChannelsCount,
  channelListings = [],
  disabled,
  errors,
  saveButtonBarState,
  voucher,
  onCategoryAssign,
  onCategoryUnassign,
  onChannelsChange,
  onCountryAssign,
  onCountryUnassign,
  onCollectionAssign,
  onCollectionUnassign,
  onProductAssign,
  onProductUnassign,
  onVariantAssign,
  onVariantUnassign,
  onTabClick,
  openChannelsModal,
  onRemove,
  onMultipleVoucherCodesGenerate,
  onCustomVoucherCodeGenerate,
  onDeleteVoucherCodes,
  onSubmit,
  toggle,
  toggleAll,
  selected,
  selectedChannelId,
  isChecked,
  categoryListToolbar,
  collectionListToolbar,
  productListToolbar,
  variantListToolbar,
  selectedVoucherCodesIds,
  onSelectVoucherCodesIds,
  voucherCodes,
  addedVoucherCodes,
  voucherCodesLoading,
  voucherCodesPagination,
  onVoucherCodesSettingsChange,
  voucherCodesSettings,
}: VoucherDetailsPageProps) => {
  const intl = useIntl();
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const navigate = useNavigator();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);
  const [localErrors, setLocalErrors] = React.useState<DiscountErrorFragment[]>([]);
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();
  const hasMinimalOrderValueRequirement = voucher?.channelListings?.some(
    listing => listing.minSpent?.amount > 0,
  );

  let requirementsPickerInitValue;

  if (voucher?.minCheckoutItemsQuantity > 0) {
    requirementsPickerInitValue = RequirementsPicker.ITEM;
  } else if (hasMinimalOrderValueRequirement) {
    requirementsPickerInitValue = RequirementsPicker.ORDER;
  } else {
    requirementsPickerInitValue = RequirementsPicker.NONE;
  }

  const discountType =
    voucher?.type === VoucherTypeEnum.SHIPPING
      ? DiscountTypeEnum.SHIPPING
      : voucher?.discountValueType === DiscountValueTypeEnum.PERCENTAGE
        ? DiscountTypeEnum.VALUE_PERCENTAGE
        : DiscountTypeEnum.VALUE_FIXED;
  const initialForm: VoucherDetailsPageFormData = {
    applyOncePerCustomer: voucher?.applyOncePerCustomer || false,
    applyOncePerOrder: voucher?.applyOncePerOrder || false,
    onlyForStaff: voucher?.onlyForStaff || false,
    channelListings,
    name: voucher?.name || "",
    discountType,
    codes: addedVoucherCodes,
    endDate: splitDateTime(voucher?.endDate ?? "").date,
    endTime: splitDateTime(voucher?.endDate ?? "").time,
    hasEndDate: !!voucher?.endDate,
    hasUsageLimit: !!voucher?.usageLimit,
    minCheckoutItemsQuantity: voucher?.minCheckoutItemsQuantity?.toString() ?? "0",
    requirementsPicker: requirementsPickerInitValue,
    startDate: splitDateTime(voucher?.startDate ?? "").date,
    startTime: splitDateTime(voucher?.startDate ?? "").time,
    type: voucher?.type ?? VoucherTypeEnum.ENTIRE_ORDER,
    usageLimit: voucher?.usageLimit ?? 1,
    used: voucher?.used ?? 0,
    singleUse: voucher?.singleUse ?? false,
    metadata: voucher?.metadata.map(mapMetadataItemToInput),
    privateMetadata: voucher?.privateMetadata.map(mapMetadataItemToInput),
  };

  const voucherListBackLink = useBackLinkWithState({
    path: voucherListPath,
  });

  const { VOUCHER_DETAILS_MORE_ACTIONS, VOUCHER_DETAILS_WIDGETS } = useExtensions(
    extensionMountPoints.VOUCHER_DETAILS,
  );
  const extensionMenuItems = getExtensionsItemsForVoucherDetails(
    VOUCHER_DETAILS_MORE_ACTIONS,
    voucher?.id,
  );

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, submit, triggerChange, set }) => {
        const handleDiscountTypeChange = createDiscountTypeChangeHandler(change);
        const handleChannelChange = createChannelsChangeHandler(
          data.channelListings,
          onChannelsChange,
          triggerChange,
        );
        const changeMetadata = makeMetadataChangeHandler(change);
        const handleSubmit = createVoucherUpdateHandler(submit, setLocalErrors);
        const allErrors = [...localErrors, ...errors];

        return (
          <DetailPageLayout>
            <TopNav href={voucherListBackLink} title={voucher?.name}>
              {canTranslate && (
                <TranslationsButton
                  onClick={() =>
                    navigate(
                      languageEntityUrl(
                        lastUsedLocaleOrFallback,
                        TranslatableEntities.vouchers,
                        voucher?.id,
                      ),
                    )
                  }
                />
              )}
              {extensionMenuItems.length > 0 && (
                <Box marginLeft={3}>
                  <TopNav.Menu items={[...extensionMenuItems]} dataTestId="menu" />
                </Box>
              )}
            </TopNav>
            <DetailPageLayout.Content>
              <VoucherInfo data={data} disabled={disabled} errors={errors} onChange={change} />
              <VoucherCodes
                selectedCodesIds={selectedVoucherCodesIds}
                onSelectVoucherCodesIds={onSelectVoucherCodesIds}
                onDeleteCodes={onDeleteVoucherCodes}
                loading={voucherCodesLoading}
                onMultiCodesGenerate={codes => {
                  triggerChange();
                  onMultipleVoucherCodesGenerate(codes);
                }}
                onCustomCodeGenerate={code => {
                  triggerChange();
                  onCustomVoucherCodeGenerate(code);
                }}
                disabled={disabled}
                codes={voucherCodes}
                voucherCodesPagination={voucherCodesPagination}
                onSettingsChange={onVoucherCodesSettingsChange}
                settings={voucherCodesSettings}
              />
              <VoucherTypes
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={event => handleDiscountTypeChange(data, event)}
              />
              {data.discountType.toString() !== "SHIPPING" ? (
                <VoucherValue
                  data={data}
                  disabled={disabled}
                  errors={allErrors}
                  onChange={change}
                  onChannelChange={handleChannelChange}
                />
              ) : null}
              {data.type === VoucherTypeEnum.SPECIFIC_PRODUCT &&
              data.discountType.toString() !== "SHIPPING" ? (
                <>
                  <TabContainer>
                    <CategoriesTab
                      isActive={activeTab === VoucherDetailsPageTab.categories}
                      changeTab={onTabClick}
                      testId="categories-tab"
                    >
                      {intl.formatMessage(itemsQuantityMessages.categories, {
                        quantity: tabItemsCount.categories?.toString() || "…",
                      })}
                    </CategoriesTab>
                    <CollectionsTab
                      testId="collections-tab"
                      isActive={activeTab === VoucherDetailsPageTab.collections}
                      changeTab={onTabClick}
                    >
                      {intl.formatMessage(itemsQuantityMessages.collections, {
                        quantity: tabItemsCount.collections?.toString() || "…",
                      })}
                    </CollectionsTab>
                    <ProductsTab
                      testId="products-tab"
                      isActive={activeTab === VoucherDetailsPageTab.products}
                      changeTab={onTabClick}
                    >
                      {intl.formatMessage(itemsQuantityMessages.products, {
                        quantity: tabItemsCount.products?.toString() || "…",
                      })}
                    </ProductsTab>
                    <VariantsTab
                      testId="variants-tab"
                      isActive={activeTab === VoucherDetailsPageTab.variants}
                      changeTab={onTabClick}
                    >
                      {intl.formatMessage(itemsQuantityMessages.variants, {
                        quantity: tabItemsCount.variants?.toString() || "…",
                      })}
                    </VariantsTab>
                  </TabContainer>
                  <CardSpacer />
                  {activeTab === VoucherDetailsPageTab.categories ? (
                    <DiscountCategories
                      disabled={disabled}
                      onCategoryAssign={onCategoryAssign}
                      onCategoryUnassign={onCategoryUnassign}
                      categories={mapEdgesToItems(voucher?.categories)}
                      isChecked={isChecked}
                      selected={selected}
                      toggle={toggle}
                      toggleAll={toggleAll}
                      toolbar={categoryListToolbar}
                    />
                  ) : activeTab === VoucherDetailsPageTab.collections ? (
                    <DiscountCollections
                      disabled={disabled}
                      onCollectionAssign={onCollectionAssign}
                      onCollectionUnassign={onCollectionUnassign}
                      collections={mapEdgesToItems(voucher?.collections)}
                      isChecked={isChecked}
                      selected={selected}
                      toggle={toggle}
                      toggleAll={toggleAll}
                      toolbar={collectionListToolbar}
                    />
                  ) : activeTab === VoucherDetailsPageTab.products ? (
                    <DiscountProducts
                      disabled={disabled}
                      onProductAssign={onProductAssign}
                      onProductUnassign={onProductUnassign}
                      products={
                        mapEdgesToItems(voucher?.products) as unknown as SearchProductFragment[]
                      }
                      isChecked={isChecked}
                      selected={selected}
                      toggle={toggle}
                      toggleAll={toggleAll}
                      toolbar={productListToolbar}
                    />
                  ) : (
                    <DiscountVariants
                      disabled={disabled}
                      onVariantAssign={onVariantAssign}
                      onVariantUnassign={onVariantUnassign}
                      variants={voucher?.variants}
                      isChecked={isChecked}
                      selected={selected}
                      toggle={toggle}
                      toggleAll={toggleAll}
                      toolbar={variantListToolbar}
                    />
                  )}
                </>
              ) : null}
              {data.discountType.toString() === "SHIPPING" ? (
                <CountryList
                  countries={voucher?.countries}
                  disabled={disabled}
                  emptyText={intl.formatMessage({
                    id: "jd/LWa",
                    defaultMessage: "Voucher applies to all countries",
                  })}
                  title={
                    <>
                      {intl.formatMessage({
                        id: "ibnmEd",
                        defaultMessage: "Countries",
                        description: "voucher country range",
                      })}
                      <Text size={2} fontWeight="light" display="block">
                        <FormattedMessage
                          id="glT6fm"
                          defaultMessage="Voucher is limited to these countries"
                        />
                      </Text>
                    </>
                  }
                  onCountryAssign={onCountryAssign}
                  onCountryUnassign={onCountryUnassign}
                />
              ) : null}
              <VoucherRequirements
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
                onChannelChange={handleChannelChange}
              />
              <VoucherLimits
                data={data}
                initialUsageLimit={initialForm.usageLimit}
                disabled={disabled}
                errors={errors}
                onChange={change}
                setData={set}
                isNewVoucher={false}
              />
              <DiscountDates data={data} disabled={disabled} errors={errors} onChange={change} />
              <Metadata data={data} onChange={changeMetadata} />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <VoucherSummary voucher={voucher} selectedChannelId={selectedChannelId} />
              <ChannelsAvailabilityCard
                managePermissions={[PermissionEnum.MANAGE_DISCOUNTS]}
                allChannelsCount={allChannelsCount}
                channelsList={data.channelListings.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                }))}
                disabled={disabled}
                openModal={openChannelsModal}
              />
              {VOUCHER_DETAILS_WIDGETS.length > 0 && voucher?.id && (
                <>
                  <CardSpacer />
                  <Divider />
                  <AppWidgets
                    extensions={VOUCHER_DETAILS_WIDGETS}
                    params={{ voucherId: voucher?.id }}
                  />
                </>
              )}
            </DetailPageLayout.RightSidebar>
            <Savebar>
              <Savebar.DeleteButton onClick={onRemove} />
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(voucherListBackLink)} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={() => handleSubmit(data)}
                disabled={disabled}
              />
            </Savebar>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

VoucherDetailsPage.displayName = "VoucherDetailsPage";

export default VoucherDetailsPage;
