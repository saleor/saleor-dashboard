import { ChannelSaleData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailability from "@saleor/components/ChannelsAvailability";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { Tab, TabContainer } from "@saleor/components/Tab";
import { createSaleChannelsChangeHandler } from "@saleor/discounts/handlers";
import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { sectionNames } from "@saleor/intl";
import { validatePrice } from "@saleor/products/utils/validation";
import React from "react";
import { useIntl } from "react-intl";

import { maybe, splitDateTime } from "../../../misc";
import { ChannelProps, ListProps, TabListActions } from "../../../types";
import { SaleType as SaleTypeEnum } from "../../../types/globalTypes";
import { SaleDetails_sale } from "../../types/SaleDetails";
import DiscountCategories from "../DiscountCategories";
import DiscountCollections from "../DiscountCollections";
import DiscountDates from "../DiscountDates";
import DiscountProducts from "../DiscountProducts";
import SaleInfo from "../SaleInfo";
import SaleSummary from "../SaleSummary";
import SaleType from "../SaleType";
import SaleValue from "../SaleValue";

export interface SaleDetailsPageFormData {
  channelListings: ChannelSaleData[];
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
  products = "products"
}
export function saleDetailsPageTab(tab: string): SaleDetailsPageTab {
  return tab === SaleDetailsPageTab.products
    ? SaleDetailsPageTab.products
    : tab === SaleDetailsPageTab.collections
    ? SaleDetailsPageTab.collections
    : SaleDetailsPageTab.categories;
}

export interface SaleDetailsPageProps
  extends Pick<ListProps, Exclude<keyof ListProps, "onRowClick">>,
    TabListActions<
      "categoryListToolbar" | "collectionListToolbar" | "productListToolbar"
    >,
    ChannelProps {
  activeTab: SaleDetailsPageTab;
  errors: DiscountErrorFragment[];
  sale: SaleDetails_sale;
  allChannelsCount: number;
  channelListings: ChannelSaleData[];
  hasChannelChanged: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onCategoryAssign: () => void;
  onCategoryUnassign: (id: string) => void;
  onCategoryClick: (id: string) => () => void;
  onCollectionAssign: () => void;
  onCollectionUnassign: (id: string) => void;
  onCollectionClick: (id: string) => () => void;
  onProductAssign: () => void;
  onProductUnassign: (id: string) => void;
  onProductClick: (id: string) => () => void;
  onRemove: () => void;
  onSubmit: (data: SaleDetailsPageFormData) => void;
  onTabClick: (index: SaleDetailsPageTab) => void;
  onChannelsChange: (data: ChannelSaleData[]) => void;
  openChannelsModal: () => void;
}

const CategoriesTab = Tab(SaleDetailsPageTab.categories);
const CollectionsTab = Tab(SaleDetailsPageTab.collections);
const ProductsTab = Tab(SaleDetailsPageTab.products);

const SaleDetailsPage: React.FC<SaleDetailsPageProps> = ({
  activeTab,
  allChannelsCount,
  channelListings = [],
  disabled,
  errors,
  onRemove,
  onSubmit,
  onTabClick,
  hasChannelChanged,
  openChannelsModal,
  pageInfo,
  sale,
  saveButtonBarState,
  onBack,
  onCategoryAssign,
  onCategoryUnassign,
  onCategoryClick,
  onChannelsChange,
  onCollectionAssign,
  onCollectionUnassign,
  onCollectionClick,
  onNextPage,
  onPreviousPage,
  onProductAssign,
  onProductUnassign,
  onProductClick,
  categoryListToolbar,
  collectionListToolbar,
  productListToolbar,
  isChecked,
  selected,
  selectedChannelId,
  toggle,
  toggleAll
}) => {
  const intl = useIntl();

  const initialForm: SaleDetailsPageFormData = {
    channelListings,
    endDate: splitDateTime(maybe(() => sale.endDate, "")).date,
    endTime: splitDateTime(maybe(() => sale.endDate, "")).time,
    hasEndDate: maybe(() => !!sale.endDate),
    name: maybe(() => sale.name, ""),
    startDate: splitDateTime(maybe(() => sale.startDate, "")).date,
    startTime: splitDateTime(maybe(() => sale.startDate, "")).time,
    type: maybe(() => sale.type, SaleTypeEnum.FIXED)
  };
  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit, triggerChange }) => {
        const handleChannelChange = createSaleChannelsChangeHandler(
          data.channelListings,
          onChannelsChange,
          triggerChange
        );
        const formDisabled = data.channelListings?.some(channel =>
          validatePrice(channel.discountValue)
        );
        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.sales)}
            </AppHeader>
            <PageHeader title={maybe(() => sale.name)} />
            <Grid>
              <div>
                <SaleInfo
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <SaleType data={data} disabled={disabled} onChange={change} />
                <CardSpacer />
                <SaleValue
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={handleChannelChange}
                />
                <CardSpacer />
                <TabContainer>
                  <CategoriesTab
                    isActive={activeTab === SaleDetailsPageTab.categories}
                    changeTab={onTabClick}
                  >
                    {intl.formatMessage(
                      {
                        defaultMessage: "Categories ({quantity})",
                        description: "number of categories",
                        id: "saleDetailsPageCategoriesQuantity"
                      },
                      {
                        quantity: maybe(
                          () => sale.categories.totalCount.toString(),
                          "…"
                        )
                      }
                    )}
                  </CategoriesTab>
                  <CollectionsTab
                    isActive={activeTab === SaleDetailsPageTab.collections}
                    changeTab={onTabClick}
                  >
                    {intl.formatMessage(
                      {
                        defaultMessage: "Collections ({quantity})",
                        description: "number of collections",
                        id: "saleDetailsPageCollectionsQuantity"
                      },
                      {
                        quantity: maybe(
                          () => sale.collections.totalCount.toString(),
                          "…"
                        )
                      }
                    )}
                  </CollectionsTab>
                  <ProductsTab
                    isActive={activeTab === SaleDetailsPageTab.products}
                    changeTab={onTabClick}
                  >
                    {intl.formatMessage(
                      {
                        defaultMessage: "Products ({quantity})",
                        description: "number of products",
                        id: "saleDetailsPageProductsQuantity"
                      },
                      {
                        quantity: maybe(
                          () => sale.products.totalCount.toString(),
                          "…"
                        )
                      }
                    )}
                  </ProductsTab>
                </TabContainer>
                <CardSpacer />
                {activeTab === SaleDetailsPageTab.categories ? (
                  <DiscountCategories
                    disabled={disabled}
                    onCategoryAssign={onCategoryAssign}
                    onCategoryUnassign={onCategoryUnassign}
                    onNextPage={onNextPage}
                    onPreviousPage={onPreviousPage}
                    onRowClick={onCategoryClick}
                    pageInfo={pageInfo}
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
                    onNextPage={onNextPage}
                    onPreviousPage={onPreviousPage}
                    onRowClick={onCollectionClick}
                    pageInfo={pageInfo}
                    discount={sale}
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
                    discount={sale}
                    channelsCount={allChannelsCount}
                    selectedChannelId={selectedChannelId}
                    isChecked={isChecked}
                    selected={selected}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={productListToolbar}
                  />
                )}
                <CardSpacer />
                <DiscountDates
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
              </div>
              <div>
                <SaleSummary
                  selectedChannelId={selectedChannelId}
                  sale={sale}
                />
                <CardSpacer />
                <ChannelsAvailability
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
            </Grid>
            <SaveButtonBar
              disabled={
                disabled || formDisabled || (!hasChanged && !hasChannelChanged)
              }
              onCancel={onBack}
              onDelete={onRemove}
              onSave={submit}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};
SaleDetailsPage.displayName = "SaleDetailsPage";
export default SaleDetailsPage;
