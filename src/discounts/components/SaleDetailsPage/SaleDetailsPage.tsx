// @ts-strict-ignore
import { ChannelSaleData, validateSalePrice } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata, MetadataFormData } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { Tab, TabContainer } from "@dashboard/components/Tab";
import {
  createSaleChannelsChangeHandler,
  createSaleUpdateHandler,
} from "@dashboard/discounts/handlers";
import { itemsQuantityMessages } from "@dashboard/discounts/translations";
import { saleListPath, saleListUrl } from "@dashboard/discounts/urls";
import { SALE_UPDATE_FORM_ID } from "@dashboard/discounts/views/SaleDetails/types";
import {
  DiscountErrorFragment,
  PermissionEnum,
  SaleDetailsFragment,
  SaleType as SaleTypeEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { sprinkles } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { splitDateTime } from "../../../misc";
import { ChannelProps, ListProps, TabListActions } from "../../../types";
import DiscountCategories from "../DiscountCategories";
import DiscountCollections from "../DiscountCollections";
import DiscountDates from "../DiscountDates";
import DiscountProducts from "../DiscountProducts";
import DiscountVariants from "../DiscountVariants";
import SaleInfo from "../SaleInfo";
import SaleSummary from "../SaleSummary";
import SaleType from "../SaleType";
import SaleValue from "../SaleValue";

export interface ChannelSaleFormData extends ChannelSaleData {
  percentageValue: string;
  fixedValue: string;
}
export interface SaleDetailsPageFormData extends MetadataFormData {
  channelListings: ChannelSaleFormData[];
  endDate: string;
  endTime: string;
  hasEndDate: boolean;
  name: string;
  startDate: string;
  startTime: string;
  type: SaleTypeEnum;
}

export enum SaleDetailsPageTab {
  categories = "categories",
  collections = "collections",
  products = "products",
  variants = "variants",
}

export type SaleTabItemsCount = Partial<Record<SaleDetailsPageTab, number>>;

export interface SaleDetailsPageProps
  extends Pick<ListProps, Exclude<keyof ListProps, "getRowHref">>,
    TabListActions<
      "categoryListToolbar" | "collectionListToolbar" | "productListToolbar" | "variantListToolbar"
    >,
    ChannelProps {
  activeTab: SaleDetailsPageTab;
  tabItemsCount: SaleTabItemsCount;
  errors: DiscountErrorFragment[];
  sale: SaleDetailsFragment;
  allChannelsCount: number;
  channelListings: ChannelSaleFormData[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onCategoryAssign: () => void;
  onCategoryUnassign: (id: string) => void;
  onCollectionAssign: () => void;
  onCollectionUnassign: (id: string) => void;
  onProductAssign: () => void;
  onProductUnassign: (id: string) => void;
  onVariantAssign: () => void;
  onVariantUnassign: (id: string) => void;
  onRemove: () => void;
  onSubmit: (data: SaleDetailsPageFormData) => SubmitPromise<any[]>;
  onTabClick: (index: SaleDetailsPageTab) => void;
  onChannelsChange: (data: ChannelSaleFormData[]) => void;
  openChannelsModal: () => void;
}

const CategoriesTab = Tab(SaleDetailsPageTab.categories);
const CollectionsTab = Tab(SaleDetailsPageTab.collections);
const ProductsTab = Tab(SaleDetailsPageTab.products);
const VariantsTab = Tab(SaleDetailsPageTab.variants);
const SaleDetailsPage: React.FC<SaleDetailsPageProps> = ({
  activeTab,
  tabItemsCount = {},
  allChannelsCount,
  channelListings = [],
  disabled,
  errors,
  onRemove,
  onSubmit,
  onTabClick,
  openChannelsModal,
  sale,
  saveButtonBarState,
  onCategoryAssign,
  onCategoryUnassign,
  onChannelsChange,
  onCollectionAssign,
  onCollectionUnassign,
  onProductAssign,
  onProductUnassign,
  onVariantAssign,
  onVariantUnassign,
  categoryListToolbar,
  collectionListToolbar,
  productListToolbar,
  variantListToolbar,
  isChecked,
  selected,
  selectedChannelId,
  toggle,
  toggleAll,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [localErrors, setLocalErrors] = React.useState<DiscountErrorFragment[]>([]);
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();
  const initialForm: SaleDetailsPageFormData = {
    channelListings,
    endDate: splitDateTime(sale?.endDate ?? "").date,
    endTime: splitDateTime(sale?.endDate ?? "").time,
    hasEndDate: !!sale?.endDate,
    name: sale?.name ?? "",
    startDate: splitDateTime(sale?.startDate ?? "").date,
    startTime: splitDateTime(sale?.startDate ?? "").time,
    type: sale?.type ?? SaleTypeEnum.FIXED,
    metadata: sale?.metadata.map(mapMetadataItemToInput),
    privateMetadata: sale?.privateMetadata.map(mapMetadataItemToInput),
  };
  const checkIfSaveIsDisabled = (data: SaleDetailsPageFormData) =>
    data.channelListings?.some(channel => validateSalePrice(data, channel)) || disabled;

  const saleListBackLink = useBackLinkWithState({
    path: saleListPath,
  });

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      formId={SALE_UPDATE_FORM_ID}
      checkIfSaveIsDisabled={checkIfSaveIsDisabled}
    >
      {({ change, data, submit, triggerChange }) => {
        const handleChannelChange = createSaleChannelsChangeHandler(
          data.channelListings,
          onChannelsChange,
          triggerChange,
          data.type,
        );
        const changeMetadata = makeMetadataChangeHandler(change);
        const handleSubmit = createSaleUpdateHandler(submit, setLocalErrors);
        const allErrors = [...localErrors, ...errors];

        return (
          <DetailPageLayout>
            <TopNav href={saleListBackLink} title={sale?.name} />
            <DetailPageLayout.Content>
              <SaleInfo data={data} disabled={disabled} errors={errors} onChange={change} />
              <SaleType data={data} disabled={disabled} onChange={change} />
              <SaleValue
                data={data}
                disabled={disabled}
                errors={allErrors}
                onChange={handleChannelChange}
              />
              <CardSpacer />
              <TabContainer className={sprinkles({ paddingX: 9 })}>
                <CategoriesTab
                  testId="categories-tab"
                  isActive={activeTab === SaleDetailsPageTab.categories}
                  changeTab={onTabClick}
                >
                  {intl.formatMessage(itemsQuantityMessages.categories, {
                    quantity: tabItemsCount.categories?.toString() || "…",
                  })}
                </CategoriesTab>
                <CollectionsTab
                  testId="collections-tab"
                  isActive={activeTab === SaleDetailsPageTab.collections}
                  changeTab={onTabClick}
                >
                  {intl.formatMessage(itemsQuantityMessages.collections, {
                    quantity: tabItemsCount.collections?.toString() || "…",
                  })}
                </CollectionsTab>
                <ProductsTab
                  testId="products-tab"
                  isActive={activeTab === SaleDetailsPageTab.products}
                  changeTab={onTabClick}
                >
                  {intl.formatMessage(itemsQuantityMessages.products, {
                    quantity: tabItemsCount.products?.toString() || "…",
                  })}
                </ProductsTab>
                <VariantsTab
                  testId="variants-tab"
                  isActive={activeTab === SaleDetailsPageTab.variants}
                  changeTab={onTabClick}
                >
                  {intl.formatMessage(itemsQuantityMessages.variants, {
                    quantity: tabItemsCount.variants?.toString() || "…",
                  })}
                </VariantsTab>
              </TabContainer>
              <CardSpacer />
              {activeTab === SaleDetailsPageTab.categories ? (
                <DiscountCategories
                  disabled={disabled}
                  onCategoryAssign={onCategoryAssign}
                  onCategoryUnassign={onCategoryUnassign}
                  discount={sale}
                  isChecked={isChecked}
                  selected={selected}
                  toggle={toggle}
                  toggleAll={toggleAll}
                  toolbar={categoryListToolbar}
                />
              ) : activeTab === SaleDetailsPageTab.collections ? (
                <DiscountCollections
                  disabled={disabled}
                  onCollectionAssign={onCollectionAssign}
                  onCollectionUnassign={onCollectionUnassign}
                  discount={sale}
                  isChecked={isChecked}
                  selected={selected}
                  toggle={toggle}
                  toggleAll={toggleAll}
                  toolbar={collectionListToolbar}
                />
              ) : activeTab === SaleDetailsPageTab.products ? (
                <DiscountProducts
                  disabled={disabled}
                  onProductAssign={onProductAssign}
                  onProductUnassign={onProductUnassign}
                  discount={sale}
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
                  discount={sale}
                  isChecked={isChecked}
                  selected={selected}
                  toggle={toggle}
                  toggleAll={toggleAll}
                  toolbar={variantListToolbar}
                />
              )}
              <CardSpacer />
              <DiscountDates data={data} disabled={disabled} errors={errors} onChange={change} />
              <Metadata data={data} onChange={changeMetadata} />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <SaleSummary selectedChannelId={selectedChannelId} sale={sale} />
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
              <Savebar.DeleteButton onClick={onRemove} />
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(saleListUrl())} />
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

SaleDetailsPage.displayName = "SaleDetailsPage";
export default SaleDetailsPage;
