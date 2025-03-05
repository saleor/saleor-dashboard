import { ChannelVoucherData } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import AssignCategoriesDialog from "@dashboard/components/AssignCategoryDialog/AssignCategoryDialog";
import AssignCollectionDialog from "@dashboard/components/AssignCollectionDialog";
import AssignProductDialog from "@dashboard/components/AssignProductDialog";
import CardSpacer from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import CountryList from "@dashboard/components/CountryList";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { Tab, TabContainer } from "@dashboard/components/Tab";
import DiscountCategories from "@dashboard/discounts/components/DiscountCategories";
import DiscountCollections from "@dashboard/discounts/components/DiscountCollections";
import DiscountProducts from "@dashboard/discounts/components/DiscountProducts";
import {
  createChannelsChangeHandler,
  createDiscountTypeChangeHandler,
} from "@dashboard/discounts/handlers";
import { itemsQuantityMessages } from "@dashboard/discounts/translations";
import { VoucherCreateUrlQueryParams, voucherListUrl } from "@dashboard/discounts/urls";
import { VOUCHER_CREATE_FORM_ID } from "@dashboard/discounts/views/VoucherCreate/types";
import { DiscountErrorFragment, PermissionEnum, VoucherTypeEnum } from "@dashboard/graphql";
import useForm, { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { validatePrice } from "@dashboard/products/utils/validation";
import { TabListActions } from "@dashboard/types";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { RequirementsPicker } from "../../types";
import { VoucherCodes } from "../VoucherCodes";
import { GenerateMultipleVoucherCodeFormData } from "../VoucherCodesGenerateDialog";
import VoucherDates from "../VoucherDates";
import { VoucherTabItemsCount } from "../VoucherDetailsPage";
import VoucherInfo from "../VoucherInfo";
import VoucherLimits from "../VoucherLimits";
import VoucherRequirements from "../VoucherRequirements";
import VoucherTypes from "../VoucherTypes";
import VoucherValue from "../VoucherValue";
import { initialForm } from "./const";
import { useVoucherCodesPagination } from "./hooks/useVoucherCodesPagination";
import { useVoucherCodesSelection } from "./hooks/useVoucherCodesSelection";
import { FormData } from "./types";
import { generateDraftVoucherCode, generateMultipleVoucherCodes, voucherCodeExists } from "./utils";

export enum VoucherCreatePageTab {
  categories = "categories",
  collections = "collections",
  products = "products",
}

export interface VoucherCreatePageProps
  extends TabListActions<"categoryListToolbar" | "collectionListToolbar" | "productListToolbar"> {
  activeTab: VoucherCreatePageTab;
  allChannelsCount: number;
  channelListings: ChannelVoucherData[];
  disabled: boolean;
  errors: DiscountErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onChannelsChange: (data: ChannelVoucherData[]) => void;
  openChannelsModal: () => void;
  onSubmit: (data: FormData) => SubmitPromise;
  tabItemsCount: VoucherTabItemsCount;
  onTabClick: (index: VoucherCreatePageTab) => void;
  action: VoucherCreateUrlQueryParams["action"];
  openModal: (action: VoucherCreateUrlQueryParams["action"]) => void;
  closeModal: () => void;
}

const CategoriesTab = Tab(VoucherCreatePageTab.categories);
const CollectionsTab = Tab(VoucherCreatePageTab.collections);
const ProductsTab = Tab(VoucherCreatePageTab.products);

const VoucherCreatePage: React.FC<VoucherCreatePageProps> = ({
  activeTab,
  tabItemsCount,
  allChannelsCount,
  channelListings = [],
  disabled,
  errors,
  saveButtonBarState,
  onChannelsChange,
  onSubmit,
  openChannelsModal,
  onTabClick,
  selected,
  collectionListToolbar,
  productListToolbar,
  isChecked,
  categoryListToolbar,
  action,
  openModal,
  closeModal,
  toggle,
  toggleAll,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

  const checkIfSaveIsDisabled = (data: FormData) =>
    (data.discountType.toString() !== "SHIPPING" &&
      data.channelListings?.some(
        channel =>
          validatePrice(channel.discountValue) ||
          (data.requirementsPicker === RequirementsPicker.ORDER && validatePrice(channel.minSpent)),
      )) ||
    disabled;

  const { change, data, triggerChange, set, submit } = useForm<FormData, unknown>(
    { ...initialForm, channelListings },
    onSubmit,
    {
      confirmLeave: true,
      formId: VOUCHER_CREATE_FORM_ID,
      checkIfSaveIsDisabled,
    },
  );

  const { clearRowSelection, setSelectedVoucherCodesIds, selectedRowIds } =
    useVoucherCodesSelection(data.codes);

  const handleDiscountTypeChange = createDiscountTypeChangeHandler(change);

  const handleChannelChange = createChannelsChangeHandler(
    data.channelListings,
    onChannelsChange,
    triggerChange,
  );

  const changeMetadata = makeMetadataChangeHandler(change);

  const handleGenerateMultipleCodes = ({
    quantity,
    prefix,
  }: GenerateMultipleVoucherCodeFormData) => {
    clearRowSelection();
    triggerChange(true);
    set({
      codes: [...generateMultipleVoucherCodes(quantity, prefix), ...data.codes],
    });
  };

  const handleDeleteVoucherCodes = () => {
    clearRowSelection();
    set({
      codes: data.codes.filter(({ code }) => !selectedRowIds.includes(code)),
    });
  };

  const handleGenerateCustomCode = (code: string) => {
    if (voucherCodeExists(code, data.codes)) {
      throw new Error("Code already exists");
    }

    triggerChange(true);
    set({
      codes: [generateDraftVoucherCode(code), ...data.codes],
    });
  };

  const { pagination, paginatedCodes, settings, onSettingsChange } = useVoucherCodesPagination(
    data.codes,
  );

  const handleCategoryUnassign = (id: string) => {
    change({
      target: {
        name: "categories",
        value: data.categories.filter(category => category.id !== id),
      },
    });
  };

  const handleCategoriesAssign = (categories: any[]) => {
    change({
      target: {
        name: "categories",
        value: [...data.categories, ...categories],
      },
    });
    closeModal();
  };

  const handleCollectionUnassign = (id: string) => {
    change({
      target: {
        name: "collections",
        value: data.collections.filter(collection => collection.id !== id),
      },
    });
  };

  const handleCollectionAssign = (collections: any[]) => {
    change({
      target: {
        name: "collections",
        value: [...data.collections, ...collections],
      },
    });
    closeModal();
  };

  const handleProductUnassign = (id: string) => {
    change({
      target: {
        name: "products",
        value: data.products.filter(product => product.id !== id),
      },
    });
  };

  const handleProductsAssign = (products: any[]) => {
    change({
      target: {
        name: "products",
        value: [...data.products, ...products],
      },
    });
    closeModal();
  };

  const handleCountryUnassign = (code: string) => {
    set({
      countries: data.countries.filter(country => country !== code),
    });
  };

  return (
    <form onSubmit={submit}>
      <DetailPageLayout>
        <TopNav
          href={voucherListUrl()}
          title={intl.formatMessage({
            id: "PsclSa",
            defaultMessage: "Create Voucher",
            description: "page header",
          })}
        />
        <DetailPageLayout.Content>
          <VoucherInfo
            data={data}
            errors={errors}
            disabled={disabled}
            onChange={event => handleDiscountTypeChange(data, event)}
          />
          <VoucherCodes
            codes={paginatedCodes}
            onDeleteCodes={handleDeleteVoucherCodes}
            onMultiCodesGenerate={handleGenerateMultipleCodes}
            onSelectVoucherCodesIds={setSelectedVoucherCodesIds}
            onSettingsChange={onSettingsChange}
            onCustomCodeGenerate={handleGenerateCustomCode}
            selectedCodesIds={selectedRowIds}
            settings={settings}
            voucherCodesPagination={pagination}
          />
          <VoucherTypes data={data} disabled={disabled} errors={errors} onChange={change} />
          {data.discountType.toString() !== "SHIPPING" ? (
            <VoucherValue
              data={data}
              disabled={disabled}
              errors={errors}
              onChannelChange={handleChannelChange}
              onChange={change}
            />
          ) : null}
          {data.type === VoucherTypeEnum.SPECIFIC_PRODUCT &&
          data.discountType.toString() !== "SHIPPING" ? (
            <>
              <TabContainer>
                <CategoriesTab
                  isActive={activeTab === VoucherCreatePageTab.categories}
                  changeTab={onTabClick}
                  testId="categories-tab"
                >
                  {intl.formatMessage(itemsQuantityMessages.categories, {
                    quantity: tabItemsCount.categories?.toString() || "…",
                  })}
                </CategoriesTab>
                <CollectionsTab
                  testId="collections-tab"
                  isActive={activeTab === VoucherCreatePageTab.collections}
                  changeTab={onTabClick}
                >
                  {intl.formatMessage(itemsQuantityMessages.collections, {
                    quantity: tabItemsCount.collections?.toString() || "…",
                  })}
                </CollectionsTab>
                <ProductsTab
                  testId="products-tab"
                  isActive={activeTab === VoucherCreatePageTab.products}
                  changeTab={onTabClick}
                >
                  {intl.formatMessage(itemsQuantityMessages.products, {
                    quantity: tabItemsCount.products?.toString() || "…",
                  })}
                </ProductsTab>
              </TabContainer>
              <CardSpacer />
              {activeTab === VoucherCreatePageTab.categories ? (
                <DiscountCategories
                  disabled={disabled}
                  onCategoryAssign={() => openModal("assign-category")}
                  onCategoryUnassign={handleCategoryUnassign}
                  categories={data.categories}
                  isChecked={isChecked}
                  selected={selected}
                  toggle={toggle}
                  toggleAll={toggleAll}
                  toolbar={categoryListToolbar}
                />
              ) : activeTab === VoucherCreatePageTab.collections ? (
                <DiscountCollections
                  disabled={disabled}
                  onCollectionAssign={() => openModal("assign-collection")}
                  onCollectionUnassign={handleCollectionUnassign}
                  collections={data.collections}
                  isChecked={isChecked}
                  selected={selected}
                  toggle={toggle}
                  toggleAll={toggleAll}
                  toolbar={collectionListToolbar}
                />
              ) : (
                <DiscountProducts
                  disabled={disabled}
                  onProductAssign={() => openModal("assign-product")}
                  onProductUnassign={handleProductUnassign}
                  products={data.products}
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
              countries={[]}
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
              onCountryAssign={() => openModal("assign-country")}
              onCountryUnassign={handleCountryUnassign}
            />
          ) : null}
          <VoucherRequirements
            data={data}
            disabled={disabled}
            errors={errors}
            onChannelChange={handleChannelChange}
            onChange={change}
          />
          <VoucherLimits
            data={data}
            initialUsageLimit={initialForm.usageLimit}
            disabled={disabled}
            errors={errors}
            onChange={change}
            setData={set}
            isNewVoucher
          />
          <VoucherDates data={data} disabled={disabled} errors={errors} onChange={change} />
          <Metadata data={data} onChange={changeMetadata} />
        </DetailPageLayout.Content>
        <DetailPageLayout.RightSidebar>
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
        <Savebar>
          <Savebar.Spacer />
          <Savebar.CancelButton onClick={() => navigate(voucherListUrl())} />
          <Savebar.ConfirmButton
            transitionState={saveButtonBarState}
            onClick={submit}
            disabled={disabled}
          />
        </Savebar>
      </DetailPageLayout>

      <AssignCategoriesDialog
        selectedCategories={data.categories.map(category => category.id)}
        confirmButtonState={"default"}
        open={action === "assign-category"}
        onClose={closeModal}
        onSubmit={handleCategoriesAssign}
      />
      <AssignCollectionDialog
        selectedCollections={data.collections.map(collection => collection.id)}
        confirmButtonState={"default"}
        open={action === "assign-collection"}
        onClose={closeModal}
        onSubmit={handleCollectionAssign}
      />
      {/*<DiscountCountrySelectDialog*/}
      {/*  confirmButtonState="default"*/}
      {/*  countries={[]}*/}
      {/*  onClose={closeModal}*/}
      {/*  onConfirm={formData => {*/}
      {/*    console.log("assing country");*/}
      {/*  }}*/}
      {/*  open={action === "assign-country"}*/}
      {/*  initial={[]}*/}
      {/*/>*/}
      <AssignProductDialog
        selectedChannels={channelListings}
        selectedIds={data.products.map(product => product.id)}
        productUnavailableText={intl.formatMessage({
          id: "XOkUxQ",
          defaultMessage: "Product unavailable in voucher channels",
        })}
        confirmButtonState={"default"}
        open={action === "assign-product"}
        onClose={closeModal}
        onSubmit={handleProductsAssign}
      />
    </form>
  );
};

VoucherCreatePage.displayName = "VoucherCreatePage";
export default VoucherCreatePage;
