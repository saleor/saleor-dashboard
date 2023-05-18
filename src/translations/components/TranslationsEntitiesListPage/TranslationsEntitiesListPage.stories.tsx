import { pageListProps, searchPageProps } from "@dashboard/fixtures";
import { LanguageCodeEnum } from "@dashboard/graphql";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import TranslationsEntitiesList from "../TranslationsEntitiesList";
import TranslationsEntitiesListPage, {
  TranslationsEntitiesListPageProps,
} from "./TranslationsEntitiesListPage";

const props: TranslationsEntitiesListPageProps = {
  ...pageListProps.default,
  ...searchPageProps,
  children: null,
  filters: {
    current: "products",
    onCategoriesTabClick: () => undefined,
    onCollectionsTabClick: () => undefined,
    onPagesTabClick: () => undefined,
    onAttributesTabClick: () => undefined,
    onProductsTabClick: () => undefined,
    onSalesTabClick: () => undefined,
    onShippingMethodsTabClick: () => undefined,
    onVouchersTabClick: () => undefined,
    onMenuItemsTabClick: () => undefined,
  },
  language: {
    __typename: "LanguageDisplay",
    code: LanguageCodeEnum.EN,
    language: "English",
  },
};

export default {
  title: "Translations / Entity list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => (
  <TranslationsEntitiesListPage {...props}>
    <TranslationsEntitiesList
      disabled={false}
      entities={[
        {
          completion: { current: 1, max: 3 },
          id: "1",
          name: "White Hoodie",
        },
        {
          completion: { current: 2, max: 3 },
          id: "1",
          name: "Brown Supreme Hoodie",
        },
      ]}
      getRowHref={() => ""}
    />
  </TranslationsEntitiesListPage>
);
