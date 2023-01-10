import { pageListProps, searchPageProps } from "@saleor/fixtures";
import { LanguageCodeEnum } from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

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

storiesOf("Translations / Entity list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => (
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
  ));
