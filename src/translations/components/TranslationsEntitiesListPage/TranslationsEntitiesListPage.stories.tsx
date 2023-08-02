// @ts-strict-ignore
import { pageListProps, searchPageProps } from "@dashboard/fixtures";
import { LanguageCodeEnum } from "@dashboard/graphql";
import { Meta, StoryObj } from "@storybook/react";
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

const ListPage = props => (
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

const meta: Meta<typeof ListPage> = {
  title: "Translations / Entity list",
  decorators: [PaginatorContextDecorator],
  component: ListPage,
};
export default meta;
type Story = StoryObj<typeof ListPage>;

export const Default: Story = {
  args: {
    ...props,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
