// @ts-strict-ignore
import { ChannelVoucherData } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import CountryList from "@dashboard/components/CountryList";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata, MetadataFormData } from "@dashboard/components/Metadata";
import Savebar from "@dashboard/components/Savebar";
import { Tab, TabContainer } from "@dashboard/components/Tab";
import {
  createChannelsChangeHandler,
  createDiscountTypeChangeHandler,
  createVoucherUpdateHandler,
} from "@dashboard/discounts/handlers";
import { itemsQuantityMessages } from "@dashboard/discounts/translations";
import {
  DiscountTypeEnum,
  RequirementsPicker,
} from "@dashboard/discounts/types";
import { voucherListUrl } from "@dashboard/discounts/urls";
import {
  DiscountErrorFragment,
  DiscountValueTypeEnum,
  PermissionEnum,
  VoucherDetailsFragment,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { mapEdgesToItems, mapMetadataItemToInput } from "@dashboard/utils/maps";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { splitDateTime } from "../../../misc";
import { ChannelProps, ListProps, TabListActions } from "../../../types";
import DiscountCategories from "../DiscountCategories";
import DiscountCollections from "../DiscountCollections";
import DiscountDates from "../DiscountDates";
import DiscountProducts from "../DiscountProducts";
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
}

export type VoucherTabItemsCount = Partial<
  Record<VoucherDetailsPageTab, number>
>;

export interface VoucherDetailsPageFormData extends MetadataFormData {
  applyOncePerCustomer: boolean;
  applyOncePerOrder: boolean;
  onlyForStaff: boolean;
  channelListings: ChannelVoucherData[];
  code: string;
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
  usageLimit: number;
  used: number;
}

export interface VoucherDetailsPageProps
  extends Pick<ListProps, Exclude<keyof ListProps, "getRowHref">>,
    TabListActions<
      "categoryListToolbar" | "collectionListToolbar" | "productListToolbar"
    >,
    ChannelProps {
  activeTab: VoucherDetailsPageTab;
  tabItemsCount: VoucherTabItemsCount;
  errors: DiscountErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  voucher: VoucherDetailsFragment;
  allChannelsCount: number;
  channelListings: ChannelVoucherData[];
  onCategoryAssign: () => void;
  onCategoryUnassign: (id: string) => void;
  onCollectionAssign: () => void;
  onCollectionUnassign: (id: string) => void;
  onCountryAssign: () => void;
  onCountryUnassign: (code: string) => void;
  onProductAssign: () => void;
  onProductUnassign: (id: string) => void;
  onRemove: () => void;
  onSubmit: (data: VoucherDetailsPageFormData) => void;
  onTabClick: (index: VoucherDetailsPageTab) => void;
  onChannelsChange: (data: ChannelVoucherData[]) => void;
  openChannelsModal: () => void;
}

