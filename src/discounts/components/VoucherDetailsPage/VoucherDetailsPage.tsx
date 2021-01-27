import Typography from "@material-ui/core/Typography";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import CountryList from "@saleor/components/CountryList";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { Tab, TabContainer } from "@saleor/components/Tab";
import { RequirementsPicker } from "@saleor/discounts/types";
import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, splitDateTime } from "../../../misc";
import { ListProps, TabListActions } from "../../../types";
import {
  DiscountValueTypeEnum,
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
import VoucherTypes from "../VoucherTypes";
import VoucherValue from "../VoucherValue";

export enum VoucherDetailsPageTab {
  categories = "categories",
  collections = "collections",
  products = "products"
}

export function voucherDetailsPageTab(tab: string): VoucherDetailsPageTab {
  return tab === VoucherDetailsPageTab.products
    ? VoucherDetailsPageTab.products
    : tab === VoucherDetailsPageTab.collections
    ? VoucherDetailsPageTab.collections
    : VoucherDetailsPageTab.categories;
}

export interface VoucherDetailsPageFormData {
  applyOncePerCustomer: boolean;
  applyOncePerOrder: boolean;
  code: string;
  discountType: DiscountValueTypeEnum;
  endDate: string;
  endTime: string;
  hasEndDate: boolean;
  hasUsageLimit: boolean;
  minSpent: string;
  minCheckoutItemsQuantity: string;
  requirementsPicker: RequirementsPicker;
  startDate: string;
  startTime: string;
  type: VoucherTypeEnum;
  usageLimit: string;
  value: number;
}

export interface VoucherDetailsPageProps
  extends Pick<ListProps, Exclude<keyof ListProps, "onRowClick">>,
    TabListActions<
      "categoryListToolbar" | "collectionListToolbar" | "productListToolbar"
    > {
  activeTab: VoucherDetailsPageTab;
  defaultCurrency: string;
  errors: DiscountErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  voucher: VoucherDetails_voucher;
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
}

const CategoriesTab = Tab(VoucherDetailsPageTab.categories);
const CollectionsTab = Tab(VoucherDetailsPageTab.collections);
const ProductsTab = Tab(VoucherDetailsPageTab.products);

const VoucherDetailsPage: React.FC<VoucherDetailsPageProps> = ({
  activeTab,
  defaultCurrency,
  disabled,
  errors,
  pageInfo,
  saveButtonBarState,
  voucher,
  onBack,
  onCategoryAssign,
  onCategoryClick,
  onCategoryUnassign,
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
  onRemove,
  onSubmit,
  toggle,
  toggleAll,
  selected,
  isChecked,
  categoryListToolbar,
  collectionListToolbar,
  productListToolbar
}) => {
  const intl = useIntl();

  let requirementsPickerInitValue;
  if (maybe(() => voucher.minSpent.amount) > 0) {
    requirementsPickerInitValue = RequirementsPicker.ORDER;
  } else if (maybe(() => voucher.minCheckoutItemsQuantity) > 0) {
    requirementsPickerInitValue = RequirementsPicker.ITEM;
  } else {
    requirementsPickerInitValue = RequirementsPicker.NONE;
  }

  const initialForm: VoucherDetailsPageFormData = {
    applyOncePerCustomer: maybe(() => voucher.applyOncePerCustomer, false),
    applyOncePerOrder: maybe(() => voucher.applyOncePerOrder, false),
    code: maybe(() => voucher.code, ""),
    discountType: maybe(
      () => voucher.discountValueType,
      DiscountValueTypeEnum.FIXED
    ),
    endDate: splitDateTime(maybe(() => voucher.endDate, "")).date,
    endTime: splitDateTime(maybe(() => voucher.endDate, "")).time,
    hasEndDate: maybe(() => !!voucher.endDate),
    hasUsageLimit: maybe(() => !!voucher.usageLimit),
    minCheckoutItemsQuantity: maybe(
      () => voucher.minCheckoutItemsQuantity.toString(),
      "0"
    ),
    minSpent: maybe(() => voucher.minSpent.amount.toString(), "0"),
    requirementsPicker: requirementsPickerInitValue,
    startDate: splitDateTime(maybe(() => voucher.startDate, "")).date,
    startTime: splitDateTime(maybe(() => voucher.startDate, "")).time,
    type: maybe(() => voucher.type, VoucherTypeEnum.ENTIRE_ORDER),
    usageLimit: maybe(() => voucher.usageLimit.toString(), "0"),
    value: maybe(() => voucher.discountValue, 0)
  };

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.vouchers)}
          </AppHeader>
          <PageHeader title={maybe(() => voucher.code)} />
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
                onChange={change}
              />
              <CardSpacer />
              {data.discountType.toString() !== "SHIPPING" ? (
                <VoucherValue
                  data={data}
                  disabled={disabled}
                  defaultCurrency={defaultCurrency}
                  errors={errors}
                  onChange={change}
                  variant="update"
                />
              ) : null}
              <CardSpacer />
              {data.type === VoucherTypeEnum.SPECIFIC_PRODUCT &&
              data.discountType.toString() !== "SHIPPING" ? (
                <>
                  <TabContainer>
                    <CategoriesTab
                      isActive={activeTab === VoucherDetailsPageTab.categories}
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
                      isActive={activeTab === VoucherDetailsPageTab.collections}
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
                      discount={voucher}
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
                defaultCurrency={defaultCurrency}
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <VoucherLimits
                data={data}
                disabled={disabled}
                defaultCurrency={defaultCurrency}
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <DiscountDates
                data={data}
                disabled={disabled}
                defaultCurrency={defaultCurrency}
                errors={errors}
                onChange={change}
              />
            </div>
            <div>
              <VoucherSummary
                defaultCurrency={defaultCurrency}
                voucher={voucher}
              />
            </div>
          </Grid>
          <SaveButtonBar
            disabled={disabled || !hasChanged}
            onCancel={onBack}
            onDelete={onRemove}
            onSave={submit}
            state={saveButtonBarState}
          />
        </Container>
      )}
    </Form>
  );
};
VoucherDetailsPage.displayName = "VoucherDetailsPage";

export default VoucherDetailsPage;
