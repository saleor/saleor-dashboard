import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { Tab, TabContainer } from "@saleor/components/Tab";
import { sectionNames } from "@saleor/intl";
import { maybe, splitDateTime } from "../../../misc";
import { ListProps, TabListActions, UserError } from "../../../types";
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

export interface FormData {
  endDate: string;
  endTime: string;
  hasEndDate: boolean;
  name: string;
  startDate: string;
  startTime: string;
  type: SaleTypeEnum;
  value: string;
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
    > {
  activeTab: SaleDetailsPageTab;
  defaultCurrency: string;
  errors: UserError[];
  sale: SaleDetails_sale;
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
  onSubmit: (data: FormData) => void;
  onTabClick: (index: SaleDetailsPageTab) => void;
}

const CategoriesTab = Tab(SaleDetailsPageTab.categories);
const CollectionsTab = Tab(SaleDetailsPageTab.collections);
const ProductsTab = Tab(SaleDetailsPageTab.products);

const SaleDetailsPage: React.FC<SaleDetailsPageProps> = ({
  activeTab,
  defaultCurrency,
  disabled,
  errors,
  onRemove,
  onSubmit,
  onTabClick,
  pageInfo,
  sale,
  saveButtonBarState,
  onBack,
  onCategoryAssign,
  onCategoryUnassign,
  onCategoryClick,
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
  toggle,
  toggleAll
}) => {
  const intl = useIntl();

  const initialForm: FormData = {
    endDate: splitDateTime(maybe(() => sale.endDate, "")).date,
    endTime: splitDateTime(maybe(() => sale.endDate, "")).time,
    hasEndDate: maybe(() => !!sale.endDate),
    name: maybe(() => sale.name, ""),
    startDate: splitDateTime(maybe(() => sale.startDate, "")).date,
    startTime: splitDateTime(maybe(() => sale.startDate, "")).time,
    type: maybe(() => sale.type, SaleTypeEnum.FIXED),
    value: maybe(() => sale.value.toString(), "")
  };
  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit }) => (
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
                currencySymbol={defaultCurrency}
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
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
                defaultCurrency={defaultCurrency}
                errors={errors}
                onChange={change}
              />
            </div>
            <div>
              <SaleSummary defaultCurrency={defaultCurrency} sale={sale} />
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
SaleDetailsPage.displayName = "SaleDetailsPage";
export default SaleDetailsPage;