const CategoriesTab = Tab(VoucherDetailsPageTab.categories);
const CollectionsTab = Tab(VoucherDetailsPageTab.collections);
const ProductsTab = Tab(VoucherDetailsPageTab.products);

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
  onTabClick,
  openChannelsModal,
  onRemove,
  onSubmit,
  toggle,
  toggleAll,
  selected,
  selectedChannelId,
  isChecked,
  categoryListToolbar,
  collectionListToolbar,
  productListToolbar,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const [localErrors, setLocalErrors] = React.useState<DiscountErrorFragment[]>(
    [],
  );

  const { makeChangeHandler: makeMetadataChangeHandler } =
    useMetadataChangeTrigger();
  const channel = voucher?.channelListings?.find(
    listing => listing.channel.id === selectedChannelId,
  );
  let requirementsPickerInitValue;
  if (voucher?.minCheckoutItemsQuantity > 0) {
    requirementsPickerInitValue = RequirementsPicker.ITEM;
  } else if (channel?.minSpent?.amount > 0) {
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
    code: voucher?.code || "",
    discountType,
    endDate: splitDateTime(voucher?.endDate ?? "").date,
    endTime: splitDateTime(voucher?.endDate ?? "").time,
    hasEndDate: !!voucher?.endDate,
    hasUsageLimit: !!voucher?.usageLimit,
    minCheckoutItemsQuantity:
      voucher?.minCheckoutItemsQuantity?.toString() ?? "0",
    requirementsPicker: requirementsPickerInitValue,
    startDate: splitDateTime(voucher?.startDate ?? "").date,
    startTime: splitDateTime(voucher?.startDate ?? "").time,
    type: voucher?.type ?? VoucherTypeEnum.ENTIRE_ORDER,
    usageLimit: voucher?.usageLimit ?? 1,
    used: voucher?.used ?? 0,
    metadata: voucher?.metadata.map(mapMetadataItemToInput),
    privateMetadata: voucher?.privateMetadata.map(mapMetadataItemToInput),
  };

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, submit, triggerChange, set }) => {
        const handleDiscountTypeChange =
          createDiscountTypeChangeHandler(change);
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
            <TopNav href={voucherListUrl()} title={voucher?.code} />
            <DetailPageLayout.Content>
              <VoucherInfo
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
                variant="update"
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
                  variant="update"
                />
              ) : null}
              {data.type === VoucherTypeEnum.SPECIFIC_PRODUCT &&
              data.discountType.toString() !== "SHIPPING" ? (
                <>
                  <TabContainer>
                    <CategoriesTab
                      isActive={activeTab === VoucherDetailsPageTab.categories}
                      changeTab={onTabClick}
                    >
                      {intl.formatMessage(itemsQuantityMessages.categories, {
                        quantity: tabItemsCount.categories?.toString() || "…",
                      })}
                    </CategoriesTab>
                    <CollectionsTab
                      isActive={activeTab === VoucherDetailsPageTab.collections}
                      changeTab={onTabClick}
                    >
                      {intl.formatMessage(itemsQuantityMessages.collections, {
                        quantity: tabItemsCount.collections?.toString() || "…",
                      })}
                    </CollectionsTab>
                    <ProductsTab
                      isActive={activeTab === VoucherDetailsPageTab.products}
                      changeTab={onTabClick}
                    >
                      {intl.formatMessage(itemsQuantityMessages.products, {
                        quantity: tabItemsCount.products?.toString() || "…",
                      })}
                    </ProductsTab>
                  </TabContainer>
                  <CardSpacer />
                  {activeTab === VoucherDetailsPageTab.categories ? (
                    <DiscountCategories
                      disabled={disabled}
                      onCategoryAssign={onCategoryAssign}
                      onCategoryUnassign={onCategoryUnassign}
                      discount={voucher}
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
                      discount={voucher}
                      isChecked={isChecked}
                      selected={selected}
                      toggle={toggle}
                      toggleAll={toggleAll}
                      toolbar={collectionListToolbar}
                    />
                  ) : (
                    <DiscountProducts
                      disabled={disabled}
                      onProductAssign={onProductAssign}
                      onProductUnassign={onProductUnassign}
                      products={mapEdgesToItems(voucher?.products)}
                      isChecked={isChecked}
                      selected={selected}
                      toggle={toggle}
                      toggleAll={toggleAll}
                      toolbar={productListToolbar}
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
                      <Typography variant="caption">
                        <FormattedMessage
                          id="glT6fm"
                          defaultMessage="Voucher is limited to these countries"
                        />
                      </Typography>
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
              <DiscountDates
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <Metadata data={data} onChange={changeMetadata} />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <VoucherSummary
                voucher={voucher}
                selectedChannelId={selectedChannelId}
              />
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
            </DetailPageLayout.RightSidebar>
            <Savebar
              onCancel={() => navigate(voucherListUrl())}
              disabled={disabled}
              onDelete={onRemove}
              onSubmit={() => handleSubmit(data)}
              state={saveButtonBarState}
            />
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};
VoucherDetailsPage.displayName = "VoucherDetailsPage";

export default VoucherDetailsPage;
