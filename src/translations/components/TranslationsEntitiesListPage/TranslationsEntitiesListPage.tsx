import Card from "@material-ui/core/Card";
import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
// tslint:disable no-submodule-imports
import { ShopInfo_shop_languages } from "@saleor/components/Shop/types/ShopInfo";
import FilterTabs, { FilterTab } from "@saleor/components/TableFilter";
import { maybe } from "@saleor/misc";
import { TranslatableEntities } from "../../urls";

export interface TranslationsEntitiesListPageProps {
  children: React.ReactNode;
  filters: TranslationsEntitiesFilters;
  language: ShopInfo_shop_languages;
  onBack: () => void;
}

export interface TranslationsEntitiesFilters {
  current: TranslationsEntitiesListFilterTab;
  onCategoriesTabClick: () => void;
  onCollectionsTabClick: () => void;
  onProductsTabClick: () => void;
  onSalesTabClick: () => void;
  onVouchersTabClick: () => void;
  onPagesTabClick: () => void;
  onProductTypesTabClick: () => void;
}

export type TranslationsEntitiesListFilterTab = keyof typeof TranslatableEntities;

const TranslationsEntitiesListPage: React.StatelessComponent<
  TranslationsEntitiesListPageProps
> = ({ filters, language, onBack, children }) => {
  const intl = useIntl();

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage({
          defaultMessage: "Languages"
        })}
      </AppHeader>
      <PageHeader
        title={intl.formatMessage(
          {
            defaultMessage: "Translations to {language}",
            description: "header"
          },
          {
            language: maybe(() => language.language, "...")
          }
        )}
      />
      <Card>
        <FilterTabs
          currentTab={([
            "categories",
            "collections",
            "products",
            "sales",
            "vouchers",
            "pages",
            "productTypes"
          ] as TranslationsEntitiesListFilterTab[]).indexOf(filters.current)}
        >
          <FilterTab
            label={intl.formatMessage({
              defaultMessage: "Categories"
            })}
            onClick={filters.onCategoriesTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              defaultMessage: "Collections"
            })}
            onClick={filters.onCollectionsTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              defaultMessage: "Products"
            })}
            onClick={filters.onProductsTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              defaultMessage: "Sales"
            })}
            onClick={filters.onSalesTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              defaultMessage: "Vouchers"
            })}
            onClick={filters.onVouchersTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              defaultMessage: "Pages"
            })}
            onClick={filters.onPagesTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              defaultMessage: "Product Types"
            })}
            onClick={filters.onProductTypesTabClick}
          />
        </FilterTabs>
        {children}
      </Card>
    </Container>
  );
};
TranslationsEntitiesListPage.displayName = "TranslationsEntitiesListPage";
export default TranslationsEntitiesListPage;
