import { Typography } from "@material-ui/core";
import { ChannelVoucherData } from "@saleor/channels/utils";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailabilityCard from "@saleor/components/ChannelsAvailabilityCard";
import Container from "@saleor/components/Container";
import CountryList from "@saleor/components/CountryList";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata, { MetadataFormData } from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { Tab, TabContainer } from "@saleor/components/Tab";
import {
  createChannelsChangeHandler,
  createDiscountTypeChangeHandler
} from "@saleor/discounts/handlers";
import { DiscountTypeEnum, RequirementsPicker } from "@saleor/discounts/types";
import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Backlink } from "@saleor/macaw-ui";
import { validatePrice } from "@saleor/products/utils/validation";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, splitDateTime } from "../../../misc";
import { ChannelProps, ListProps, TabListActions } from "../../../types";
import {
  DiscountValueTypeEnum,
  PermissionEnum,
  VoucherTypeEnum
} from "../../../types/globalTypes";
import { VoucherDetails_voucher } from "../../types/VoucherDetails";
import DiscountCategories from "../DiscountCategories";
import DiscountCollections from "../DiscountCollections";
import DiscountDates from "../DiscountDates";
import DiscountProducts from "../DiscountProducts";
import VoucherInfo from "../VoucherInfo";
import VoucherLimits from "../VoucherLimits";
import VoucherRequirements from "../VoucherRequirements";
import VoucherSummary from "../VoucherSummary";
import { useStyles } from "../VoucherSummary/styles";
import VoucherTypes from "../VoucherTypes";
import VoucherValue from "../VoucherValue";

