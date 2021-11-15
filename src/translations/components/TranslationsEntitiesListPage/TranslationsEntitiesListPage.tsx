import { Card } from "@material-ui/core";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { ShopInfo_shop_languages } from "@saleor/components/Shop/types/ShopInfo";
import FilterTabs, { FilterTab } from "@saleor/components/TableFilter";
import { Backlink } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import React from "react";
import { useIntl } from "react-intl";

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
  onAttributesTabClick: () => void;
  onShippingMethodsTabClick: () => void;
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
  "shippingMethods"
];

const TranslationsEntitiesListPage: React.FC<TranslationsEntitiesListPageProps> = props => {
  const { filters, language, onBack, children } = props;

  const intl = useIntl();
  const queryTab = tabs.indexOf(filters.current);
  const currentTab = queryTab >= 0 ? queryTab : 0;

  return (
    <Container>
      <Backlink onClick={onBack}>
        {intl.formatMessage({
          defaultMessage: "Languages"
        })}
      </Backlink>
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
        <FilterTabs currentTab={currentTab}>
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
              defaultMessage: "Attributes"
            })}
            onClick={filters.onAttributesTabClick}
          />
          <FilterTab
            label={intl.formatMessage({
              defaultMessage: "Shipping methods"
            })}
            onClick={filters.onShippingMethodsTabClick}
          />
        </FilterTabs>
        {children}
      </Card>
    </Container>
  );
};
TranslationsEntitiesListPage.displayName = "TranslationsEntitiesListPage";
export default TranslationsEntitiesListPage;
