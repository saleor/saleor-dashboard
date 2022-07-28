import { Card } from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import FilterTabs, { FilterTab } from "@saleor/components/TableFilter";
import { LanguageFragment } from "@saleor/graphql";
import { maybe } from "@saleor/misc";
import React from "react";
import { useIntl } from "react-intl";

import { languageListUrl, TranslatableEntities } from "../../urls";

export interface TranslationsEntitiesListPageProps {
  children: React.ReactNode;
  filters: TranslationsEntitiesFilters;
  language: LanguageFragment;
}

export interface TranslationsEntitiesFilters {
  current: TranslationsEntitiesListFilterTab;
  onCategoriesTabClick: () => void;
  onCollectionsTabClick: () => void;
  onProductsTabClick: () => void;
  onSalesTabClick: () => void;
  onVouchersTabClick: () => void;
  onPagesTabClick: () => void;
  onAttributesTabClick: () => void;
  onShippingMethodsTabClick: () => void;
  onMenuItemsTabClick: () => void;
}

export type TranslationsEntitiesListFilterTab = keyof typeof TranslatableEntities;

const tabs: TranslationsEntitiesListFilterTab[] = [
  "categories",
  "collections",
  "products",
  "sales",
  "vouchers",
  "pages",
  "attributes",
  "shippingMethods",
  "menuItems",
];

const TranslationsEntitiesListPage: React.FC<TranslationsEntitiesListPageProps> = props => {
  const { filters, language, children } = props;

  const intl = useIntl();
  const queryTab = tabs.indexOf(filters.current);
  const currentTab = queryTab >= 0 ? queryTab : 0;

  return (
    <Container>
      <Backlink href={languageListUrl}>
        {intl.formatMessage({
          id: "GsBRWL",
          defaultMessage: "Languages",
        })}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(
          {
            id: "FemBUF",
            defaultMessage: "Translations to {language}",
            description: "header",
          },
          {
            language: maybe(() => language.language, "..."),
          },
        )}
      />
      <Card>
        <FilterTabs currentTab={currentTab}>
          <FilterTab
            label={intl.formatMessage({
              id: "VKb1MS",
              defaultMessage: "Categories",
            })}
            onClick={filters.onCategoriesTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              id: "ulh3kf",
              defaultMessage: "Collections",
            })}
            onClick={filters.onCollectionsTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              id: "7NFfmz",
              defaultMessage: "Products",
            })}
            onClick={filters.onProductsTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              id: "c8nvms",
              defaultMessage: "Sales",
            })}
            onClick={filters.onSalesTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              id: "etP0+D",
              defaultMessage: "Vouchers",
            })}
            onClick={filters.onVouchersTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              id: "CxfKLC",
              defaultMessage: "Pages",
            })}
            onClick={filters.onPagesTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              id: "+xTpT1",
              defaultMessage: "Attributes",
            })}
            onClick={filters.onAttributesTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              id: "RzsKm8",
              defaultMessage: "Shipping methods",
            })}
            onClick={filters.onShippingMethodsTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              id: "AcMzwj",
              defaultMessage: "Menu items",
            })}
            onClick={filters.onMenuItemsTabClick}
          />
        </FilterTabs>
        {children}
      </Card>
    </Container>
  );
};
TranslationsEntitiesListPage.displayName = "TranslationsEntitiesListPage";
export default TranslationsEntitiesListPage;