export enum VoucherDetailsPageTab {
  categories = "categories",
  collections = "collections",
  products = "products"
}

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
  extends Pick<ListProps, Exclude<keyof ListProps, "onRowClick">>,
    TabListActions<
      "categoryListToolbar" | "collectionListToolbar" | "productListToolbar"
    >,
    ChannelProps {
  activeTab: VoucherDetailsPageTab;
  errors: DiscountErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  voucher: VoucherDetails_voucher;
  allChannelsCount: number;
  channelListings: ChannelVoucherData[];
  hasChannelChanged: boolean;
  onBack: () => void;
  onCategoryAssign: () => void;
  onCategoryUnassign: (id: string) => void;
  onCategoryClick: (id: string) => () => void;
  onCollectionAssign: () => void;
  onCollectionUnassign: (id: string) => void;
  onCollectionClick: (id: string) => () => void;
  onCountryAssign: () => void;
  onCountryUnassign: (code: string) => void;
  onProductAssign: () => void;
  onProductUnassign: (id: string) => void;
  onProductClick: (id: string) => () => void;
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
  allChannelsCount,
  channelListings = [],
  disabled,
  errors,
  pageInfo,
  saveButtonBarState,
  voucher,
  onBack,
  onCategoryAssign,
  onCategoryClick,
  onCategoryUnassign,
  onChannelsChange,
  onCountryAssign,
  onCountryUnassign,
  onCollectionAssign,
  onCollectionClick,
  onCollectionUnassign,
  onNextPage,
  onPreviousPage,
  onProductAssign,
  onProductClick,
  onProductUnassign,
  onTabClick,
  hasChannelChanged,
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
  productListToolbar
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();
  const channel = voucher?.channelListings?.find(
    listing => listing.channel.id === selectedChannelId
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
    privateMetadata: voucher?.privateMetadata.map(mapMetadataItemToInput)
  };

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit, triggerChange, set }) => {
        const handleDiscountTypeChange = createDiscountTypeChangeHandler(
          change
        );
        const handleChannelChange = createChannelsChangeHandler(
          data.channelListings,
          onChannelsChange,
          triggerChange
        );
        const formDisabled =
          (data.discountType.toString() !== "SHIPPING" &&
            data.channelListings?.some(
              channel =>
                validatePrice(channel.discountValue) ||
                (data.requirementsPicker === RequirementsPicker.ORDER &&
                  validatePrice(channel.minSpent))
            )) ||
          data.usageLimit <= 0;
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <Backlink onClick={onBack}>
              {intl.formatMessage(sectionNames.vouchers)}
            </Backlink>
            <PageHeader
              className={classes.wrapAnywhere}
              title={voucher?.code}
            />
            <Grid>
              <div>
                <VoucherInfo
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                  variant="update"
                />
                <CardSpacer />
                <VoucherTypes
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={event => handleDiscountTypeChange(data, event)}
                />
                <CardSpacer />
                {data.discountType.toString() !== "SHIPPING" ? (
                  <VoucherValue
                    data={data}
                    disabled={disabled}
                    errors={errors}
                    onChange={change}
                    onChannelChange={handleChannelChange}
                    variant="update"
                  />
                ) : null}
                <CardSpacer />
                {data.type === VoucherTypeEnum.SPECIFIC_PRODUCT &&
                data.discountType.toString() !== "SHIPPING" ? (
                  <>
                    <TabContainer>
                      <CategoriesTab
                        isActive={
                          activeTab === VoucherDetailsPageTab.categories
                        }
                        changeTab={onTabClick}
                      >
                        {intl.formatMessage(
                          {
                            defaultMessage: "Categories ({quantity})",
                            description: "number of categories"
                          },
                          {
                            quantity: maybe(
                              () => voucher.categories.totalCount.toString(),
                              "…"
                            )
                          }
                        )}
                      </CategoriesTab>
                      <CollectionsTab
                        isActive={
                          activeTab === VoucherDetailsPageTab.collections
                        }
                        changeTab={onTabClick}
                      >
                        {intl.formatMessage(
                          {
                            defaultMessage: "Collections ({quantity})",
                            description: "number of collections"
                          },
                          {
                            quantity: maybe(
                              () => voucher.collections.totalCount.toString(),
                              "…"
                            )
                          }
                        )}
                      </CollectionsTab>
                      <ProductsTab
                        isActive={activeTab === VoucherDetailsPageTab.products}
                        changeTab={onTabClick}
                      >
                        {intl.formatMessage(
                          {
                            defaultMessage: "Products ({quantity})",
                            description: "number of products"
                          },
                          {
                            quantity: maybe(
                              () => voucher.products.totalCount.toString(),
                              "…"
                            )
                          }
                        )}
                      </ProductsTab>
                    </TabContainer>
                    <CardSpacer />
                    {activeTab === VoucherDetailsPageTab.categories ? (
                      <DiscountCategories
                        disabled={disabled}
                        onCategoryAssign={onCategoryAssign}
                        onCategoryUnassign={onCategoryUnassign}
                        onNextPage={onNextPage}
                        onPreviousPage={onPreviousPage}
                        onRowClick={onCategoryClick}
                        pageInfo={pageInfo}
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
                        onNextPage={onNextPage}
                        onPreviousPage={onPreviousPage}
                        onRowClick={onCollectionClick}
                        pageInfo={pageInfo}
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
                        onNextPage={onNextPage}
                        onPreviousPage={onPreviousPage}
                        onProductAssign={onProductAssign}
                        onProductUnassign={onProductUnassign}
                        onRowClick={onProductClick}
                        pageInfo={pageInfo}
                        products={mapEdgesToItems(voucher.products)}
                        channelsCount={allChannelsCount}
                        isChecked={isChecked}
                        selected={selected}
                        toggle={toggle}
                        toggleAll={toggleAll}
                        toolbar={productListToolbar}
                      />
                    )}
                  </>
                ) : null}
                <CardSpacer />
                {data.discountType.toString() === "SHIPPING" ? (
                  <CountryList
                    countries={maybe(() => voucher.countries)}
                    disabled={disabled}
                    emptyText={intl.formatMessage({
                      defaultMessage: "Voucher applies to all countries"
                    })}
                    title={
                      <>
                        {intl.formatMessage({
                          defaultMessage: "Countries",
                          description: "voucher country range"
                        })}
                        <Typography variant="caption">
                          <FormattedMessage defaultMessage="Voucher is limited to these countries" />
                        </Typography>
                      </>
                    }
                    onCountryAssign={onCountryAssign}
                    onCountryUnassign={onCountryUnassign}
                  />
                ) : null}
                <CardSpacer />
                <VoucherRequirements
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                  onChannelChange={handleChannelChange}
                />
                <CardSpacer />
                <VoucherLimits
                  data={data}
                  initialUsageLimit={initialForm.usageLimit}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                  setData={set}
                  isNewVoucher={false}
                />
                <CardSpacer />
                <DiscountDates
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
              </div>
              <div>
                <VoucherSummary
                  voucher={voucher}
                  selectedChannelId={selectedChannelId}
                />
                <CardSpacer />
                <ChannelsAvailabilityCard
                  managePermissions={[PermissionEnum.MANAGE_DISCOUNTS]}
                  selectedChannelsCount={data.channelListings.length}
                  allChannelsCount={allChannelsCount}
                  channelsList={data.channelListings.map(channel => ({
                    id: channel.id,
                    name: channel.name
                  }))}
                  disabled={disabled}
                  openModal={openChannelsModal}
                />
              </div>
              <Metadata data={data} onChange={changeMetadata} />
            </Grid>
            <Savebar
              disabled={
                disabled || formDisabled || (!hasChanged && !hasChannelChanged)
              }
              onCancel={onBack}
              onDelete={onRemove}
              onSubmit={submit}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};
VoucherDetailsPage.displayName = "VoucherDetailsPage";

export default VoucherDetailsPage;
