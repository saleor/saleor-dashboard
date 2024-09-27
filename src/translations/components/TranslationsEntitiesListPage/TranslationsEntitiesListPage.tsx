import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import FilterTabs, { FilterTab } from "@dashboard/components/TableFilter";
import { LanguageFragment } from "@dashboard/graphql";
import { maybe } from "@dashboard/misc";
import React from "react";
import { useIntl } from "react-intl";

import { languageListUrl, TranslatableEntities } from "../../urls";

interface TranslationsEntitiesListPageProps {
  children: React.ReactNode;
  filters: TranslationsEntitiesFilters;
  language: LanguageFragment;
}

interface TranslationsEntitiesFilters {
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
    <>
      <TopNav
        href={languageListUrl}
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
      <DashboardCard>
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
      </DashboardCard>
    </>
  );
};

TranslationsEntitiesListPage.displayName = "TranslationsEntitiesListPage";
export default TranslationsEntitiesListPage;
